import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] flex items-center justify-center px-6">
        <div className="text-center">

          <div className="w-12 h-12 mx-auto rounded-full border-4 border-[#DCE8E1] border-t-[#159A62] animate-spin" />

          <p className="text-[#52605A] mt-4 text-sm font-medium">
            Checking administrator access...
          </p>

        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;