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
          return rejectWithValue({
            message: "get request cancelled",
            errorCode: "GET_REQUEST_CANCELLED",
          });
        }

        // Ensure consistent rejection structure
        return rejectWithValue(
          err.response?.data || {
            message: "GET failed",
            errorCode: "GET_ERROR",
          }
        );
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
          return rejectWithValue({
            message: "post request cancelled",
            errorCode: "POST_REQUEST_CANCELLED",
          });
        }

        // Ensure consistent rejection structure
        return rejectWithValue(
          err.response?.data || {
            message: "POST failed",
            errorCode: "POST_ERROR",
          }
        );
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
          return rejectWithValue({
            message: "patch request cancelled",
            errorCode: "PATCH_REQUEST_CANCELLED",
          });
        }

        // Ensure consistent rejection structure
        return rejectWithValue(
          err.response?.data || {
            message: "PATCH failed",
            errorCode: "PATCH_ERROR",
          }
        );
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
          return rejectWithValue({
            message: "delete request cancelled",
            errorCode: "DELETE_REQUEST_CANCELLED",
          });
        }

        // Ensure consistent rejection structure
        return rejectWithValue(
          err.response?.data || {
            message: "DELETE failed",
            errorCode: "DELETE_ERROR",
          }
        );
      }
    };
  }
}

export default new AsyncThunk();
