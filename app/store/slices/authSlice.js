import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthenticationService from "../services/AuthenticationService";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthenticationService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AuthenticationService.signup(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthenticationService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthenticationService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to get user data");
    }
  }
);

export const updateMe = createAsyncThunk(
  "auth/updateMe",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AuthenticationService.updateMe(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await AuthenticationService.updatePassword(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Password update failed");
    }
  }
);

const initialState = {
  user: null,
  token: AuthenticationService.getToken(),
  isAuthenticated: AuthenticationService.isAuthenticated(),
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.token || null;
        state.error = null;
        state.successMessage = "Login successful!";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || "Login failed";
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.token || null;
        state.error = null;
        state.successMessage = "Account created successfully!";
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.successMessage = "Logged out successfully!";
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || "Logout failed";
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || null;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get user data";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Update user
      .addCase(updateMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || state.user;
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
      })
      // Update password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token || state.token;
        state.successMessage = "Password updated successfully!";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password update failed";
      });
  },
});

export const { clearError, clearSuccessMessage, setUser, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
