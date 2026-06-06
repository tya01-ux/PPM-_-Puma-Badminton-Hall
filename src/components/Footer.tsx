import { Link as RouterLink } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from "../assets/Logo.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#041B4D] to-[#02102F] text-white pt-16 pb-8 border-t border-blue-500/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <RouterLink to="/" className="flex items-center">
              <img src={Logo} alt="Puma Badminton Hall" className="h-16 w-auto object-contain" />
            </RouterLink>
            <p className="text-sm text-blue-100/60 leading-relaxed max-w-[280px]">
              Pusat olahraga badminton premium di Tegal. Fasilitas standar profesional untuk pengalaman bermain terbaik Anda.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-6 text-white">Menu Utama</h4>
            <ul className="space-y-4 text-sm text-blue-100/60">
              {['Home', 'Booking', 'Membership', 'About'].map((item) => (
                <li key={item}>
                  <RouterLink 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
                    onClick={() => window.scrollTo(0, 0)} 
                    className="hover:text-blue-300 transition-colors"
                  >
                    {item}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-6 text-white">Hubungi Kami</h4>
              <ul className="space-y-4 text-sm text-blue-100/60">
                <li className="flex gap-3 items-start">
                  <Phone size={18} className="text-blue-400 shrink-0 mt-0.5" /> +62 815-1867-890
                </li>
                <li className="flex gap-3 items-start">
                  <Mail size={18} className="text-blue-400 shrink-0 mt-0.5" /> info@pumabadminton.id
                </li>
                <li className="flex gap-3 items-start">
                  <MapPin size={18} className="text-blue-400 shrink-0 mt-0.5" /> Jl. Raya Kepandean, Pagongan, Kec. Dukuhturi, Tegal
                </li>
              </ul>
            </div>

              {/* Container Lokasi */}
            <div className="w-full">
              <h4 className="font-bold mb-6 text-white">Lokasi</h4>
              
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.598687251786!2d109.13576087573024!3d-6.939227967964645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b56f8749a9%3A0x867b7f4391694f4b!2sPUMA%20BHARATANGKAS%20BADMINTON%20HALL!5e0!3m2!1sid!2sid!4v1680000000000"
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Lokasi Puma Bharatangkas Badminton Hall"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-100/40">
          <p>© 2026 Puma Bharatangkas Badminton Hall. All rights reserved.</p>
          <div className="flex gap-4 text-blue-100/60 mt-1">
            <a href="https://www.instagram.com/pumabharatangkasbadmintonhall_" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
            <a href="https://www.tiktok.com/place/PUMA-BHARATANGKAS-BADMINTON-HALL-42203861092600989" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77 0 2.89 2.89 0 0 1 2.57-2.87v-3.32a6.22 6.22 0 1 0 6.22 6.22V6.69z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
}