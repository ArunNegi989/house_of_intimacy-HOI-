import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  const role = (localStorage.getItem("userRole") || "").toLowerCase().trim();

  // No login → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Not admin → redirect to home
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin → allow
  return children;
}
