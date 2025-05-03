// it's an instance of axios which contains the base URL of the server
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
});

export default axiosInstance;
