// it's a service or file which contians all api requests methods regarding authentication

import axiosInstance from "../utils/axiosInstance";

class AuthService {
  async createAccount(data) {
    try {
      const createdAccount = await axiosInstance.post("/users", data);
      return createdAccount;
    } catch (error) {
      throw error;
    }
  }
  async loginAccount({ email, password }) {
    try {
      const loggedInAccount = await axiosInstance.post("/users/login", {
        email,
        password,
      });
      return loggedInAccount;
    } catch (error) {
      throw error;
    }
  }
  async getUser() {
    try {
      const user = await axiosInstance.get("/users/me");
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updateUserDetails(data) {
    try {
      const updatedUser = await axiosInstance.patch("/users/me", data);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(data) {
    try {
      const response = await axiosInstance.patch("/users/me/password", data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async logout() {
    try {
      const response = await axiosInstance.post("/users/me/logout");
      return response;
    } catch (error) {
      throw error;
    }
  }
  async refreshAccessToken() {
    try {
      const token = localStorage.getItem("refreshToken");
      const response = await axiosInstance.post(
        "/users/refresh-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateAvatar(data) {
    try {
      const response = await axiosInstance.patch("/users/me/avatar", data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateCoverImage(data) {
    try {
      const response = await axiosInstance.patch("/users/me/cover", data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getUserChannelDetails(userName) {
    try {
      const response = await axiosInstance.get(`/users/channel/${userName}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async deleteAvatar(data) {
    try {
      const response = await axiosInstance.delete("/users/me/avatar", { data });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async deleteCoverImage(data) {
    try {
      const response = await axiosInstance.delete("/users/me/cover", { data });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
