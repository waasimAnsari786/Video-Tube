// ✅ This class provides reusable methods (get, post, patch, delete) for making API requests.
// ✅ Each method expects an object with `url`, `payload` (if applicable), and `config`.
// ✅ It standardizes all Axios calls and ensures consistency across the app.
// ✅ These methods are used inside AsyncThunkService to simplify API interaction in Redux thunks.

import axiosInstance from "../utils/axiosInstance";

class ApiRequestService {
  async get_req(url, config = {}) {
    try {
      const response = await axiosInstance.get(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async post_req(url, data, config = {}) {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async patch_req(url, data, config = {}) {
    try {
      const response = await axiosInstance.patch(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async delete_req(url, config = {}) {
    try {
      const response = await axiosInstance.delete(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiRequestService();
