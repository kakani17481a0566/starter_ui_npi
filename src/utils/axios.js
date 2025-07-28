// src/utils/axios.js

import axios from "axios";
import { ACTIVE_API_BASE_URL } from "configs/auth.config";
import { getSessionData } from "utils/sessionStorage";
import { handleAxiosError } from "utils/handleAxiosError";

// ✅ Choose which baseURL to use here
const BASE_URL = ACTIVE_API_BASE_URL; // Set this in auth.config.js

console.log("🔧 Creating Axios instance with baseURL:", BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ✅ Request Interceptor: Attach token and log request info
axiosInstance.interceptors.request.use(
  (config) => {
    const session = getSessionData();
    const { token, tenantId, userId } = session || {};

    console.log("📤 [REQUEST] Outgoing API call:");
    console.log("➡️ URL:", config.baseURL + config.url);
    console.log("📦 Method:", config.method?.toUpperCase());
    console.log("🔑 Token present:", !!token);
    console.log("🏷️ Tenant ID:", tenantId);
    console.log("👤 User ID:", userId);

    if (token && typeof token === "string" && token.length > 10) {
      config.headers.Authorization = token;
      console.log("✅ Attached token:", token);
    } else {
      console.warn("⚠️ No valid token found — Authorization header not set");
    }

    return config;
  },
  (error) => {
    console.error("❌ [REQUEST ERROR] Failed to setup request:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: Log status and handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    const { method, url } = response.config;
    console.log(`✅ [RESPONSE] [${method?.toUpperCase()}] ${url} - ✅ Status: ${response.status}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const method = error.config?.method;
    const url = error.config?.url;

    console.error(`❌ [RESPONSE ERROR] [${method?.toUpperCase()}] ${url} - ❌ Status: ${status || "No response"}`);

    if (error.response) {
      console.log("📦 Response Error Payload:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.log("📡 No response received (network error):", error.request);
    } else {
      console.log("🚨 Axios configuration error:", error.message);
    }

    const handled = handleAxiosError(error);
    console.error("📩 Handled Error Message:", handled.message);
    return Promise.reject(handled);
  }
);

export default axiosInstance;
