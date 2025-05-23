// ✅ This class contains generic async thunk functions (`getThunk`, `postThunk`, `patchThunk`, `deleteThunk`).
// ✅ Each thunk follows a unified pattern for error handling using `rejectWithValue`.
// ✅ Internally, it uses ApiRequestService to call relevant request methods (e.g., get, post).
// ✅ These thunks are passed directly to `createAsyncThunk` in authThunks or other slices.
// ✅ It helps reduce redundancy and ensures all thunks follow the same structure.

import apiRequestService from "./apiRequestService.js";

class AsyncThunk {
  getThunk() {
    return async (data, { rejectWithValue }) => {
      try {
        const { url, config = {} } = data;
        const response = await apiRequestService.get_req(url, config);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "GET failed");
      }
    };
  }

  postThunk() {
    return async (data, { rejectWithValue }) => {
      try {
        const { url, payload, config } = data;
        const response = await apiRequestService.post_req(url, payload, config);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "POST failed");
      }
    };
  }

  patchThunk() {
    return async (data, { rejectWithValue }) => {
      try {
        const { url, payload, config } = data;
        const response = await apiRequestService.patch_req(
          url,
          payload,
          config
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "PATCH failed");
      }
    };
  }

  deleteThunk() {
    return async (data, { rejectWithValue }) => {
      try {
        const { url, config } = data;
        const response = await apiRequestService.delete_req(url, config);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "DELETE failed");
      }
    };
  }
}

export default new AsyncThunk();
