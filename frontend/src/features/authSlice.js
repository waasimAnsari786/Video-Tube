import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

const initialState = {
  user: null,
  loading: false,
  error: null,
  fullName: "",
  email: "",
  userName: "",
  avatar: {},
  coverImage: {},
  refreshToken: "",
  authStatus: false,
};

// Async thunk for registration
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

// Async thunk for login
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
// Async thunk for get current user
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

// Async thunk for updating user details
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
// Async thunk for updating password
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
// Async thunk for logging-out
const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
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
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.authStatus = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.authStatus = true;
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export {
  registerUserThunk,
  loginUserThunk,
  getCurrentUserThunk,
  updateUserDetailsThunk,
  updatePasswordThunk,
  logoutThunk,
};
export default authSlice.reducer;
