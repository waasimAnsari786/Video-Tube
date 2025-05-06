/**
 * this slice calls methods from "authService" object in each "thunk" and then returns
 * the data "object" from axios response and error if requests fails. Data object
 * contains the returned response from the server. "initialState" is an object
 * that contains "loading" and "error" states for displaying pending and falied message
 * to the user in the UI, "authStatus" is for storing the status of user
 * (is he logged-in?), remaining states are for displaying user-data in the diferent
 * sections of UI */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";
import updateStateFromResponse from "../utils/updateStateFromResponse";

const initialState = {
  loading: false,
  error: null,
  fullName: "",
  email: "",
  userName: "",
  avatar: {},
  coverImage: {},
  authStatus: false,
};

// Async thunks...
const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      await authService.createAccount(formData);
      const loggedInAccount = await authService.loginAccount(formData);
      return loggedInAccount.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "User hasn't registered"
      );
    }
  }
);

const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const loggedInAccount = await authService.loginAccount(formData);
      return loggedInAccount.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "User hasn't logged-in"
      );
    }
  }
);

const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getUser();
      return user.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "User hasn't fetched"
      );
    }
  }
);

const updateUserDetailsThunk = createAsyncThunk(
  "auth/updateUserDetails",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await authService.updateUserDetails(updatedData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

const updatePasswordThunk = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authService.updatePassword(passwordData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const refreshAccessTokenThunk = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshAccessToken();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Refresh failed");
    }
  }
);
const updateAvatarThunk = createAsyncThunk(
  "auth/updateAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authService.updateAvatar(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);
const updateCoverImageThunk = createAsyncThunk(
  "auth/updateCoverImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authService.updateCoverImage(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authStatus = true;
        updateStateFromResponse(state, action.payload.data);
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Current User
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authStatus = true;
        localStorage.setItem("refreshToken", action.payload.data.refreshToken);
        updateStateFromResponse(state, action.payload.data);
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Details
      .addCase(updateUserDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.fullName = action.payload.data.fullName;
        state.email = action.payload.data.email;
      })
      .addCase(updateUserDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Password
      .addCase(updatePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authStatus = false;
        Object.assign(state, initialState); // resets all user data
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshAccessTokenThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(refreshAccessTokenThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authStatus = true;
        updateStateFromResponse(state, action.payload.data);
        localStorage.setItem("refreshToken", action.payload.data.refreshToken);
      })
      .addCase(refreshAccessTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Avatar
      .addCase(updateAvatarThunk.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateAvatarThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.avatar = action.payload.data;
      })
      .addCase(updateAvatarThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cover Image
      .addCase(updateCoverImageThunk.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateCoverImageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coverImage = action.payload.data;
      })
      .addCase(updateCoverImageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export {
  registerUserThunk,
  loginUserThunk,
  getCurrentUserThunk,
  updateUserDetailsThunk,
  updatePasswordThunk,
  logoutThunk,
  refreshAccessTokenThunk,
  updateAvatarThunk,
  updateCoverImageThunk,
};

export default authSlice.reducer;
