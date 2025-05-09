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
import asyncThunkService from "../services/asyncThunkService";
import { initializeLoading, updateloadingAndError } from "../utils/thunkUtils";

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
};

// // Async thunks...
// const registerUserThunk = createAsyncThunk(
//   "auth/registerUser",
//   async (formData, { rejectWithValue }) => {
//     try {
//       await authService.createAccount(formData);
//       const loggedInAccount = await authService.loginAccount(formData);
//       return loggedInAccount.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "User hasn't registered"
//       );
//     }
//   }
// );

// const loginUserThunk = createAsyncThunk(
//   "auth/loginUser",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const loggedInAccount = await authService.loginAccount(formData);
//       return loggedInAccount.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "User hasn't logged-in"
//       );
//     }
//   }
// );

// const getCurrentUserThunk = createAsyncThunk(
//   "auth/getCurrentUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const user = await authService.getUser();
//       return user.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "User hasn't fetched"
//       );
//     }
//   }
// );

// const updateUserDetailsThunk = createAsyncThunk(
//   "auth/updateUserDetails",
//   async (updatedData, { rejectWithValue }) => {
//     try {
//       const response = await authService.updateUserDetails(updatedData);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Update failed");
//     }
//   }
// );

// const updatePasswordThunk = createAsyncThunk(
//   "auth/updatePassword",
//   async (passwordData, { rejectWithValue }) => {
//     try {
//       const response = await authService.updatePassword(passwordData);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Update failed");
//     }
//   }
// );

// const logoutThunk = createAsyncThunk(
//   "auth/logout",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await authService.logout();
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Logout failed");
//     }
//   }
// );

// const refreshAccessTokenThunk = createAsyncThunk(
//   "auth/refreshAccessToken",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await authService.refreshAccessToken();
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Refresh failed");
//     }
//   }
// );

// const updateAvatarThunk = createAsyncThunk(
//   "auth/updateAvatar",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await authService.updateAvatar(formData);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Update failed");
//     }
//   }
// );

// const updateCoverImageThunk = createAsyncThunk(
//   "auth/updateCoverImage",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await authService.updateCoverImage(formData);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Update failed");
//     }
//   }
// );

// const getChannelDetailsThunk = createAsyncThunk(
//   "auth/getChannelDetails",
//   async (userName, { rejectWithValue }) => {
//     try {
//       const response = await authService.getUserChannelDetails(userName);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch");
//     }
//   }
// );

// const deleteAvatarThunk = createAsyncThunk(
//   "auth/deleteAvatar",
//   async (fileData, { rejectWithValue }) => {
//     try {
//       const response = await authService.deleteAvatar(fileData);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Delete failed");
//     }
//   }
// );

// For user registration (custom logic - not using generic thunk)
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
      .addCase(registerUserThunk.pending, initializeLoading)
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUserThunk.rejected, updateloadingAndError)

      // Login
      .addCase(loginUserThunk.pending, initializeLoading)
      .addCase(loginUserThunk.fulfilled, updateUserInfo)
      .addCase(loginUserThunk.rejected, updateloadingAndError)

      // Get Current User
      .addCase(getCurrentUserThunk.pending, initializeLoading)
      .addCase(getCurrentUserThunk.fulfilled, updateUserInfo)
      .addCase(getCurrentUserThunk.rejected, updateloadingAndError)

      // Update User Details
      .addCase(updateUserDetailsThunk.pending, initializeLoading)
      .addCase(updateUserDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.fullName = action.payload.data.fullName;
        state.email = action.payload.data.email;
      })
      .addCase(updateUserDetailsThunk.rejected, updateloadingAndError)

      // Update Password
      .addCase(updatePasswordThunk.pending, initializeLoading)
      .addCase(updatePasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePasswordThunk.rejected, updateloadingAndError)

      // Logout
      .addCase(logoutThunk.pending, initializeLoading)
      .addCase(logoutThunk.fulfilled, (state) => {
        Object.assign(state, initialState); // reset to initial state
      })
      .addCase(logoutThunk.rejected, updateloadingAndError)

      // Refresh Token
      .addCase(refreshAccessTokenThunk.pending, initializeLoading)
      .addCase(refreshAccessTokenThunk.fulfilled, updateUserInfo)
      .addCase(refreshAccessTokenThunk.rejected, updateloadingAndError)

      // Update Avatar
      .addCase(updateAvatarThunk.pending, initializeLoading)
      .addCase(updateAvatarThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.avatar = action.payload.data;
      })
      .addCase(updateAvatarThunk.rejected, updateloadingAndError)

      // Update Cover Image
      .addCase(updateCoverImageThunk.pending, initializeLoading)
      .addCase(updateCoverImageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coverImage = action.payload.data;
      })
      .addCase(updateCoverImageThunk.rejected, updateloadingAndError)

      // Channel Details
      .addCase(getChannelDetailsThunk.pending, initializeLoading)
      .addCase(getChannelDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.channelData = action.payload.data;
      })
      .addCase(getChannelDetailsThunk.rejected, updateloadingAndError)

      // Delete Avatar
      .addCase(deleteAvatarThunk.pending, initializeLoading)
      .addCase(deleteAvatarThunk.fulfilled, (state) => {
        state.loading = false;
        state.avatar = {};
      })
      .addCase(deleteAvatarThunk.rejected, updateloadingAndError)

      // Delete Cover Image
      .addCase(deleteCoverImageThunk.pending, initializeLoading)
      .addCase(deleteCoverImageThunk.fulfilled, (state) => {
        state.loading = false;
        state.coverImage = {};
      })
      .addCase(deleteCoverImageThunk.rejected, updateloadingAndError);
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
