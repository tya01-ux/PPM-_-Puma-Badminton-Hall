import { Calendar, ShieldCheck, Clock, ArrowRight } from "lucide-react";

const features = [
  { icon: Calendar, title: "Booking Mudah", desc: "Cepat & Praktis", tint: "bg-indigo-500/30" },
  { icon: ShieldCheck, title: "Harga Terbaik", desc: "Fasilitas Premium", tint: "bg-blue-500/30" },
  { icon: Clock, title: "Tersedia 24/7", desc: "Kapan saja", tint: "bg-blue-500/30" },
];

export const BookingCTA = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#050B2E] via-[#071640] to-[#0A2A6E] shadow-2xl">

        {/* lampu stadion, titik-titik di pojok kiri & kanan atas */}
        <div
          className="absolute -top-2 left-8 w-40 h-24 opacity-70 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(147,197,253,0.9) 2px, transparent 2px)",
            backgroundSize: "16px 16px",
            maskImage:
              "radial-gradient(ellipse at top, black, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-2 right-8 w-40 h-24 opacity-70 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(147,197,253,0.9) 2px, transparent 2px)",
            backgroundSize: "16px 16px",
            maskImage:
              "radial-gradient(ellipse at top, black, transparent 70%)",
          }}
        />

        {/* net badminton samar di kanan */}
        <svg
          className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-64 h-56 opacity-25 pointer-events-none"
          viewBox="0 0 260 220"
          fill="none"
        >
          <line x1="10" y1="10" x2="10" y2="210" stroke="#93c5fd" strokeWidth="4" />
          <line x1="250" y1="10" x2="250" y2="210" stroke="#93c5fd" strokeWidth="4" />
          <line x1="10" y1="20" x2="250" y2="20" stroke="#93c5fd" strokeWidth="3" />
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={10 + i * 24}
              y1="20"
              x2={10 + i * 24}
              y2="150"
              stroke="#93c5fd"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="10"
              y1={20 + i * 16}
              x2="250"
              y2={20 + i * 16}
              stroke="#93c5fd"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* garis lapangan diagonal di dasar, dengan glow biru */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-40 pointer-events-none"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path d="M0 200 L500 60 L1200 200 Z" fill="#1d4ed8" opacity="0.12" />
          <path d="M0 200 L500 60" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
          <path d="M1200 200 L500 60" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
          <path d="M150 200 L560 90" stroke="#3b82f6" strokeWidth="1" opacity="0.25" />
          <path d="M1050 200 L640 90" stroke="#3b82f6" strokeWidth="1" opacity="0.25" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-blue-400/20 to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr_auto] items-center gap-8 lg:gap-6 px-6 sm:px-10 md:px-12 py-12 md:py-14">

          {/* KIRI: shuttlecock, edge-nya dibuat memudar (feathered) biar nyatu ke background gelap */}
          <div className="hidden lg:flex items-center justify-center relative w-64 h-64">
            <div className="absolute w-56 h-56 rounded-full bg-blue-400/25 blur-3xl pointer-events-none" />

            <div
              className="relative w-64 h-64"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 85%)",
                maskImage:
                  "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 85%)",
              }}
            >
              <img
                src="/images.jpg"
                alt="Shuttlecock"
                className="w-full h-full object-cover"
              />
              {/* tint gelap tipis biar warna foto senada sama tone navy background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#0A2A6E]/10 to-[#050B2E]/70 mix-blend-multiply pointer-events-none" />
            </div>
          </div>

          {/* TENGAH: heading, deskripsi, fitur */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Siap Bermain{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                Badminton?
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-blue-100/80 max-w-xl">
              Booking lapangan sekarang dan rasakan pengalaman bermain terbaik!
            </p>

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-5">
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${f.tint} border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0`}>
                    <f.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{f.title}</p>
                    <p className="text-xs text-blue-200/70 leading-tight">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KANAN: tombol booking */}
          <div className="flex lg:justify-end">
            <button className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(59,130,246,0.45)] hover:from-blue-400 hover:to-blue-500 transition-all duration-300 whitespace-nowrap">
              <Calendar size={20} />
              Booking Sekarang
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};