import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  LogOut,
  Menu,
  X,
  CreditCard,
  Tag,
  Settings,
  FileBarChart2,
} from "lucide-react";
import { GiShuttlecock } from "react-icons/gi";
import Logo from "../assets/Logo.png";

export default function DashboardLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/loginForm");
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]"
        : "text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1"
    }`;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#041B4D] border-b border-blue-800 shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <img
            src={Logo}
            alt="Puma Logo"
            className="h-20 w-auto object-contain transition-transform duration-300"
          />
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-3 rounded-2xl text-white hover:bg-white/10 active:scale-95 transition-all duration-300"
          >
            <Menu size={30} />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* OVERLAY MOBILE */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 z-50 h-screen w-80 bg-gradient-to-b from-[#041B4D] via-[#0A2E7A] to-[#0F4CDE] text-white shadow-2xl flex flex-col justify-between px-6 py-8 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          {/* ATAS */}
          <div className="flex flex-col gap-8">
            <div className="relative">
              <button
                onClick={closeSidebar}
                className="absolute right-0 top-0 lg:hidden p-2 rounded-xl hover:bg-white/10 transition"
              >
                <X size={24} />
              </button>
              <div className="flex justify-center">
                <img
                  src={Logo}
                  alt="Puma Logo"
                  className="h-28 xl:h-32 w-auto object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>

            {/* MENU */}
            <nav className="flex flex-col gap-3 mt-2">
              <NavLink
                to="/admin/dashboard"
                end
                className={navClass}
                onClick={closeSidebar}
              >
                <LayoutDashboard size={22} /> Dashboard
              </NavLink>

              <NavLink
                to="/admin/booking"
                className={navClass}
                onClick={closeSidebar}
              >
                <CalendarDays size={22} /> Booking Management
              </NavLink>

              <NavLink
                to="/admin/payment"
                className={navClass}
                onClick={closeSidebar}
              >
                <CreditCard size={22} /> Pembayaran
              </NavLink>

              <NavLink
                to="/admin/payment-channel"
                className={navClass}
                onClick={closeSidebar}
              >
                <CreditCard size={22} /> Metode Pembayaran
              </NavLink>

              <NavLink
                to="/admin/promo"
                className={navClass}
                onClick={closeSidebar}
              >
                <Tag size={22} /> Promo
              </NavLink>

              <NavLink
                to="/admin/court"
                className={navClass}
                onClick={closeSidebar}
              >
                <GiShuttlecock size={22} /> Court Management
              </NavLink>

              <NavLink
                to="/admin/user"
                className={navClass}
                onClick={closeSidebar}
              >
                <Users size={22} /> User Management
              </NavLink>

              <NavLink
                to="/admin/laporan"
                className={navClass}
                onClick={closeSidebar}
              >
                <FileBarChart2 size={22} /> Report
              </NavLink>

              <NavLink
                to="/admin/pengaturan"
                className={navClass}
                onClick={closeSidebar}
              >
                <Settings size={22} /> Pengaturan
              </NavLink>

            </nav>
          </div>
          {/* LOGOUT */}
          <div className="pt-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl
               bg-white/10 border border-white/20
               text-white
               hover:bg-red-500 hover:border-red-400
               hover:text-white
               transition-all duration-300
               hover:shadow-lg hover:shadow-red-400/30
               active:scale-95"
            >
              <LogOut size={22} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 lg:ml-80">
          <div className="shadow-sm min-h-[calc(100vh-2rem)] p-5 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
