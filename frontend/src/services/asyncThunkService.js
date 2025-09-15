// 📦 AsyncThunk Utility Class
// Provides factory methods to generate reusable async thunks for CRUD API requests.
// Each thunk automatically:
//   - Wraps axiosInstance calls with standardized error handling.
//   - Supports request cancellation via AbortController.
//   - Optionally applies retry logic when retryRequestOptions are passed at dispatch time.
// This abstraction removes repetitive boilerplate in Redux slices and ensures a consistent,
// flexible, and centralized API request flow across the application.

import { axiosInstance, requestWithRetry } from "../index";

class AsyncThunk {
  getThunk() {
    return async (
      { url, config = {}, retryRequestOptions = {} },
      { rejectWithValue }
    ) => {
      try {
        const response = await requestWithRetry(
          () => axiosInstance.get(url, config),
          retryRequestOptions
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err);
      }
    };
  }

  postThunk() {
    return async (
      { url, payload, config = {}, retryRequestOptions = {} },
      { rejectWithValue }
    ) => {
      try {
        const response = await requestWithRetry(
          () => axiosInstance.post(url, payload, config),
          retryRequestOptions
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err);
      }
    };
  }

  patchThunk() {
    return async (
      { url, payload, config = {}, retryRequestOptions = {} },
      { rejectWithValue }
    ) => {
      try {
        const response = await requestWithRetry(
          () => axiosInstance.patch(url, payload, config),
          retryRequestOptions
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err);
      }
    };
  }

  deleteThunk() {
    return async (
      { url, config = {}, retryRequestOptions = {} },
      { rejectWithValue }
    ) => {
      try {
        const response = await requestWithRetry(
          () => axiosInstance.delete(url, config),
          retryRequestOptions
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err);
      }
    };
  }
}

export default new AsyncThunk();
