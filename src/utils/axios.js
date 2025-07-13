// src/utils/axios.js

import axios from "axios";
import { JWT_HOST_API } from "configs/auth.config";
import { handleAxiosError } from "utils/handleAxiosError"; // ✅ Correct import

const axiosInstance = axios.create({
  baseURL: JWT_HOST_API,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const handled = handleAxiosError(error); // ✅ Run error processor
    return Promise.reject(handled); // Now you get a detailed object
  }
);

export default axiosInstance;
