import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useScrollNavbar } from "../hooks/useScrollNavbar";
import Logo from "../assets/Logo.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollNavbar(50);

  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Booking", href: "/booking" },
    { label: "Membership", href: "/membership" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-puma-dark/90 backdrop-blur-md shadow-lg shadow-black/20" : "bg-puma-dark shadow-md shadow-black/10"}`}>
      <div className="px-6 py-1 flex items-center justify-between w-full max-w-7xl mx-auto">
        <NavLink to="/" className="shrink-0 pl-2">
          <img src={Logo} alt="Puma Badminton Hall" className="h-24 md:h-28 w-auto object-contain transition-transform hover:scale-105" />
        </NavLink>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center justify-center gap-2 grow">
          {menuItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={({ isActive }) => `relative px-5 py-6 text-sm font-semibold transition-all ${isActive ? "text-white" : "text-white/80 hover:text-white"}`}>
              {({ isActive }) => (
                <>
                  {item.label}
                  <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 h-0.5 bg-blue-400 rounded-full transition-all duration-300 ${isActive ? "w-6 opacity-100" : "w-0 opacity-0 hover:w-4 hover:opacity-100"}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT SIDE DESKTOP */}
        <div className="hidden lg:flex items-center gap-6 pr-4">
          <NavLink to="/loginForm" className="text-sm font-bold text-white hover:text-blue-200 transition-colors">Login</NavLink>
          <NavLink to="/booking" className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/25">Booking Sekarang</NavLink>
        </div>

        {/* HAMBURGER */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-2">{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden bg-[#041B4D] border-t border-white/10 p-6 animate-in slide-in-from-top-5 duration-300">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink key={item.href} to={item.href} onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? "bg-white/10 text-white border-l-4 border-blue-400" : "text-white/60 hover:text-white hover:bg-white/10 hover:pl-8"}`}>
                {item.label}
              </NavLink>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <NavLink to="/loginForm" onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? "bg-white/10 text-white border-l-4 border-blue-400" : "text-white/60 hover:text-white hover:bg-white/10 hover:pl-8"}`}>Login</NavLink>
            <NavLink to="/booking" onClick={() => setIsOpen(false)} className="block px-5 py-3 rounded-xl bg-blue-500 text-center text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:bg-blue-600 hover:scale-[1.02]">Booking Sekarang</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};