import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("guardian_user");
      const token = localStorage.getItem("access_token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem("guardian_user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, accessToken, tokenType = "bearer") => {
    localStorage.setItem(
      "guardian_user",
      JSON.stringify(userData)
    );

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("token_type", tokenType);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("guardian_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");

    setUser(null);
  };

  const isAuthenticated = Boolean(
    user && localStorage.getItem("access_token")
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}