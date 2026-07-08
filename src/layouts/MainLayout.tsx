import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";
import FloatingWhatsapp from '../components/ui/FloatingWhatsapp';


export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="grow w-full flex flex-col">
                  <Outlet />
            </main>

            <FloatingWhatsapp />
            <Footer />
        </div>
    );
}