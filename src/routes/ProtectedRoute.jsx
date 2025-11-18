import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Read token from both storages (works with "Keep me logged in")
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → allow dashboard
  return children;
}
