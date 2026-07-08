import { Calendar, MapPin, Clock, Trophy, Target } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* 1. Background Hero */}
      <div 
        className="relative w-full min-h-[85vh] flex flex-col justify-center text-white pt-32 md:pt-40 pb-32" 
        style={{
          backgroundImage: `url('/Hero1.jpeg')`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-blue-900/60" />

        {/* Konten Utama */}
        <div className="relative w-full max-w-7xl mx-auto px-6">
          <div className="max-w-3xl"> 
            <div className="inline-block bg-blue-600/20 backdrop-blur-md border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] px-6 py-2 rounded-full mb-6">
              <p className="text-white font-bold uppercase tracking-[0.2em] text-xs">Welcome To</p>
            </div>

            {/* HEADLINE FINAL: Menggunakan 6xl agar proporsional & tracking-tight agar solid */}
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              <span className="block">PUMA-BHARATANGKAS</span>
              <span className="block text-blue-500 mt-1">BADMINTON HALL</span>
            </h1>

            <div className="w-20 h-[3px] bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] mb-8" />

            <p className="text-sm text-white/90 mb-8 leading-relaxed max-w-lg">
              Tempat terbaik untuk berolahraga, bersenang-senang dan berkompetisi. Fasilitas lengkap dengan standar internasional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all">
                <Calendar size={20} /> Booking Sekarang
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all border border-white/20">
                <MapPin size={20} /> Lihat Lokasi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Info Bar (Overlap) */}
      {/* bg-white ditambahkan biar area overlap ini konsisten putih, ga nembus ke warna default body */}
      <div className="relative z-10 w-full px-4 -mt-20 md:-mt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto bg-[#041B4D]/90 backdrop-blur-md py-6 px-4 md:py-8 md:px-8 rounded-2xl shadow-2xl 
          grid grid-cols-1 md:grid-cols-4 gap-4 border border-blue-500/20 
          divide-y md:divide-y-0 md:divide-x divide-blue-800/50">
          <InfoItem icon={<Clock size={32} />} title="JAM OPERASIONAL" desc="06.00 - 23.00 WIB" />
          <InfoItem icon={<Trophy size={32} />} title="5 LINE BADMINTON" desc="Standar International" />
          <InfoItem icon={<Target size={32} />} title="BOOKING MUDAH" desc="Cepat & Praktis" />
          <InfoItem icon={<MapPin size={32} />} title="LOKASI STRATEGIS" desc="Dukuhturi, Kab. Tegal" />
        </div>
      </div>
    </section>
  );
};

const InfoItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex items-center gap-4 py-4 md:py-0 px-4 border-r-0 md:border-r-2 border-blue-700/50 last:border-0">
    <div className="text-blue-400 drop-shadow-[0_0_5px_rgba(56,189,248,1)]">
      {icon}
    </div>
    <div>
      <p className="text-[10px] md:text-xs text-blue-300 font-medium tracking-wider">{title}</p>
      <p className="text-sm md:text-lg font-bold text-white">{desc}</p>
    </div>
  </div>
);