// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // parse user from localStorage

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role check (if route requires manager role)
  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
