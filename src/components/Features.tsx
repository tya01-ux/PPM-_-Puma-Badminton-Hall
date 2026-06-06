import { Trophy, Users, ShieldCheck, Tag } from "lucide-react";

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      {/* Friendly */}
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Pake items-start */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
          
          {/* Sisi Kiri */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-[0.2em]">
              Kenapa Memilih Kami?
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1]">
              Pengalaman Bermain yang <br />
              <span className="text-blue-600">Lebih Baik</span>
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              Kami berkomitmen memberikan pelayanan terbaik, fasilitas berkualitas, dan suasana yang nyaman untuk setiap pemain badminton.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <FeatureCard icon={<Trophy />} title="Fasilitas Berkualitas" desc="Lapangan standar internasional dengan perawatan rutin." />
              <FeatureCard icon={<Users />} title="Pelayanan Terbaik" desc="Tim ramah dan profesional siap membantu Anda." />
              <FeatureCard icon={<ShieldCheck />} title="Keamanan Terjamin" desc="Area aman dengan parkir luas dan CCTV 24 jam." />
              <FeatureCard icon={<Tag />} title="Harga Terjangkau" desc="Harga bersahabat dengan kualitas terbaik." />
            </div>
          </div>

          {/* Sisi Kanan */}
          <div className="lg:col-span-5 bg-[#041B4D] rounded-[2rem] p-10 flex flex-col items-start justify-center text-white shadow-2xl sticky top-24">
            <div className="space-y-6">
              <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em]">Produk Kami</p>
              <h3 className="text-3xl font-bold leading-tight">SHUTTLECOCK <br /> PUMA-BHARATANGKAS</h3>
              <p className="text-blue-100/70 text-sm leading-relaxed">Diproduksi dengan bahan pilihan dan proses berkualitas untuk performa terbaik, tahan lama, dan stabil.</p>
              <button className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105">
                Lihat Selengkapnya →
              </button>
            </div>
          </div>
        </div>
        
        {/* 
        Stats Bar
        <div className="bg-gray-50 rounded-[2rem] p-10 md:p-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 border border-gray-100">
          <StatItem label="Pelanggan Puas" value="1000+" icon={<Users />} />
          <StatItem label="Tahun Beroperasi" value="5+" icon={<Calendar />} />
          <StatItem label="Lapangan" value="5" icon={<Target />} />
          <StatItem label="Kualitas Produk" value="Premium" icon={<BarChart3 />} />
          <StatItem label="Terpercaya" value="Sejak 2019" icon={<Star />} />
        </div> */}
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

// const StatItem = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
//   <div className="flex flex-col items-center justify-center text-center space-y-2">
//     <div className="text-blue-600 bg-white p-3 rounded-xl shadow-sm">{icon}</div>
//     <div className="space-y-0.5">
//       <p className="text-2xl font-black text-gray-900">{value}</p>
//       <p className="text-gray-500 text-[10px] uppercase tracking-[0.1em] font-bold">{label}</p>
//     </div>
//   </div>
// );