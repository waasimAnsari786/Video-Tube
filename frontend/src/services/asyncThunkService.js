// 📦 AsyncThunk Utility Class:
// Provides reusable async thunks for CRUD API requests using axiosInstance.
// Each method (getThunk, postThunk, patchThunk, deleteThunk):
//   - Wraps axios calls in a consistent try/catch pattern.
//   - Handles request cancellation gracefully via AbortController signals.
//   - Returns the server response data or a clear rejectWithValue message on failure.
// This abstraction reduces boilerplate and ensures uniform error handling across Redux thunks.

import { axiosInstance } from "../index";

class AsyncThunk {
  getThunk() {
    return async ({ url, config = {} }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(url, config);
        return response.data;
      } catch (err) {
        if (config.signal.aborted) {
          console.log("get request cancelled");
          return rejectWithValue("get request cancelled");
        } // silent cancellation
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
        if (config.signal.aborted) {
          return rejectWithValue("post request cancelled");
        }
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
        if (config.signal.aborted) {
          console.log("patch request cancelled");
          return rejectWithValue("patch request cancelled");
        }
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
        if (config.signal.aborted) {
          console.log("delete request cancelled");
          return rejectWithValue("delete request cancelled");
        }
        return rejectWithValue(err.response?.data?.message || "DELETE failed");
      }
    };
  }
}

export default new AsyncThunk();
