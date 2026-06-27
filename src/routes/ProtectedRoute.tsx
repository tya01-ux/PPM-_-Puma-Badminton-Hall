import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  allowedRole: "admin" | "user";
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/loginForm" replace />;
  }

  if (allowedRole === "admin" && user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}