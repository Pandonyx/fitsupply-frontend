import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

// Define the shape of the user and the auth state
interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  name?: string;
  is_staff?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Load token from localStorage on initialization
const loadTokenFromStorage = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  token: loadTokenFromStorage(),
  isAuthenticated: false,
  status: "idle",
  error: null,
};

// Parse DRF errors
const parseDfrError = (error: any): string => {
  console.log("Parsing error:", error);
  console.log("Error type:", typeof error);

  if (typeof error === "string") return error;
  if (error?.detail) return error.detail;
  if (error?.non_field_errors) return error.non_field_errors.join(" ");
  if (error && typeof error === "object") {
    const messages = Object.values(error).flat().filter(Boolean);
    return messages.length > 0 ? messages.join(" ") : "An error occurred";
  }
  return "An unknown error occurred.";
};

// Async thunk for login - using your Django JWT setup
export const loginUser = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    console.log("Attempting login with:", credentials);

    // Your Django JWT endpoint (no leading slash since baseURL includes /api/v1)
    const response = await api.post("token/", credentials);

    console.log("Login response:", response.data);

    const token = response.data.access;

    if (!token) {
      return rejectWithValue("No access token received from server");
    }

    // Save token to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }

    // Set token in API client for future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return token;
  } catch (error: any) {
    console.error("Login error:", error.response?.data);
    return rejectWithValue(parseDfrError(error.response?.data));
  }
});

// Async thunk to fetch user - using your Django user endpoint
export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get token from state
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      // Ensure token is set in headers
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      console.log("Fetching user profile...");

      // Your Django user profile endpoint (no leading slash since baseURL includes /api/v1)
      const response = await api.get("user/");

      console.log("User profile response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("Fetch user error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch user details"
      );
    }
  }
);

// Async thunk for registration - using your Django registration endpoint
export const registerUser = createAsyncThunk<
  { user: User; access_token: string },
  {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  },
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    console.log("Attempting registration with:", userData);

    // Temporarily remove auth header for this public endpoint
    const originalAuthHeader = api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["Authorization"];

    // Your Django registration endpoint (no leading slash since baseURL includes /api/v1)
    const response = await api.post("register/", userData);

    console.log("Registration response:", response.data);

    console.log("Registration response structure:", response.data);

    // Handle Django response format exactly as shown in network tab
    const user = response.data.user;
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    if (accessToken && user) {
      // Save tokens to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
      }

      // Set token in API client for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      console.log("Registration successful with token");
      return { user, access_token: accessToken };
    } else {
      console.log("Registration response missing required fields");
      return { user: user || response.data, access_token: "" };
    }
  } catch (error: any) {
    console.error("Registration error:", error.response?.data);
    console.error("Registration error status:", error.response?.status);

    // If it's actually a successful status code, don't treat it as an error
    if (error.response?.status === 201 || error.response?.status === 200) {
      console.log("Registration actually succeeded, treating as success");
      const user = error.response.data.user || error.response.data;
      const token =
        error.response.data.access ||
        error.response.data.access_token ||
        error.response.data.token;

      if (token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return { user, access_token: token };
      } else {
        return { user, access_token: "" };
      }
    }

    return rejectWithValue(parseDfrError(error.response?.data));
  } finally {
    // Restore the original auth header after the request is complete
    if (originalAuthHeader) {
      api.defaults.headers.common["Authorization"] = originalAuthHeader;
    }
  }
});

// Thunk to initialize auth from stored token
export const initializeAuth = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/initialize", async (_, { rejectWithValue }) => {
  const token = loadTokenFromStorage();
  if (!token) {
    return rejectWithValue("No token found");
  }

  // Set token in API client
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    console.log("Initializing auth with stored token...");

    // Your Django user profile endpoint (no leading slash since baseURL includes /api/v1)
    const response = await api.get("user/");

    console.log("Initialize auth response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Initialize auth error:", error.response?.data);
    // Token is invalid, clear it
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    delete api.defaults.headers.common["Authorization"];
    return rejectWithValue("Invalid token");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;

      // Clear token from localStorage and API client
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      delete api.defaults.headers.common["Authorization"];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.token = null;
      })

      // FETCH USER
      .addCase(fetchUser.pending, (state) => {
        // Don't set status to loading for user fetch to avoid UI flicker
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch user";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        // Clear invalid token
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        if (action.payload.access_token) {
          state.token = action.payload.access_token;
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
        state.isAuthenticated = false;
      })

      // INITIALIZE AUTH
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.status = "idle";
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
