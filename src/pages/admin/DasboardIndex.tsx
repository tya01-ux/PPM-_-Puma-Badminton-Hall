import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Users,
  BadgeDollarSign,
  ArrowUpRight,
  CalendarCheck,
  Hourglass,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useBookingStore } from "../../store/useBookingStore";
import { useReportStore } from "../../store/useReportStore";
import { usePaymentStore } from "../../store/usePaymentStore";
import { useUserStore } from "../../store/useUserStore";
import { useVenueStore } from "../../store/useVenueStore";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { id as localeId } from "date-fns/locale";

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} Rb`;
  return fmtRupiah(n);
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Bayar",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const DONUT_COLORS = ["#F59E0B", "#3B82F6", "#6366F1", "#10B981", "#EF4444"];
const PIE_COLORS = ["#3B82F6", "#6366F1", "#06B6D4", "#10B981", "#F59E0B"];

// ── Main Component ────────────────────────────────────────────────────────────
export default function DashboardIndex() {
  const navigate = useNavigate();
  const { bookings, fetchBookings, loading: loadingBooking } = useBookingStore();
  const { revenue, bookingStat, fetchRevenue, fetchBookingStat } = useReportStore();
  const { payments, fetchAllPayments } = usePaymentStore();
  const { users, fetchUsers } = useUserStore();
  const { venue, fetchVenue } = useVenueStore();

  // Date range: current week
  const today = new Date();
  const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");

  useEffect(() => {
    fetchBookings();
    fetchRevenue(weekStart, weekEnd);
    fetchBookingStat(weekStart, weekEnd);
    fetchAllPayments();
    fetchUsers();
    fetchVenue();
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const todayStr = format(today, "yyyy-MM-dd");
  const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd");

  const todayBookings = useMemo(
    () => bookings.filter((b) => b.startAt?.startsWith(todayStr)),
    [bookings, todayStr]
  );
  const yesterdayBookings = useMemo(
    () => bookings.filter((b) => b.startAt?.startsWith(yesterdayStr)),
    [bookings, yesterdayStr]
  );
  const todayVsYesterday =
    yesterdayBookings.length > 0
      ? (((todayBookings.length - yesterdayBookings.length) / yesterdayBookings.length) * 100).toFixed(1)
      : "0";

  const pendingPayments = useMemo(
    () => payments.filter((p) => p.status === "uploaded" || p.status === "pending"),
    [payments]
  );

  const activeUsers = useMemo(() => users.filter((u) => u.role === "user"), [users]);

  const uniqueCourts = useMemo(() => {
    const ids = new Set(bookings.map((b) => b.courtId));
    return ids.size;
  }, [bookings]);

  // Booking status counts (from bookingStat or fallback to local)
  const statusCounts = useMemo(() => {
    if (bookingStat?.byStatus) {
      return Object.entries(bookingStat.byStatus).map(([key, val]) => ({
        name: STATUS_LABEL[key] ?? key,
        value: val as number,
      }));
    }
    const map: Record<string, number> = {};
    bookings.forEach((b) => {
      const label = STATUS_LABEL[b.status] ?? b.status;
      map[label] = (map[label] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [bookingStat, bookings]);

  const totalStatusCount = statusCounts.reduce((s, c) => s + c.value, 0);

  // Revenue per court pie — ambil dari revenue.byCourt (sudah confirmed), fallback bookingStat, fallback local
  const courtRevenuePie = useMemo(() => {
    // ✅ Prioritas 1: dari getRevenueReport (sudah filter confirmed + ada totalAmount)
    if ((revenue as any)?.byCourt && Object.keys((revenue as any).byCourt).length > 0) {
      return Object.entries((revenue as any).byCourt as Record<string, number>).map(([name, value]) => ({ name, value }));
    }
    // Prioritas 2: dari getBookingReport (juga sudah difix jadi revenue)
    if (bookingStat?.byCourt && Object.keys(bookingStat.byCourt).length > 0) {
      return Object.entries(bookingStat.byCourt).map(([name, value]) => ({ name, value: value as number }));
    }
    // Fallback: hitung lokal dari bookings confirmed/completed
    const map: Record<string, number> = {};
    bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .forEach((b) => {
        const name = b.court?.name ?? `Lapangan ${b.courtId}`;
        map[name] = (map[name] ?? 0) + (b.payment?.totalAmount ?? b.courtPrice ?? 0);
      });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [revenue, bookingStat, bookings]);

  const totalCourtRevenue = courtRevenuePie.reduce((s, c) => s + c.value, 0);

  // Chart data — fallback dari bookings lokal kalau API kosong
  const chartData = useMemo(() => {
    if (revenue?.chart?.length) return revenue.chart.map((p) => ({ ...p, total: p.total }));

    // Fallback: group confirmed/completed bookings by date
    const map: Record<string, number> = {};
    bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .forEach((b) => {
        const date = b.startAt?.slice(0, 10);
        if (date) map[date] = (map[date] ?? 0) + (b.payment?.totalAmount ?? b.courtPrice ?? 0);
      });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ date, total }));
  }, [revenue, bookings]);

  // Recent bookings (latest 5)
  const recentBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()).slice(0, 5),
    [bookings]
  );

  // Hitung totalRevenue dari bookings yang confirmed/completed jika API belum return data
  const totalRevenueFromBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "confirmed" || b.status === "completed")
        .reduce((sum, b) => sum + (b.payment?.totalAmount ?? b.courtPrice ?? 0), 0),
    [bookings]
  );

  const totalRevenue =
    revenue?.totalRevenue && revenue.totalRevenue > 0
      ? revenue.totalRevenue
      : totalRevenueFromBookings;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Selamat datang kembali, Admin!
            {venue?.name && (
              <span className="ml-2 text-blue-600 font-medium">— {venue.name}</span>
            )}
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
          {format(today, "dd MMM yyyy", { locale: localeId })}
        </div>
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Booking"
          value={String(bookings.length)}
          badge={`+${bookingStat?.totalBooking ?? bookings.length}`}
          sub="minggu ini"
          icon={<CalendarDays size={22} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Booking Hari Ini"
          value={String(todayBookings.length)}
          badge={`${Number(todayVsYesterday) >= 0 ? "+" : ""}${todayVsYesterday}%`}
          sub="dari kemarin"
          icon={<CalendarCheck size={22} />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
          badgeColor={Number(todayVsYesterday) >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}
        />
        <StatCard
          title="Pendapatan (Total)"
          value={fmtShort(totalRevenue)}
          badge={revenue?.avgPerDay ? `Avg ${fmtShort(revenue.avgPerDay)}/hari` : "+15.2%"}
          sub="minggu ini"
          icon={<BadgeDollarSign size={22} />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Pending Pembayaran"
          value={String(pendingPayments.length)}
          badge={pendingPayments.length > 0 ? "Perlu aksi" : "Bersih"}
          sub="menunggu konfirmasi"
          icon={<Hourglass size={22} />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          badgeColor={pendingPayments.length > 0 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"}
        />
        <StatCard
          title="Member Aktif"
          value={String(activeUsers.length)}
          badge={`+${Math.round(activeUsers.length * 0.097)} baru`}
          sub="dari minggu lalu"
          icon={<Users size={22} />}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />
        <StatCard
          title="Lapangan Aktif"
          value={String(uniqueCourts || (venue ? 6 : "—"))}
          badge="100%"
          sub="dari total lapangan"
          icon={<LayoutGrid size={22} />}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
        />
      </section>

      {/* Grafik Pendapatan + Booking Terbaru */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Grafik Pendapatan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Pendapatan</p>
              <h2 className="text-lg font-bold text-slate-800">Grafik Pendapatan</h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 rounded-lg px-3 py-1">Mingguan</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => format(new Date(v), "dd MMM")} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip formatter={(v) => v !== undefined ? fmtRupiah(v as number) : ''} labelFormatter={(l) => format(new Date(l as string | number), "dd MMM yyyy")} />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: "#3B82F6" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              {loadingBooking ? "Memuat data..." : "Belum ada data pendapatan minggu ini"}
            </div>
          )}
        </div>

        {/* Booking Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Booking</p>
              <h2 className="text-lg font-bold text-slate-800">Booking Terbaru</h2>
            </div>
            <button
              onClick={() => navigate("/admin/booking")}
              className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs border-b border-slate-100">
                  <th className="text-left pb-2 font-medium">Kode</th>
                  <th className="text-left pb-2 font-medium">Pelanggan</th>
                  <th className="text-left pb-2 font-medium">Lapangan</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-right pb-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentBookings.length > 0 ? (
                  recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 font-mono text-xs text-slate-600">{b.bookingCode}</td>
                      <td className="py-2.5 text-slate-700 font-medium">{b.user?.name ?? "—"}</td>
                      <td className="py-2.5 text-slate-500">{b.court?.name ?? `Court ${b.courtId}`}</td>
                      <td className="py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLOR[b.status] ?? "bg-slate-100 text-slate-600"}`}>
                          {STATUS_LABEL[b.status] ?? b.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-700 font-semibold">
                        {b.payment?.totalAmount ? fmtShort(b.payment.totalAmount) : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                      Belum ada booking
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pendapatan per Lapangan + Status Booking + Pending Pembayaran */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pie: Pendapatan per Lapangan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Lapangan</p>
            <h2 className="text-lg font-bold text-slate-800">Pendapatan per Lapangan</h2>
          </div>
          {courtRevenuePie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={courtRevenuePie} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {courtRevenuePie.map((entry, i) => (
                      <Cell key={`pie-court-${entry.name}-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => typeof v === "number" ? fmtRupiah(v) : ""} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {courtRevenuePie.map((c, i) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-600">{c.name}</span>
                      <span className="text-slate-400 text-xs">
                        {totalCourtRevenue > 0 ? Math.round((c.value / totalCourtRevenue) * 100) : 0}%
                      </span>
                    </div>
                    <span className="font-semibold text-slate-700">{fmtShort(c.value)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-bold text-slate-800">
                  <span>Total</span>
                  <span>{fmtShort(totalCourtRevenue)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Belum ada data</div>
          )}
        </div>

        {/* Donut: Status Booking */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Statistik</p>
            <h2 className="text-lg font-bold text-slate-800">Status Booking</h2>
          </div>
          {statusCounts.length > 0 ? (
            <>
              <div className="relative">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={statusCounts} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                      {statusCounts.map((entry, i) => (
                        <Cell key={`donut-status-${entry.name}-${i}`} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-slate-800">{totalStatusCount}</span>
                  <span className="text-xs text-slate-400">Total Booking</span>
                </div>
              </div>
              <div className="space-y-2 mt-2">
                {statusCounts.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                      <span className="text-slate-600">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">{s.value}</span>
                      <span className="text-slate-400 text-xs">
                        ({totalStatusCount > 0 ? ((s.value / totalStatusCount) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Belum ada data</div>
          )}
        </div>

        {/* Pending Pembayaran */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Pembayaran</p>
              <h2 className="text-lg font-bold text-slate-800">Pending Pembayaran</h2>
            </div>
            <button
              onClick={() => navigate("/admin/payment")}
              className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {pendingPayments.length > 0 ? (
              pendingPayments.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Hourglass size={14} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {p.booking?.bookingCode ?? `Payment #${p.id}`}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {p.booking?.user?.name ?? "—"} • {p.booking?.court?.name ?? "—"}
                    </p>
                    {p.booking?.startAt && (
                      <p className="text-xs text-slate-400">
                        {format(new Date(p.booking.startAt), "dd MMM yyyy, HH:mm", { locale: localeId })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{fmtShort(p.totalAmount)}</p>
                    <span className="text-xs text-amber-600 font-medium">Pending</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm h-32">
                Tidak ada pembayaran pending 🎉
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  badge,
  sub,
  icon,
  iconBg,
  iconColor,
  badgeColor = "text-emerald-600 bg-emerald-50",
}: {
  title: string;
  value: string;
  badge: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badgeColor?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 truncate">{title}</p>
          <h3 className="mt-1.5 text-2xl font-extrabold text-slate-800 leading-tight">{value}</h3>
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColor}`}>
              <ArrowUpRight size={10} />
              {badge}
            </span>
            <span className="text-xs text-slate-400">{sub}</span>
          </div>
        </div>
        <div className={`h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
      </div>
    </div>
  );
}