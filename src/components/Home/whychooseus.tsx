import { ShieldCheck, HeartHandshake, Smartphone, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Lapangan Standar",
    desc: "Menggunakan lantai dan standar internasional",
  },
  {
    icon: HeartHandshake,
    title: "Pelayanan Ramah",
    desc: "Tim profesional siap membantu kebutuhan bermain terbaik untuk Anda",
  },
  {
    icon: Smartphone,
    title: "Booking Online",
    desc: "Reservasi lapangan mudah, cepat, bisa dilakukan kapan saja",
  },
  {
    icon: Wallet,
    title: "Harga Terjangkau",
    desc: "Harga bersahabat dengan fasilitas premium untuk semua kalangan",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-[11px] md:text-xs font-bold tracking-[0.15em] text-[#0050FF]">
            KENAPA MEMILIH KAMI
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl md:text-4xl font-bold text-[#001845] leading-tight">
            Pengalaman Bermain yang{" "}
            <span className="text-[#0050FF]">Lebih Baik</span>
          </h2>
        </motion.div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-10 md:mt-12">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="
                rounded-2xl
                border border-slate-200
                bg-white
                px-6 py-7
                shadow-sm
                hover:shadow-md
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <r.icon size={20} className="text-[#0050FF]" />
              </div>
              <h3 className="mt-4 text-base md:text-lg font-bold text-[#001845]">
                {r.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}