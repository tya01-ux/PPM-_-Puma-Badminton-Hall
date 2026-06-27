import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString && userString !== "null" ? JSON.parse(userString) : null;

  // 1. Jika token tidak ada atau data user kosong, tendang ke /loginForm
  if (!token || !user) {
    return <Navigate to="/loginForm" replace />;
  }

  // 2. Gunakan .toLowerCase() agar pengecekan role lebih aman dari salah huruf kapital
  if (user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/loginForm" replace />;
  }

  return (
    <>
      {/* Sidebar */}
      {/* Navbar */}
      <Outlet />
    </>
  );
}