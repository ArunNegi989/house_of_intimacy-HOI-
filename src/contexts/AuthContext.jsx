import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const LOCAL_KEY = "hoi_auth"; // jo marzi naam rakho

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // { name, email, ... }
  const [token, setToken] = useState(null);   // JWT token
  const [loading, setLoading] = useState(true);

  // 🔁 app load hone par localStorage se auth read karo
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch (err) {
        console.error("Invalid auth in localStorage", err);
        localStorage.removeItem(LOCAL_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({ user: userData, token: tokenValue })
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LOCAL_KEY);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
