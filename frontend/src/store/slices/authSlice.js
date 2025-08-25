// ✅ This slice manages all authentication-related state and async logic using Redux Toolkit.
// ✅ Initial state includes user info, auth status, loading/error flags, and channel/media data.
// ✅ Custom thunk `registerUserThunk` handles user registration followed by auto-login.
// ✅ Other thunks (login, logout, update, fetch) use reusable generic methods from `asyncThunkService`.
// ✅ Each thunk handles its own pending, fulfilled, and rejected states via `extraReducers`.
// ✅ Utility functions (`updateStateOnPending`, `updateStateOnRejected`, `updateStateFromResponse`) are used for cleaner state
// updates.
// ✅ State is fully reset on logout using `Object.assign(state, initialState)`.
// ✅ All thunks and the reducer are exported for external use.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  updateStateOnPending,
  updateStateOnRejected,
  updateStateFromResponse,
  axiosInstance,
} from "../../index";
import { asyncThunkService } from "../../services";

const initialState = {
  loading: false,
  error: null,
  fullName: "",
  email: "",
  userName: "",
  avatar: {},
  coverImage: {},
  authStatus: false,
  channelData: {},
  google: {},
  isEmailVerified: false,
};

// For user registration (custom logic - not using generic thunk)
const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async ({ formData, signal }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users", formData, { signal });
      return res.data;
    } catch (err) {
      if (signal.aborted) {
        console.log("Register user request cancelled");
        return rejectWithValue("Register user request cancelled");
      }
      return rejectWithValue(
        err.response?.data?.message || "User hasn't registered"
      );
    }
  }
);

// Login
const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  asyncThunkService.postThunk()
);

// Get current user (GET)
const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  asyncThunkService.getThunk()
);

// Update user details (PATCH)
const updateUserDetailsThunk = createAsyncThunk(
  "auth/updateUserDetails",
  asyncThunkService.patchThunk()
);

// Update password (PATCH)
const updatePasswordThunk = createAsyncThunk(
  "auth/updatePassword",
  asyncThunkService.patchThunk()
);

// Logout (POST)
const logoutThunk = createAsyncThunk(
  "auth/logout",
  asyncThunkService.postThunk()
);

// Refresh token (POST)
const refreshAccessTokenThunk = createAsyncThunk(
  "auth/refreshAccessToken",
  asyncThunkService.postThunk()
);

// Update avatar (PATCH)
const updateAvatarThunk = createAsyncThunk(
  "auth/updateAvatar",
  asyncThunkService.patchThunk()
);

// Update cover image (PATCH)
const updateCoverImageThunk = createAsyncThunk(
  "auth/updateCoverImage",
  asyncThunkService.patchThunk()
);

// Get channel details (GET)
const getChannelDetailsThunk = createAsyncThunk(
  "auth/getChannelDetails",
  asyncThunkService.getThunk()
);

// Delete avatar (DELETE)
const deleteAvatarThunk = createAsyncThunk(
  "auth/deleteAvatar",
  asyncThunkService.deleteThunk()
);

// Delete cover image (DELETE)
const deleteCoverImageThunk = createAsyncThunk(
  "auth/deleteCoverImage",
  asyncThunkService.deleteThunk()
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const updateUserInfo = (state, action) => {
      state.loading = false;
      state.authStatus = true;
      updateStateFromResponse(state, action.payload.data);
    };

    builder
      // Register
      .addCase(registerUserThunk.pending, updateStateOnPending)
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.data;
      })
      .addCase(registerUserThunk.rejected, updateStateOnRejected)

      // Login
      .addCase(loginUserThunk.pending, updateStateOnPending)
      .addCase(loginUserThunk.fulfilled, updateUserInfo)
      .addCase(loginUserThunk.rejected, updateStateOnRejected)

      // Get Current User
      .addCase(getCurrentUserThunk.pending, updateStateOnPending)
      .addCase(getCurrentUserThunk.fulfilled, updateUserInfo)
      .addCase(getCurrentUserThunk.rejected, updateStateOnRejected)

      // Update User Details
      .addCase(updateUserDetailsThunk.pending, updateStateOnPending)
      .addCase(updateUserDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.fullName = action.payload.data.fullName;
        state.email = action.payload.data.email;
      })
      .addCase(updateUserDetailsThunk.rejected, updateStateOnRejected)

      // Update Password
      .addCase(updatePasswordThunk.pending, updateStateOnPending)
      .addCase(updatePasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePasswordThunk.rejected, updateStateOnRejected)

      // Logout
      .addCase(logoutThunk.pending, updateStateOnPending)
      .addCase(logoutThunk.fulfilled, (state) => {
        Object.assign(state, initialState); // reset to initial state
      })
      .addCase(logoutThunk.rejected, updateStateOnRejected)

      // Refresh Token
      .addCase(refreshAccessTokenThunk.pending, updateStateOnPending)
      .addCase(refreshAccessTokenThunk.fulfilled, updateUserInfo)
      .addCase(refreshAccessTokenThunk.rejected, updateStateOnRejected)

      // Update Avatar
      .addCase(updateAvatarThunk.pending, updateStateOnPending)
      .addCase(updateAvatarThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.avatar = action.payload.data;
      })
      .addCase(updateAvatarThunk.rejected, updateStateOnRejected)

      // Update Cover Image
      .addCase(updateCoverImageThunk.pending, updateStateOnPending)
      .addCase(updateCoverImageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coverImage = action.payload.data;
      })
      .addCase(updateCoverImageThunk.rejected, updateStateOnRejected)

      // Channel Details
      .addCase(getChannelDetailsThunk.pending, updateStateOnPending)
      .addCase(getChannelDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.channelData = action.payload.data;
      })
      .addCase(getChannelDetailsThunk.rejected, updateStateOnRejected)

      // Delete Avatar
      .addCase(deleteAvatarThunk.pending, updateStateOnPending)
      .addCase(deleteAvatarThunk.fulfilled, (state) => {
        state.loading = false;
        state.avatar = {};
      })
      .addCase(deleteAvatarThunk.rejected, updateStateOnRejected)

      // Delete Cover Image
      .addCase(deleteCoverImageThunk.pending, updateStateOnPending)
      .addCase(deleteCoverImageThunk.fulfilled, (state) => {
        state.loading = false;
        state.coverImage = {};
      })
      .addCase(deleteCoverImageThunk.rejected, updateStateOnRejected);
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
  getChannelDetailsThunk,
  deleteAvatarThunk,
  deleteCoverImageThunk,
};

export default authSlice.reducer;
