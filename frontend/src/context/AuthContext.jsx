import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores user object
  const [loading, setLoading] = useState(true); // useful during auth checks

  // Optional: auto-login from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await authService.loginAccount(credentials);
    const loggedInUser = res?.data?.data?.user;
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // optionally: authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
