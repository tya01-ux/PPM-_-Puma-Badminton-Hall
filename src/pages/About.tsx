export default function About() {
  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen pt-20 overflow-x-hidden">
      {/* 1. HERO ABOUT (Rata Kiri Sesuai Gambar) */}

      <section className="bg-[#0B2447] text-white pt-24 pb-20 md:pt-32 md:pb-24 px-6 md:px-16 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Konten Teks (Rata Kiri) */}

          <div className="max-w-2xl text-left">
            {/* Garis Dekorasi Kecil di Atas Judul */}

            <div className="w-10 h-1 bg-[#38bdf8] mb-4 rounded-full"></div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Tentang <span className="text-[#38bdf8]">Puma Bharatangkas</span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 mt-4 leading-relaxed">
              Pusat olahraga badminton modern yang dirancang untuk memberikan
              pengalaman bermain terbaik, kenyamanan maksimal, dan kemudahan
              akses bagi semua kalangan.
            </p>
          </div>

          {/* Sisi Kanan: Dekorasi Transparan GOR / Shuttlecock (Opsional jika ingin diisi ikon bawaan) */}

          <div className="hidden md:block opacity-10 pointer-events-none select-none">
            <span className="text-9xl">🏸</span>
          </div>
        </div>
      </section>

      {/* 2. BARIS 1: TENTANG PUMA (Teks Kiri, Gambar Kanan) */}

      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-1 md:order-1">
          <div className="w-12 h-1 bg-[#19376D] mb-4"></div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2447] mb-4">
            Pusat Badminton Berkualitas
          </h2>

          <p className="text-slate-600 leading-relaxed mb-4">
            Puma Bharatangkas adalah pusat olahraga badminton yang menyediakan
            lapangan berkualitas, fasilitas nyaman, dan sistem booking yang
            mudah untuk mendukung aktivitas olahraga masyarakat.
          </p>

          <p className="text-slate-600 leading-relaxed">
            Kami hadir sebagai sarana bermain yang nyaman, aman, dan mudah
            diakses oleh semua kalangan, mulai dari pemula hingga atlet
            profesional. Dengan komitmen pelayanan yang tinggi, kami terus
            berkembang menjadi pilihan utama.
          </p>
        </div>

        <div className="order-2 md:order-2 bg-linear-to-br from-slate-200 to-slate-300 h-64 md:h-85 rounded-2xl shadow-inner flex items-center justify-center border border-slate-200 overflow-hidden relative">
          <span className="text-slate-400 font-medium text-sm">
            [ Foto Lapangan Utama ]
          </span>
        </div>
      </section>

      {/* 3. BARIS 2: VISI MISI (BLOK BACKGROUND PUTIH MINIMALIS) */}

      <section className="bg-white py-20 md:py-24 px-4 border-t border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Gambar/Visual di Kiri untuk Konsep Selang-Seling */}

          <div className="order-2 md:order-1 bg-linear-to-br from-slate-100 to-slate-200 h-64 md:h-85 rounded-2xl shadow-xs flex items-center justify-center border border-slate-200 overflow-hidden">
            <span className="text-slate-400 font-medium text-sm">
              [ Ilustrasi / Foto Visi Misi ]
            </span>
          </div>

          {/* Konten Teks Visi Misi di Kanan */}

          <div className="order-1 md:order-2 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#0B2447] mb-2 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#19376D] rounded-full inline-block"></span>
                Visi Kami
              </h3>

              <p className="text-slate-600 leading-relaxed pl-4">
                Menjadi pusat olahraga badminton yang modern, nyaman, dan
                terpercaya bagi seluruh lapisan masyarakat.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#0B2447] mb-2 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#008DDA] rounded-full inline-block"></span>
                Misi Kami
              </h3>

              <ul className="space-y-2 text-slate-600 pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#008DDA] font-bold">✓</span>{" "}
                  Menyediakan infrastruktur lapangan berstandar prima.
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-[#008DDA] font-bold">✓</span> Memberikan
                  pelayanan ramah dan responsif.
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-[#008DDA] font-bold">✓</span>{" "}
                  Mempermudah akses dengan integrasi teknologi modern.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BARIS 3: FASILITAS (Teks Kiri, Grid Kanan) */}

      <section className="py-20 md:py-24 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* Kolom Teks Judul */}

        <div className="md:col-span-1 md:sticky md:top-28">
          <div className="w-12 h-1 bg-[#008DDA] mb-4"></div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2447] mb-3">
            Fasilitas Terbaik
          </h2>

          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Kami memastikan seluruh kenyamanan Anda terpenuhi secara maksimal
            sebelum, selama, dan sesudah pertandingan selesai.
          </p>
        </div>

        {/* Kolom Grid Items di Sebelah Kanan */}

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-2xl mb-2">🏸</div>

            <h4 className="font-bold text-[#0B2447] text-sm mb-1">
              Lapangan Premium
            </h4>

            <p className="text-xs text-slate-500">
              Lantai karpet empuk, anti licin standar turnamen resmi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-2xl mb-2">🚗</div>

            <h4 className="font-bold text-[#0B2447] text-sm mb-1">
              Parkir Luas & Aman
            </h4>

            <p className="text-xs text-slate-500">
              Menampung puluhan kendaraan roda dua maupun roda empat.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-2xl mb-2">🚻</div>

            <h4 className="font-bold text-[#0B2447] text-sm mb-1">
              Kamar Bilas Bersih
            </h4>

            <p className="text-xs text-slate-500">
              Fasilitas toilet yang higienis dan terawat sepanjang waktu.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-2xl mb-2">💡</div>

            <h4 className="font-bold text-[#0B2447] text-sm mb-1">
              Lighting Anti-Silau
            </h4>

            <p className="text-xs text-slate-500">
              Pencahayaan LED fokus merata tanpa mengganggu pandangan mata.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BARIS 4: KENAPA MEMILIH KAMI (Blok Flat Navy) */}

      <section className="bg-[#0B2447] text-white py-20 md:py-24 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Teks di Kiri */}

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Kenapa Harus Main di Puma Bharatangkas?
              </h2>

              <p className="text-slate-300 text-sm md:text-base">
                Kami mengutamakan konsistensi kualitas demi kenyamanan member
                grup maupun pemain lepasan.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-[#19376D]/40 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-emerald-400 font-bold">✓</span>

                <span className="text-sm font-medium">
                  Sistem Booking Real-Time & Praktis
                </span>
              </div>

              <div className="flex items-center gap-3 bg-[#19376D]/40 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-emerald-400 font-bold">✓</span>

                <span className="text-sm font-medium">
                  Tarif Sewa Kompetitif & Fleksibel
                </span>
              </div>

              <div className="flex items-center gap-3 bg-[#19376D]/40 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-emerald-400 font-bold">✓</span>

                <span className="text-sm font-medium">
                  Kondisi Lapangan Terjadwal Steril
                </span>
              </div>
            </div>
          </div>

          {/* Gambar di Kanan */}

          <div className="bg-[#19376D] h-64 md:h-80 rounded-2xl shadow-md flex items-center justify-center border border-slate-700 overflow-hidden">
            <span className="text-slate-400 font-medium text-sm">
              [ Foto Aktivitas / Member ]
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
