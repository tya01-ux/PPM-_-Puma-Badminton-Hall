import { MessageCircle } from "lucide-react";

export default function FloatingWhatsapp() {
  return (
    <a
      href="https://wa.me/628151867890?text=Halo%20Puma%20Badminton%20Hall,%20apakah%20lapangan%20masih%20tersedia?"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-18 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 animate-bounce transition-all duration-300"
    >
      <MessageCircle size={28} className="text-white" />
    </a>
  );
}