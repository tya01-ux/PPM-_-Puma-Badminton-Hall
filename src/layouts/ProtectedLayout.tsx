import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  allowedRole?: string;
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  // 1. Cek udah login belum?
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Kalau ada role yang diminta, cek apakah role user cocok
  if (allowedRole && user.role !== allowedRole) {
    return <div className="p-10 text-center">Akses Ditolak! Kamu bukan {allowedRole}</div>;
  }

  // 3. Kalau lolos, tampilkan halamannya
  return <Outlet />;
}