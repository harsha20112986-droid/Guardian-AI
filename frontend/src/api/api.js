import axios from "axios";

const api = axios.create({
  baseURL: "https://guardian-ai-backend-uzg5.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "Authentication failed:",
        error.config?.url
      );

      const currentPath = window.location.pathname;

      if (
        currentPath !== "/login" &&
        currentPath !== "/signup"
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("guardian_user");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;