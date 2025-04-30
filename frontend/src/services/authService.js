import axiosInstance from "../components/utils/axiosInstance";

class AuthService {
  async createAccount(data) {
    try {
      const createdAccount = await axiosInstance.post("/users", data);
      return createdAccount;
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
