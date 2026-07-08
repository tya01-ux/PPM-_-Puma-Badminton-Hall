import { motion, type Variants } from "framer-motion";
import kokk from "../assets/kokk.png";
import { Collapse } from "../components/ui/Collapse";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  Rocket,
  Trophy,
  Car,
  Bath,
  Lightbulb,
  CircleCheck,
  ShieldCheck,
  Star,
  HeartHandshake,
  MapPin,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#001845] to-[#1741B6] mt-14 md:mt-20">
        <img
          src={kokk}
          alt=""
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-40 md:w-[420px] opacity-[0.05] pointer-events-none select-none rotate-12"
        />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="w-10 h-1 rounded-full bg-blue-300 mb-4" />
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
            <span className="text-white">Tentang </span>
            <span className="text-[#AFC8FF]">Puma Bharatangkas</span>
          </h1>
          <p className="mt-3 text-blue-100 text-sm md:text-base leading-relaxed max-w-xl">
            Pusat olahraga badminton modern yang dirancang untuk memberikan pengalaman bermain terbaik,
            kenyamanan maksimal, dan kemudahan akses bagi semua kalangan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-14 md:pb-24 space-y-6">

        {/* ── TENTANG PUMA ── */}
        <section className="py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
                <MapPin size={12} /> Tentang Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Puma Bharatangkas
              </h2>
              <div className="w-12 h-1 bg-[#1741B6] rounded-full mt-4 mb-6" />
              <p className="text-slate-600 leading-8 text-[15px]">
                Puma Bharatangkas merupakan pusat olahraga badminton modern yang menyediakan lapangan
                berkualitas tinggi dengan fasilitas lengkap untuk menunjang aktivitas olahraga masyarakat.
              </p>
              <p className="mt-4 text-slate-600 leading-8 text-[15px]">
                Kami percaya bahwa olahraga bukan hanya sekadar aktivitas fisik, tetapi juga menjadi
                sarana membangun komunitas, kesehatan, sportivitas, dan gaya hidup aktif.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { value: "6+", label: "Lapangan" },
                  { value: "500+", label: "Member" },
                  { value: "5★", label: "Rating" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-[#1741B6]">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={1}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-xl border border-slate-100"
            >
              <img
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea"
                className="w-full h-[420px] object-cover"
                alt="Puma Bharatangkas"
              />
            </motion.div>
          </div>
        </section>

        {/* ── VISI & MISI ── */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
              Visi & Misi Puma
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Visi & Misi</h2>
            <p className="text-slate-500 mt-3 text-[15px]">
              Komitmen kami dalam memberikan pengalaman bermain badminton terbaik.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Visi */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white border border-blue-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none">
                <img src={kokk} alt="" className="w-44 rotate-12" />
              </div>
              <div className="flex gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Eye size={26} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Visi Kami</h3>
                  <div className="w-8 h-0.5 bg-blue-400 rounded-full my-3" />
                  <p className="leading-8 text-slate-600 text-[15px]">
                    Menjadi pusat olahraga badminton modern yang menghadirkan pengalaman olahraga
                    berkualitas, profesional, nyaman, dan mudah diakses oleh seluruh masyarakat.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Misi */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={1}
              viewport={{ once: true }}
              className="bg-white border border-violet-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-violet-500 to-purple-600" />
              <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none">
                <img src={kokk} alt="" className="w-44 rotate-12" />
              </div>
              <div className="flex gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                  <Rocket size={24} className="text-violet-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Misi Kami</h3>
                  <div className="w-8 h-0.5 bg-violet-400 rounded-full my-3" />
                  <div className="space-y-3">
                    {[
                      "Menyediakan fasilitas badminton berstandar profesional.",
                      "Menghadirkan sistem booking yang cepat dan mudah.",
                      "Membangun komunitas badminton yang aktif dan positif.",
                      "Mendukung gaya hidup sehat melalui olahraga.",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CircleCheck size={13} className="text-violet-600" />
                        </div>
                        <p className="text-slate-600 leading-7 text-[15px]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FASILITAS ── */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
              Fasilitas
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Fasilitas Kami</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-[15px]">
              Kami menyediakan fasilitas terbaik agar pengalaman bermain badminton menjadi lebih nyaman dan menyenangkan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Trophy, title: "Lapangan Premium", desc: "Karpet badminton standar nasional dengan pencahayaan LED profesional.", color: "bg-amber-50 text-amber-600 border-amber-100" },
              { icon: Bath, title: "Ruang Ganti", desc: "Ruang bilas bersih lengkap dengan shower dan loker aman.", color: "bg-blue-50 text-blue-600 border-blue-100" },
              { icon: Car, title: "Parkir Luas", desc: "Area parkir kendaraan roda dua dan roda empat tersedia luas.", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
              { icon: Lightbulb, title: "Lampu Profesional", desc: "Pencahayaan terang tanpa silau menggunakan teknologi LED terkini.", color: "bg-violet-50 text-violet-600 border-violet-100" },
              { icon: Rocket, title: "Booking Online", desc: "Reservasi lapangan secara cepat dan mudah melalui website.", color: "bg-rose-50 text-rose-600 border-rose-100" },
              { icon: CircleCheck, title: "Area Tunggu Nyaman", desc: "Disediakan kursi, AC, dan akses WiFi untuk kenyamanan pengunjung.", color: "bg-teal-50 text-teal-600 border-teal-100" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={index * 0.5}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-7">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── GALERI ── */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
              Galeri
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Galeri Puma Bharatangkas</h2>
            <p className="text-slate-500 mt-3 text-[15px]">Beberapa fasilitas yang tersedia di Puma Bharatangkas.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { image: "/lapangan.jpeg", title: "Lapangan Badminton" },
              { image: "/kantin.jpeg", title: "Kantin" },
              { image: "/kantor.jpeg", title: "Kantor" },
              { image: "/mushola.jpeg", title: "Mushola" },
              { image: "/toilet.jpeg", title: "Toilet" },
              { image: "/namamitra.jpeg", title: "Mitra Puma" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={index * 0.5}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">Fasilitas {item.title.toLowerCase()} di Puma Bharatangkas.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── NILAI KAMI ── */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Nilai Kami</h2>
            <p className="text-slate-500 mt-3 text-[15px]">Nilai yang selalu kami pegang dalam memberikan pelayanan.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Trophy, title: "Profesional", desc: "Selalu memberikan pelayanan terbaik kepada seluruh pelanggan.", bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100", bar: "bg-violet-400", topBar: "from-violet-400 to-purple-500" },
              { icon: ShieldCheck, title: "Integritas", desc: "Menjunjung tinggi kejujuran, tanggung jawab, dan kepercayaan.", bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", bar: "bg-blue-400", topBar: "from-blue-400 to-indigo-500" },
              { icon: Star, title: "Kualitas", desc: "Mengutamakan kualitas fasilitas dan pelayanan terbaik.", bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-100", bar: "bg-emerald-400", topBar: "from-emerald-400 to-teal-500" },
              { icon: HeartHandshake, title: "Kepuasan", desc: "Memberikan pengalaman bermain yang nyaman dan menyenangkan.", bg: "bg-amber-50", iconColor: "text-amber-600", border: "border-amber-100", bar: "bg-amber-400", topBar: "from-amber-400 to-orange-400" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={index * 0.5}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className={`bg-white rounded-2xl border ${item.border} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col p-6 gap-4 relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r ${item.topBar}`} />
                <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <item.icon size={22} className={item.iconColor} />
                </div>
                <div className={`w-7 h-1 rounded-full ${item.bar}`} />
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 mt-2 text-sm leading-7">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── JAM OPERASIONAL ── */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
              <Clock size={12} /> Jam Operasional
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Kami Siap Melayani Anda</h2>
            <p className="text-slate-500 mt-3 text-[15px]">Datang dan nikmati pengalaman bermain badminton terbaik setiap hari.</p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-2 bg-gradient-to-r from-[#001845] to-[#1741B6] text-white text-sm font-semibold">
              <div className="p-4 text-center">Hari</div>
              <div className="p-4 text-center">Jam</div>
            </div>
            {[
              ["Senin", "08.00 – 22.00"],
              ["Selasa", "08.00 – 22.00"],
              ["Rabu", "08.00 – 22.00"],
              ["Kamis", "08.00 – 22.00"],
              ["Jumat", "08.00 – 22.00"],
              ["Sabtu", "07.00 – 23.00"],
              ["Minggu", "07.00 – 23.00"],
            ].map(([hari, jam], i) => (
              <div key={i} className={`grid grid-cols-2 border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                <div className="p-4 text-center text-sm font-medium text-slate-700">{hari}</div>
                <div className="p-4 text-center text-sm font-semibold text-[#1741B6]">{jam}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Punya Pertanyaan?{" "}
              <span className="text-[#1741B6]">Cek Disini</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 max-w-5xl mx-auto">
            <Collapse title="Bagaimana cara booking lapangan?" description="Booking dapat dilakukan langsung melalui website atau menghubungi admin Puma Bharatangkas." />
            <Collapse title="Apakah tersedia penyewaan raket?" description="Ya, kami menyediakan penyewaan raket dan penjualan shuttlecock." />
            <Collapse title="Apakah tersedia parkir?" description="Tersedia area parkir luas untuk motor maupun mobil." />
            <Collapse title="Apakah bisa booking untuk turnamen?" description="Tentu saja. Kami menerima reservasi untuk turnamen, sparing maupun event komunitas." />
          </div>
        </section>

        {/* ── KONTAK ── */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
              Kontak
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Hubungi Kami</h2>
            <p className="text-slate-500 mt-3 text-[15px]">Ada pertanyaan atau butuh informasi lebih? Jangan ragu untuk menghubungi kami.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: MapPin, label: "Alamat", value: "Jl. Contoh No. 123, Kota Anda", color: "bg-blue-50 text-blue-600 border-blue-100" },
              { icon: Phone, label: "Telepon / WhatsApp", value: "0812 3456 7890", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
              { icon: Mail, label: "Email", value: "info@pumabadminton.com", color: "bg-violet-50 text-violet-600 border-violet-100" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i * 0.5}
                viewport={{ once: true }}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center flex flex-col items-center gap-3"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-10 md:py-16">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#001845] to-[#1741B6] rounded-3xl text-center py-16 px-8 text-white">
            <img
              src={kokk}
              alt=""
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-40 md:w-80 opacity-[0.05] pointer-events-none select-none"
            />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-5">
                Mulai Sekarang
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">Siap Bermain Bersama Kami?</h2>
              <p className="mt-4 text-blue-100 max-w-xl mx-auto leading-8 text-[15px]">
                Nikmati fasilitas badminton terbaik dengan suasana nyaman, pelayanan profesional, dan sistem booking yang mudah.
              </p>
              <button
                onClick={() => navigate("/booking")}
                className="mt-8 px-10 py-3.5 rounded-full bg-white text-[#1741B6] font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg text-sm"
              >
                Booking Sekarang
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}