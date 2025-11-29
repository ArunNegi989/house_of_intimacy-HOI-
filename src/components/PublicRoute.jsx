// src/components/PublicRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  const location = useLocation();

  if (token) {
    // optional: userRole jo login ke baad store karte ho
    const storedRole =
      localStorage.getItem("userRole") ||
      sessionStorage.getItem("userRole") ||
      "user";

    const role = storedRole.toLowerCase().trim();

    // agar admin hai → admin dashboard bhejo
    if (role === "admin") {
      return <Navigate to="/admin/admin_dashboard" replace />;
    }

    // normal user → jis jagah se aaya ho (ya /)
    const from = location.state?.from || "/";
    return <Navigate to={from} replace />;
  }

  // not logged in → login / signup page dikhane do
  return children;
}
