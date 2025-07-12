import axios from 'axios';
import { JWT_HOST_API } from 'configs/auth.config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: JWT_HOST_API,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout to 30s
});

// Handle errors centrally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      (error.response && error.response.data?.message) ||
      error.message ||
      'Something went wrong';
    return Promise.reject(message);
  }
);

export default axiosInstance;
