import {
  CalendarDays,
  Users,
  BadgeDollarSign,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { GiShuttlecock } from "react-icons/gi";

export default function DashboardIndex() {
  return (
    <div className="space-y-8">
      {/* HERO WELCOME */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#041B4D] via-[#0A2E7A] to-blue-600 p-6 md:p-10 text-white shadow-[0_20px_60px_rgba(4,27,77,0.35)]">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />

        {/* Shuttlecock Decoration */}
        <div className="absolute right-4 bottom-0 hidden md:block text-[180px] text-white/5">
          🏸
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <TrendingUp size={16} />
            <span className="text-sm font-medium">
              Puma-Bharatangkas Admin Panel
            </span>
          </div>

          <h1 className="mt-6 text-3xl md:text-5xl font-extrabold leading-tight">
            Selamat Datang,
            <br />
            <span className="text-blue-200">Administrator 👋</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-blue-100">
            Kelola booking, lapangan, pengguna, dan pantau seluruh
            aktivitas Puma-Bharatangkas Badminton Hall melalui dashboard
            yang modern, cepat, dan mudah digunakan.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3">
              <p className="text-xs uppercase text-blue-200">
                Booking Hari Ini
              </p>

              <h3 className="text-2xl font-bold">
                18
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3">
              <p className="text-xs uppercase text-blue-200">
                Lapangan Aktif
              </p>

              <h3 className="text-2xl font-bold">
                5
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3">
              <p className="text-xs uppercase text-blue-200">
                Pengguna
              </p>

              <h3 className="text-2xl font-bold">
                256
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Booking"
          value="128"
          growth="+12%"
          subtitle="dibanding bulan lalu"
          icon={<CalendarDays size={28} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          borderColor="hover:border-blue-300"
        />

        <StatCard
          title="Total Lapangan"
          value="5"
          growth="100%"
          subtitle="semua tersedia"
          icon={<GiShuttlecock size={28} />}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
          borderColor="hover:border-cyan-300"
        />

        <StatCard
          title="Total Pengguna"
          value="256"
          growth="+24%"
          subtitle="pengguna aktif"
          icon={<Users size={28} />}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
          borderColor="hover:border-violet-300"
        />

        <StatCard
          title="Pendapatan"
          value="Rp 12,5 Jt"
          growth="+18%"
          subtitle="bulan ini"
          icon={<BadgeDollarSign size={28} />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          borderColor="hover:border-emerald-300"
        />
      </section>

      {/* BOTTOM SECTION */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Aktivitas */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-[0.2em]">
                Aktivitas
              </p>

              <h2 className="text-2xl font-bold text-slate-800">
                Aktivitas Terbaru
              </h2>
            </div>

            <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            <ActivityItem
              title="Booking baru berhasil dibuat"
              desc="Lapangan 2 • 19.00 - 21.00 WIB"
              color="bg-blue-500"
            />

            <ActivityItem
              title="Pengguna baru mendaftar"
              desc="2 akun baru bergabung"
              color="bg-violet-500"
            />

            <ActivityItem
              title="Data lapangan diperbarui"
              desc="Harga Lapangan 3 berhasil diubah"
              color="bg-cyan-500"
            />

            <ActivityItem
              title="Pembayaran berhasil dikonfirmasi"
              desc="Transaksi sebesar Rp 150.000"
              color="bg-emerald-500"
            />
          </div>
        </div>

        {/* Quick Access */}
        <div className="rounded-[2rem] bg-gradient-to-br from-[#041B4D] via-[#0A2E7A] to-blue-600 text-white p-6 shadow-[0_20px_50px_rgba(4,27,77,0.35)] relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 text-[120px] text-white/5">
            🏸
          </div>

          <div className="relative z-10">
            <p className="text-blue-200 uppercase text-sm tracking-[0.2em]">
              Quick Access
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Akses Cepat
            </h2>

            <p className="mt-3 text-sm text-blue-100">
              Kelola data dengan lebih cepat melalui menu pintasan.
            </p>

            <div className="mt-8 space-y-4">
              <QuickButton text="Kelola Booking" />
              <QuickButton text="Kelola Lapangan" />
              <QuickButton text="Kelola Pengguna" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  growth,
  subtitle,
  icon,
  iconBg,
  iconColor,
  borderColor,
}: {
  title: string;
  value: string;
  growth: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}) {
  return (
    <div
      className={`
        group
        bg-white
        rounded-[2rem]
        border border-slate-200
        p-6
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        ${borderColor}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-extrabold text-slate-800">
            {value}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
              <ArrowUpRight size={12} />
              {growth}
            </span>

            <span className="text-xs text-slate-500">
              {subtitle}
            </span>
          </div>
        </div>

        <div
          className={`
            h-14
            w-14
            rounded-2xl
            flex
            items-center
            justify-center
            ${iconBg}
            ${iconColor}
            group-hover:scale-110
            transition-transform
            duration-300
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  desc,
  color,
}: {
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl p-4 hover:bg-slate-50 transition-all duration-300">
      <div
        className={`mt-2 h-3 w-3 rounded-full ${color} shadow-md`}
      />

      <div>
        <p className="font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {desc}
        </p>
      </div>
    </div>
  );
}

function QuickButton({
  text,
}: {
  text: string;
}) {
  return (
    <button
      className="
        w-full
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-white/10
        bg-white/10
        px-5
        py-4
        backdrop-blur-sm
        hover:bg-white/20
        hover:translate-x-1
        transition-all
        duration-300
      "
    >
      <span className="font-medium">
        {text}
      </span>

      <ArrowUpRight size={18} />
    </button>
  );
}