import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/AdminDashboard";

import UrlScanner from "./pages/UrlScanner";
import QRScanner from "./pages/QRScanner";
import SMSScanner from "./pages/SMSScanner";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==============================
            PUBLIC ROUTES
        ============================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />


        {/* ==============================
            NORMAL USER ROUTES
        ============================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/url-scanner"
            element={
              <Layout>
                <UrlScanner />
              </Layout>
            }
          />

          <Route
            path="/qr-scanner"
            element={
              <Layout>
                <QRScanner />
              </Layout>
            }
          />

          <Route
            path="/sms-scanner"
            element={
              <Layout>
                <SMSScanner />
              </Layout>
            }
          />

          <Route
            path="/analytics"
            element={
              <Layout>
                <Analytics />
              </Layout>
            }
          />

          <Route
            path="/history"
            element={
              <Layout>
                <History />
              </Layout>
            }
          />

          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />

          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />

        </Route>


        {/* ==============================
            ADMIN ROUTES
        ============================== */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

        </Route>


        {/* ==============================
            404
        ============================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;