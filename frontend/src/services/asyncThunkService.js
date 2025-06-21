// ✅ This class contains generic async thunk functions (`getThunk`, `postThunk`, `patchThunk`, `deleteThunk`).
// ✅ Each thunk uses the shared `axiosInstance` directly to perform API requests.
// ✅ All thunks follow a consistent structure with built-in error handling using `rejectWithValue`.
// ✅ These methods are passed to `createAsyncThunk` in Redux slices to avoid boilerplate code.
// ✅ This approach centralizes API logic and ensures reusable, clean async actions.

import { axiosInstance } from "../index";

class AsyncThunk {
  getThunk() {
    return async ({ url, config = {} }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(url, config);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "GET failed");
      }
    };
  }

  postThunk() {
    return async ({ url, payload, config = {} }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(url, payload, config);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "POST failed");
      }
    };
  }

  patchThunk() {
    return async ({ url, payload, config = {} }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.patch(url, payload, config);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "PATCH failed");
      }
    };
  }

  deleteThunk() {
    return async ({ url, config = {} }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(url, config);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "DELETE failed");
      }
    };
  }
}

export default new AsyncThunk();
