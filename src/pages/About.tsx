import { motion } from "framer-motion";
import kokk from "../assets/kokk.png";
export default function About() {
  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen overflow-x-hidden">
      
      {/* 1. HERO ABOUT (SAMA PERSIS DENGAN KONSEP MEMBERSHIP - DEKORASI RAKET) */}
      <div className="relative overflow-hidden bg-linear-to-r from-[#001845] to-[#1741B6] mt-14 md:mt-20">
        
        {/* Decoration - Sekarang menggunakan gambar raket */}
        <img
          src={kokk}
          alt=""
          className="
            absolute right-0 top-1/2
            -translate-y-1/2 translate-x-1/4
            w-40 md:w-105
            opacity-[0.05]
            pointer-events-none
            select-none
            rotate-12
          "
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-14">
          
          {/* Accent */}
          <div className="w-10 h-1 rounded-full bg-blue-300 mb-4" />

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
            <span className="text-white">Tentang </span>
            <span className="text-[#AFC8FF]">Puma Bharatangkas</span>
          </h1>

          {/* Desc */}
          <p className="mt-3 text-blue-100 text-sm md:text-base leading-relaxed max-w-lg">
            Pusat olahraga badminton modern yang dirancang untuk memberikan
            pengalaman bermain terbaik, kenyamanan maksimal, dan kemudahan
            akses bagi semua kalangan.
          </p>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-14 md:pb-24">
        
        {/* 2. TENTANG PUMA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="w-12 h-1 bg-[#1741B6] rounded-full"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
              Pusat Badminton Berkualitas & Modern
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Puma Bharatangkas adalah pusat olahraga badminton yang menyediakan
              lapangan berkualitas, fasilitas nyaman, dan sistem booking yang
              mudah untuk mendukung aktivitas olahraga masyarakat.
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Kami hadir sebagai sarana bermain yang nyaman, aman, dan mudah
              diakses oleh semua kalangan, mulai dari pemula hingga atlet
              profesional. Dengan komitmen pelayanan yang tinggi, kami terus
              berkembang menjadi pilihan utama komunitas badminton.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-slate-200/70 to-slate-300/50 h-64 md:h-96 rounded-2xl flex items-center justify-center border border-slate-200/80 shadow-xs overflow-hidden relative group"
          >
            <span className="text-slate-400 font-medium text-sm group-hover:scale-105 transition-transform duration-300">
              [ Foto Lapangan Utama ]
            </span>
          </motion.div>
        </section>

        {/* 3. VISI MISI */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1741B6] font-bold text-lg mb-4">
              
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-950 mb-3">
                Visi Kami
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Menjadi pusat olahraga badminton yang modern, nyaman, dan
                terpercaya bagi seluruh lapisan masyarakat serta melahirkan ekosistem olahraga yang sehat.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1741B6] font-bold text-lg mb-4">
              🚀
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-950 mb-3">
              Misi Kami
            </h3>
            <ul className="space-y-3 text-slate-600 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <span className="text-[#1741B6] font-bold shrink-0">✓</span>{" "}
                <span>Menyediakan infrastruktur lapangan berstandar prima dan karpet premium.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1741B6] font-bold shrink-0">✓</span>{" "}
                <span>Memberikan pelayanan yang ramah, responsif, dan mengutamakan kebersihan GOR.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1741B6] font-bold shrink-0">✓</span>{" "}
                <span>Mempermudah akses reservasi dengan integrasi sistem teknologi yang modern.</span>
              </li>
            </ul>
          </motion.div>
        </section>

        {/* 4. FASILITAS */}
        <section className="mb-20 md:mb-28">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-950">
              Fasilitas <span className="text-[#0050FF]">Terbaik</span> Untuk Anda
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-2">
              Kami memastikan seluruh kenyamanan Anda terpenuhi secara maksimal sebelum dan sesudah bertanding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🏸", title: "Lapangan Premium", desc: "Lantai karpet empuk, anti licin standar turnamen resmi." },
              { icon: "🚗", title: "Parkir Luas & Aman", desc: "Menampung puluhan kendaraan roda dua maupun roda empat." },
              { icon: "🚻", title: "Kamar Bilas Bersih", desc: "Fasilitas toilet yang higienis dan terawat sepanjang waktu." },
              { icon: "💡", title: "Lighting Anti-Silau", desc: "Pencahayaan LED fokus merata tanpa mengganggu pandangan mata." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className="text-2xl mb-3 bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100">{item.icon}</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. KENAPA MEMILIH KAMI */}
        <motion.section 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-linear-to-br from-[#001845] to-[#112D72] text-white p-6 md:p-12 rounded-3xl shadow-xl border border-[#1741B6]/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                Kenapa Harus Main di Puma Bharatangkas?
              </h2>
              <p className="text-blue-200 text-xs md:text-sm mt-2">
                Kami mengutamakan konsistensi kualitas demi kenyamanan main harian maupun rutin harian Anda.
              </p>
            </div>
            
            <div className="space-y-2.5">
              {[
                "Sistem Booking Real-Time & Praktis via Website",
                "Tarif Sewa Kompetitif dengan Berbagai Pilihan Paket",
                "Kondisi Lapangan Steril dan Jadwal yang On-Time"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10 text-xs md:text-sm">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-100 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 h-48 lg:h-72 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
            <span className="text-white/30 font-medium text-xs">[ Foto Aktivitas Member ]</span>
          </div>
        </motion.section>

      </div>
    </div>
  );
}