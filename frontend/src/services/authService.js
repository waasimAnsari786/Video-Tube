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
}

const authService = new AuthService();
export default authService;
