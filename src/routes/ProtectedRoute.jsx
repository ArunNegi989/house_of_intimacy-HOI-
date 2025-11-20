import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Read ONLY from localStorage to support login in new tabs
  const token = localStorage.getItem("authToken");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → render protected page
  return children;
}
