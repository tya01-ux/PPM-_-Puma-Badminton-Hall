import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
          {/* Navbar/ Menu */}
          <Navbar />

          {/* Main Content */}
          <main className="grow w-full bg-linear-to-br from-slate-100 to-blue-50"> 
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
    );
}