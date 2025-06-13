import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return (<Navigate to="/login" replace />);
  }
  return children;
}
export default ProtectedRoute;
