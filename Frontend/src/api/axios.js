import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.migashulujabaronwj.co.id/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 30000,
  withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🚀 API Request:", {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      hasToken: !!token,
    });

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
    });

    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      Cookies.remove("admin_token");
      Cookies.remove("admin_user");

      if (window.location.pathname !== "/tukang-minyak-dan-gas/login") {
        window.location.href = "/tukang-minyak-dan-gas/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;