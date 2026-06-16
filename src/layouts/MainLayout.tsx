import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";
import FloatingWhatsapp from '../components/ui/FloatingWhatsapp';


export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Tambahkan 'py-10' untuk memberi ruang napas yang pas */}
            <main className="grow w-full bg-linear-to-br from-slate-100 to-blue-50 flex flex-col justify-center py-8">
                  <Outlet />
            </main>

            <FloatingWhatsapp />
            <Footer />
        </div>
    );
}