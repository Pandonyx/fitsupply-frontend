import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

// Define the shape of the user and the auth state
interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  name?: string; // Keep for compatibility if used elsewhere, but prefer new fields
  is_staff?: boolean; // Important for admin access later
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

/**
 * Parses a Django REST Framework error response into a single string.
 * @param error The error object from the API response.
 * @returns A user-friendly error string.
 */
const parseDfrError = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    // Handle common 'detail' key for auth errors
    if (error.detail) {
      return error.detail;
    }
    // Handle validation errors (field-specific)
    const messages = Object.values(error).flat();
    return messages.join(" ");
  }
  return "An unknown error occurred.";
};
// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/token/", credentials);
      // With simple-jwt, the user object is not returned on login.
      // We get the token, then we can fetch the user.
      const { access } = response.data;
      // We don't have the user data yet, just the token.
      // The user data will be fetched in the fulfilled case.
      // We return the access token to be stored in the state.
      return { token: access };
    } catch (error: any) {
      return rejectWithValue(parseDfrError(error.response?.data));
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      password2: string;
      first_name: string;
      last_name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/register/", userData);
      // Assuming the API returns { token, user } upon successful registration
      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseDfrError(error.response?.data));
    }
  }
);

// Async thunk to fetch user details using the token
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      // The interceptor in apiClient will add the token to the header
      const response = await api.get("/user/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch user details"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string }>) => {
          state.status = "succeeded"; // Or 'loading' while we fetch the user
          state.token = action.payload.token;
          state.isAuthenticated = true;
          // User object is not part of the payload anymore, will be fetched by fetchUser
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (
          state,
          action: PayloadAction<{ user: User; access_token: string }>
        ) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          state.token = action.payload.access_token; // dj-rest-auth often returns access_token
          state.isAuthenticated = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
