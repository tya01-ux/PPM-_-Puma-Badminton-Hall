import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function PromoBanner() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* PRODUK KAMI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="
              relative overflow-hidden
              rounded-3xl
              bg-gradient-to-br from-[#000814] via-[#001845] to-[#001845]
              px-7 sm:px-9 py-9 sm:py-10
              min-h-[260px] md:min-h-[300px]
              flex flex-col justify-between
            "
          >
            {/* decorative glow */}
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            {/* decorative shuttlecock/tube shape */}
            <div className="absolute right-4 sm:right-8 bottom-0 flex items-end gap-2 opacity-90 pointer-events-none select-none">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-white to-slate-300 mb-10" />
              <div className="w-4 h-24 sm:w-5 sm:h-32 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 shadow-lg" />
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-white to-slate-300 mb-4" />
            </div>

            <div className="relative z-10">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-blue-300">
                PRODUK KAMI
              </span>
              <h3 className="mt-3 text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight max-w-xs">
                Shuttlecock Puma Bharatangkas
              </h3>
              <p className="mt-3 text-blue-100/80 text-sm leading-relaxed max-w-[15rem] sm:max-w-xs">
                Diproduksi dengan bulu pilihan terbaik untuk performa maksimal
                dan tahan lama.
              </p>
            </div>

            <button
              type="button"
              className="
                relative z-10
                mt-6
                inline-flex items-center gap-2
                self-start
                rounded-xl
                border border-white/25
                px-5 py-2.5
                text-sm font-semibold text-white
                hover:bg-white/10
                transition-colors duration-300
              "
            >
              Lihat Produk
              <ArrowRight size={15} />
            </button>
          </motion.div>

          {/* PROMO MEMBER BARU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="
              relative overflow-hidden
              rounded-3xl
              bg-gradient-to-br from-[#0050FF] to-[#1741B6]
              px-7 sm:px-9 py-9 sm:py-10
              min-h-[260px] md:min-h-[300px]
              flex flex-col justify-between
            "
          >
            {/* decorative big percentage */}
            <span
              className="
                absolute -right-2 sm:right-2 top-1/2 -translate-y-1/2
                text-[110px] sm:text-[150px]
                font-black text-white/10
                leading-none
                pointer-events-none select-none
              "
            >
              20%
            </span>

            {/* decorative shuttlecocks */}
            <div className="absolute right-8 sm:right-14 bottom-6 flex items-end gap-3 opacity-95 pointer-events-none select-none">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-white/90" />
                <div className="w-0.5 h-8 bg-white/70 -mt-1" />
              </div>
              <div className="flex flex-col items-center mb-3">
                <div className="w-6 h-6 rounded-full bg-white/80" />
                <div className="w-0.5 h-6 bg-white/60 -mt-1" />
              </div>
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold tracking-[0.1em] text-white/90">
                <Sparkles size={12} className="fill-white" />
                PROMO BULAN INI!
              </span>
              <h3 className="mt-3 text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight max-w-xs">
                Diskon 20% Untuk Member Baru
              </h3>
              <p className="mt-3 text-blue-100/85 text-sm leading-relaxed max-w-[15rem] sm:max-w-xs">
                Berlaku untuk semua kategori lapangan.
              </p>
            </div>

            <Link
              to="/membership"
              className="
                relative z-10
                mt-6
                inline-flex items-center gap-2
                self-start
                rounded-xl
                bg-white
                px-5 py-2.5
                text-sm font-semibold text-[#0050FF]
                hover:bg-blue-50
                transition-colors duration-300
              "
            >
              Daftar Sekarang
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}