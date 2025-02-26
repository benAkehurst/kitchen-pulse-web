// lib/api.ts
import axios from "axios";

// Helper: Get access token from localStorage
const getAccessToken = () => localStorage.getItem("accessToken");

// Helper: Refresh the access token
const refreshAccessToken = async () => {
  try {
    const { data } = await axios.post("/auth/refresh-token", {}, { withCredentials: true });
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("Refresh failed, logging out...");
    localStorage.removeItem("accessToken");
    window.location.href = "/login"; // Redirect on refresh failure
    throw error; // Re-throw to cancel further requests
  }
};

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies (for refreshToken)
});

// Request Interceptor: Add Authorization Header
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle Expired Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config); // Retry the failed request
      } catch {
        console.error("Token refresh failed, redirecting to login.");
      }
    }
    return Promise.reject(error);
  }
);
