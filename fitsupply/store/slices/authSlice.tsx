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
  if (typeof error === "string") return error;
  if (error?.detail) return error.detail;
  if (error && typeof error === "object") {
    const messages = Object.values(error).flat();
    return messages.join(" ");
  }
  return "An unknown error occurred.";
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    // Base URL is already http://127.0.0.1:8000/api/v1
    // So just use /token/ here
    const response = await api.post("/token/", credentials);
    const token = response.data.access;

    // Save token to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }

    // Set token in API client for future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return token;
  } catch (error: any) {
    return rejectWithValue(parseDfrError(error.response?.data));
  }
});

// Async thunk to fetch user
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

      const response = await api.get("/user/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch user details"
      );
    }
  }
);

// Async thunk for registration
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
    // Temporarily remove auth header for this public endpoint
    const originalAuthHeader = api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["Authorization"];

    const response = await api.post("/register/", userData);
    const token = response.data.access_token;

    // Save token to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }

    // Set token in API client for future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return response.data; // Contains { user, access_token }
  } catch (error: any) {
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
    const response = await api.get("/user/");
    return response.data;
  } catch (error: any) {
    // Token is invalid, clear it
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
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
        state.token = action.payload; // payload is the token string
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })

      // FETCH USER
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch user";
        state.isAuthenticated = false;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      })

      // INITIALIZE AUTH
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.status = "idle";
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
