import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
});


// ============================================================
// REQUEST INTERCEPTOR
// Attach JWT to authenticated requests
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "access_token"
    );

    const tokenType =
      localStorage.getItem("token_type") || "bearer";


    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `${tokenType} ${token}`;
    }


    // --------------------------------------------------------
    // JSON requests
    // --------------------------------------------------------
    //
    // Do NOT manually set Content-Type for FormData.
    // Axios/browser will automatically set:
    //
    // multipart/form-data; boundary=...
    //
    // This is required for QR image uploads.
    //

    if (
      config.data &&
      !(config.data instanceof FormData)
    ) {
      config.headers = config.headers || {};

      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] =
          "application/json";
      }
    }


    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ============================================================
// RESPONSE INTERCEPTOR
// Handle expired / invalid authentication
// ============================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status =
      error.response?.status;

    const currentPath =
      window.location.pathname;


    // --------------------------------------------------------
    // Unauthorized
    // --------------------------------------------------------

    if (status === 401) {

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "token_type"
      );

      localStorage.removeItem(
        "guardian_user"
      );


      if (
        currentPath !== "/login" &&
        currentPath !== "/signup" &&
        currentPath !== "/verify-email"
      ) {
        window.location.href = "/login";
      }
    }


    // --------------------------------------------------------
    // Forbidden
    // --------------------------------------------------------
    //
    // 403 does NOT mean the user's session is invalid.
    //
    // Example:
    //
    // Normal user → /admin
    // Backend → 403 Admin access required
    //
    // Keep the user logged in.
    //

    if (status === 403) {

      console.warn(
        "Access forbidden:",
        error.response?.data?.detail
      );
    }


    return Promise.reject(error);
  }
);


export default api;