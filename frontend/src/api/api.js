import axios from "axios";

const api = axios.create({
  baseURL: "https://guardian-ai-backend-uzg5.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const tokenType =
      localStorage.getItem("token_type") || "bearer";

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `${tokenType} ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized requests
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("guardian_user");

      const currentPath = window.location.pathname;

      if (
        currentPath !== "/login" &&
        currentPath !== "/signup"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;