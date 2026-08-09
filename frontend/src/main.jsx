import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        limit={3}
        theme="dark"
      />
    </ThemeProvider>
  </React.StrictMode>
);