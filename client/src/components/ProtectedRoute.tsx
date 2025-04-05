
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no specific role is required, or user has the required role
  if (
    !requiredRole || 
    (Array.isArray(requiredRole) && user && requiredRole.includes(user.role)) ||
    (user && user.role === requiredRole)
  ) {
    return <>{children}</>;
  }

  // If user doesn't have the required role
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
