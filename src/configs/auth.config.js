/**
 * This is a simple JWT API for testing purposes.
 * https://github.com/pinia-studio/jwt-api-node
 */

/**
 * Local development API (use this while testing locally)
 */
export const JWT_HOST_API = "https://localhost:7202/api";

/**
 * Global deployed API (use this before pushing code to server)
 */
export const API_BASE_URL = "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api";

/**
 * Toggle active API base URL
 * NOTE: Change this manually based on environment
 */
export const ACTIVE_API_BASE_URL = API_BASE_URL; // 🔁 switch to API_BASE_URL before pushing
