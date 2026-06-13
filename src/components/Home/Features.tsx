import { Trophy, Users, ShieldCheck, Tag } from "lucide-react";

export const Features = () => {
  return (
    // pb-20 (mobile) dan pb-32 (desktop) memberi jarak ke footer
    <section className="relative mt-0 md:-mt-0 px-6 pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Layout tetap flex-col (mobile) dan grid (desktop) agar fitur di atas, produk di bawah */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Sisi Kiri: Fitur */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block bg-blue-500/10 text-blue-500 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-[0.2em] border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Kenapa Memilih Kami?
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1]">
              Pengalaman Bermain yang <br />
              <span className="text-blue-600">Lebih Baik</span>
            </h2>
            
            <p className="text-gray-600 text-sm leading-relaxed max-w-lg">
              Kami berkomitmen memberikan pelayanan terbaik, fasilitas berkualitas, dan suasana yang nyaman untuk setiap pemain badminton.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <FeatureCard icon={<Trophy />} title="Fasilitas Berkualitas" desc="Lapangan standar internasional dengan perawatan rutin." />
              <FeatureCard icon={<Users />} title="Pelayanan Terbaik" desc="Tim ramah dan profesional siap membantu Anda." />
              <FeatureCard icon={<ShieldCheck />} title="Keamanan Terjamin" desc="Area aman dengan parkir luas dan CCTV 24 jam." />
              <FeatureCard icon={<Tag />} title="Harga Terjangkau" desc="Harga bersahabat dengan kualitas terbaik." />
            </div>
          </div>

          {/* Sisi Kanan: Produk */}
          {/* lg:sticky memastikan hanya di desktop kartu ikut scroll, di mobile tetap normal */}
          <div className="lg:col-span-5 bg-[#041B4D] rounded-[2rem] p-8 md:p-10 flex flex-col items-start justify-center text-white shadow-2xl lg:sticky lg:top-24">
            <div className="space-y-6">
              <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em]">Produk Kami</p>
              
              <h3 className="text-3xl font-bold leading-tight break-words">
                SHUTTLECOCK <br /> PUMA-BHARATANGKAS
              </h3>
              
              <p className="text-blue-100/70 text-sm leading-relaxed">
                Diproduksi dengan bahan pilihan dan proses berkualitas untuk performa terbaik, tahan lama, dan stabil.
              </p>
              
              <button className="bg-white w-full sm:w-auto text-blue-900 hover:bg-blue-50 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105">
                Lihat Selengkapnya →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 border border-gray-100 rounded-3xl bg-white hover:border-blue-100 hover:shadow-lg transition-all duration-300">
    <div className="mb-4 text-blue-600 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-xl">{icon}</div>
    <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
  </div>
);