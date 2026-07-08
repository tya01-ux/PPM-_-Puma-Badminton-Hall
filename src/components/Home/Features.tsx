import {
  Trophy,
  Users,
  ShieldCheck,
  Tag,
  Zap,
  Target,
  Award,
  Quote,
} from "lucide-react";

export const Features = () => {
  return (
    // pb-20 (mobile) dan pb-32 (desktop) memberi jarak ke footer
    <section className="relative mt-0 md:-mt-0 pb-20 md:pb-32 bg-white">

      {/* ============ KENAPA MEMILIH KAMI (tetap dibatasi max-w-7xl + padding) ============ */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <div className="inline-block bg-blue-500/10 text-blue-500 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-[0.2em] border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Kenapa Memilih Kami?
          </div>
        </div>

        {/* grid: kiri teks, kanan gambar + floating card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center mt-8">

          {/* KIRI: heading + progress bar + deskripsi */}
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1]">
              Pengalaman Bermain <br />
              yang <br />
              <span className="text-blue-600">Lebih Baik</span>
            </h2>

            <div className="mt-6 h-1.5 w-40 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-blue-600" />
            </div>

            <p className="mt-6 text-gray-600 text-sm leading-relaxed max-w-lg">
              Kami berkomitmen memberikan pelayanan terbaik, fasilitas berkualitas, dan suasana yang nyaman untuk setiap pemain badminton.
            </p>
          </div>

          {/* KANAN: gambar lapangan + floating card */}
          <div className="relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-[16/10]">
              <img
                src="/court-hero.jpg"
                alt="Lapangan badminton Puma-Bharatangkas"
                className="w-full h-full object-cover"
              />
              {/* overlay gradasi biar floating card lebih nempel secara visual */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001845]/20 via-transparent to-transparent" />
            </div>

            {/* floating card */}
            <div className="absolute left-4 sm:left-8 bottom-0 translate-y-1/3 sm:translate-y-1/4 max-w-[280px] bg-white rounded-2xl shadow-xl p-5 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Kualitas Terjamin</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Standar internasional untuk kenyamanan dan keamanan Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 CARD BERNOMOR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 sm:mt-20">
          <NumberedFeatureCard
            number="01"
            icon={<Trophy size={28} />}
            decorIcon={<Trophy size={90} />}
            title="Fasilitas Berkualitas"
            desc="Lapangan standar internasional dengan perawatan rutin untuk permainan terbaik."
          />
          <NumberedFeatureCard
            number="02"
            icon={<Users size={28} />}
            decorIcon={<Users size={90} />}
            title="Pelayanan Terbaik"
            desc="Tim ramah dan profesional siap membantu Anda kapan saja."
          />
          <NumberedFeatureCard
            number="03"
            icon={<ShieldCheck size={28} />}
            decorIcon={<ShieldCheck size={90} />}
            title="Keamanan Terjamin"
            desc="Area aman dengan parkir luas dan CCTV 24 jam untuk kenyamanan Anda."
          />
          <NumberedFeatureCard
            number="04"
            icon={<Tag size={28} />}
            decorIcon={<Tag size={90} />}
            title="Harga Terjangkau"
            desc="Harga bersahabat dengan kualitas terbaik untuk semua kalangan."
          />
        </div>
      </div>

      {/* ============ PRODUK KAMI (banner full width, isi tetap max-w-7xl center) ============ */}
      <div className="relative overflow-hidden mt-16 md:mt-24 bg-gradient-to-br from-blue-50 via-white to-blue-50/60 border-y border-blue-100 shadow-xl">

        {/* decorative wave pattern, versi terang */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none select-none"
          viewBox="0 0 1200 500"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 120 C 200 60, 400 180, 600 120 S 1000 60, 1200 120 V500 H0 Z"
            fill="#3b82f6"
          />
          <path
            d="M0 220 C 250 160, 450 280, 700 220 S 1050 160, 1200 220 V500 H0 Z"
            fill="#3b82f6"
            opacity="0.5"
          />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 p-7 sm:p-10 md:p-12">

          {/* KIRI: deskripsi + badge kualitas + info pemakaian */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em] mb-3">
                Produk Kami —
              </p>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight text-[#001845]">
                Shuttlecock <br /> Puma-<span className="text-blue-600">Bharatangkas</span>
              </h3>
              <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                Kami memproduksi shuttlecock sendiri dengan bahan pilihan dan proses berkualitas untuk menghasilkan shuttlecock yang tahan lama, stabil saat dimainkan, dan nyaman digunakan.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <MiniBadge icon={<Award size={16} />} label="Bahan Berkualitas" />
              <MiniBadge icon={<ShieldCheck size={16} />} label="Tahan Lama" />
              <MiniBadge icon={<Target size={16} />} label="Stabil & Presisi" />
            </div>

            <div className="flex items-center gap-3 bg-blue-600 rounded-2xl px-4 py-3.5 shadow-lg shadow-blue-600/20">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Zap size={16} className="text-white" />
              </div>
              <p className="text-xs text-white leading-relaxed">
                Digunakan untuk latihan & tanding dan berbagai kebutuhan olahraga.
              </p>
            </div>
          </div>

          {/* TENGAH: panel gelap berisi visual produk (ilustratif, ganti <img> kalau ada foto asli) */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full h-full min-h-[240px] rounded-2xl bg-gradient-to-b from-[#0A2A6E] to-[#041B4D] flex flex-col items-center justify-center overflow-hidden px-6 py-8 shadow-2xl">
              {/* decorative glow di dalam panel gelap */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

              <p className="text-[10px] font-bold tracking-[0.25em] text-blue-300 mb-2">
                PUMA-BHARATANGKAS
              </p>
              <p className="text-xl md:text-2xl font-black text-white tracking-wide">
                SHUTTLECOCK
              </p>
              <p className="text-[10px] md:text-xs text-blue-200/70 tracking-[0.15em] mt-1 mb-6">
                BEST QUALITY FOR BEST PERFORMANCE
              </p>

              {/* ilustrasi shuttlecock (bentuk dekoratif dari shape, bukan foto asli) */}
              <div className="flex items-end gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-slate-300 shadow-lg" />
                  <div className="w-1 h-14 bg-gradient-to-b from-slate-300 to-blue-700 -mt-1 rounded-full" />
                  <div className="w-6 h-16 rounded-full bg-gradient-to-b from-blue-500 to-blue-800 -mt-1 shadow-xl" />
                </div>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white to-slate-300 shadow-lg" />
                  <div className="w-1 h-10 bg-gradient-to-b from-slate-300 to-blue-700 -mt-1 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: mini feature cards (terang) + quote */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <MiniFeatureCard
              icon={<ShieldCheck size={16} />}
              title="Kontrol Terbaik"
              desc="Memberikan kontrol yang baik saat smash maupun drop shot."
            />
            <MiniFeatureCard
              icon={<Award size={16} />}
              title="Kualitas Terjamin"
              desc="Diproduksi dengan standar tinggi dan melalui proses seleksi ketat."
            />
            <MiniFeatureCard
              icon={<Users size={16} />}
              title="Mendukung Olahraga"
              desc="Sebagai hasil produksi digunakan untuk mendukung kegiatan olahraga di komunitas bulutangkis."
            />

            <div className="mt-1 rounded-2xl bg-white border border-blue-100 px-5 py-4 shadow-sm">
              <Quote size={18} className="text-blue-500 mb-2" />
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Kami berkomitmen menghadirkan produk berkualitas demi mendukung prestasi olahraga Indonesia."
              </p>
              <p className="mt-2 text-[11px] font-semibold text-blue-600">
                — Owner Puma-Bharatangkas Badminton Hall
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

const NumberedFeatureCard = ({
  number,
  icon,
  decorIcon,
  title,
  desc,
}: {
  number: string;
  icon: any;
  decorIcon: any;
  title: string;
  desc: string;
}) => (
  <div className="relative overflow-hidden p-6 pt-7 border border-gray-100 rounded-3xl bg-white hover:border-blue-100 hover:shadow-lg transition-all duration-300">
    {/* badge nomor pojok kanan atas */}
    <span className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
      {number}
    </span>

    {/* icon utama */}
    <div className="mb-5 text-blue-600 bg-blue-50 w-14 h-14 flex items-center justify-center rounded-2xl">
      {icon}
    </div>

    <h4 className="font-bold text-gray-900 text-base mb-2">{title}</h4>
    <div className="w-8 h-1 rounded-full bg-blue-600 mb-3" />
    <p className="text-gray-500 text-xs leading-relaxed relative z-10">{desc}</p>

    {/* icon dekoratif transparan di pojok kanan bawah */}
    <div className="absolute -bottom-3 -right-3 text-blue-50 pointer-events-none">
      {decorIcon}
    </div>
  </div>
);

const MiniBadge = ({ icon, label }: { icon: any, label: string }) => (
  <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white border border-blue-100 px-2 py-3 text-center shadow-sm">
    <span className="text-blue-500">{icon}</span>
    <span className="text-[10px] font-medium text-slate-600 leading-tight">{label}</span>
  </div>
);

const MiniFeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex gap-3 rounded-2xl bg-white border border-blue-100 px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
      {icon}
    </div>
    <div>
      <h5 className="text-sm font-bold text-[#001845] leading-tight">{title}</h5>
      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{desc}</p>
    </div>
  </div>
);