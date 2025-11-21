// src/routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  const role =
    (localStorage.getItem("userRole") ||
      sessionStorage.getItem("userRole") ||
      ""
    )
      .toLowerCase()
      .trim();

  // 1) No login → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) Not admin → redirect to home
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 3) Admin → allow
  return children;
}
