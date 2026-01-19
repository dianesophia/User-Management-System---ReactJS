import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { ReactNode } from "react";

type Role = "admin" | "user";

interface Props {
  children: ReactNode;
  allowedRoles: Role[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect if user role not allowed
  if (!allowedRoles.includes(user.role)) {
    // If admin tries to access user route, go to admin
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // If user tries to access admin route, go to user
    if (user.role === "user") {
      return <Navigate to="/user" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
