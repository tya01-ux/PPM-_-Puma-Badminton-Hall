import { useEffect, useState, useMemo } from "react";
import {
  Download, TrendingUp, CalendarDays, BarChart2,
  Users, CreditCard, FileText, ChevronDown,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useReportStore } from "../../../store/useReportStore";
import { useBookingStore } from "../../../store/useBookingStore";
import { usePaymentStore } from "../../../store/usePaymentStore";
import { useUserStore } from "../../../store/useUserStore";
import {
  format, subDays, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
} from "date-fns";
import { id as localeId } from "date-fns/locale";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} Rb`;
  return fmtRupiah(n);
};

const toISO = (d: Date) => d.toISOString().slice(0, 10);

const DATE_PRESETS = [
  { label: "7 Hari Terakhir", value: "7d" },
  { label: "30 Hari Terakhir", value: "30d" },
  { label: "Minggu Ini", value: "thisWeek" },
  { label: "Bulan Ini", value: "thisMonth" },
  { label: "Bulan Lalu", value: "lastMonth" },
  { label: "Custom", value: "custom" },
];

function getPresetRange(p: string) {
  const today = new Date();
  switch (p) {
    case "7d": return { start: toISO(subDays(today, 6)), end: toISO(today) };
    case "30d": return { start: toISO(subDays(today, 29)), end: toISO(today) };
    case "thisWeek": return {
      start: toISO(startOfWeek(today, { weekStartsOn: 1 })),
      end: toISO(endOfWeek(today, { weekStartsOn: 1 })),
    };
    case "thisMonth": return { start: toISO(startOfMonth(today)), end: toISO(endOfMonth(today)) };
    case "lastMonth": {
      const lm = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return { start: toISO(startOfMonth(lm)), end: toISO(endOfMonth(lm)) };
    }
    default: return { start: toISO(subDays(today, 29)), end: toISO(today) };
  }
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Bayar",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  uploaded: "Bukti Diunggah",
  rejected: "Ditolak",
  expired: "Kedaluwarsa",
  cash: "Tunai",
};

const STATUS_PILL: Record<string, string> = {
  pending:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  uploaded:  "bg-purple-50 text-purple-700 border border-purple-200",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  rejected:  "bg-rose-50 text-rose-700 border border-rose-200",
  expired:   "bg-slate-100 text-slate-500 border border-slate-200",
  cash:      "bg-teal-50 text-teal-700 border border-teal-200",
};

const BAR_COLOR: Record<string, string> = {
  pending: "#F59E0B", uploaded: "#8B5CF6", confirmed: "#3B82F6",
  completed: "#10B981", cancelled: "#EF4444",
};

type TabType = "pendapatan" | "booking" | "pembayaran" | "membership";

// ── Component ─────────────────────────────────────────────────────────────────
export default function LaporanIndex() {
  const { revenue, bookingStat, loading, fetchRevenue, fetchBookingStat } = useReportStore();
  const { bookings, fetchBookings } = useBookingStore();
  const { payments, fetchAllPayments } = usePaymentStore();
  const { users, fetchUsers } = useUserStore();

  const [tab, setTab] = useState<TabType>("pendapatan");
  const [preset, setPreset] = useState("30d");
  const [startDate, setStartDate] = useState(getPresetRange("30d").start);
  const [endDate, setEndDate] = useState(getPresetRange("30d").end);
  const [selectedCourt, setSelectedCourt] = useState("semua");

  useEffect(() => {
    fetchBookings();
    fetchAllPayments();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchRevenue(startDate, endDate);
    fetchBookingStat(startDate, endDate);
  }, [startDate, endDate]);

  const handlePreset = (p: string) => {
    setPreset(p);
    if (p !== "custom") {
      const { start, end } = getPresetRange(p);
      setStartDate(start);
      setEndDate(end);
    }
  };

  const presetLabel = DATE_PRESETS.find((p) => p.value === preset)?.label ?? "Periode";

  // Lapangan unik
  const courtList = useMemo(() => {
    const s = new Set(bookings.map((b) => b.court?.name).filter(Boolean) as string[]);
    return Array.from(s);
  }, [bookings]);

  // ── Derived: Pendapatan ───────────────────────────────────────────────────
  const filteredConfirmed = useMemo(() =>
    bookings.filter((b) => {
      const inRange = b.startAt >= startDate && b.startAt <= endDate + "T23:59:59";
      const ok = selectedCourt === "semua" || b.court?.name === selectedCourt;
      return (b.status === "confirmed" || b.status === "completed") && inRange && ok;
    }), [bookings, startDate, endDate, selectedCourt]);

  const totalRevenue = useMemo(() => {
    if (revenue?.totalRevenue && revenue.totalRevenue > 0) return revenue.totalRevenue;
    return filteredConfirmed.reduce((s, b) => s + (b.payment?.totalAmount ?? b.courtPrice ?? 0), 0);
  }, [revenue, filteredConfirmed]);

  const chartData = useMemo(() => {
    if (revenue?.chart?.length) return revenue.chart;
    const map: Record<string, number> = {};
    filteredConfirmed.forEach((b) => {
      const d = b.startAt?.slice(0, 10);
      if (d) map[d] = (map[d] ?? 0) + (b.payment?.totalAmount ?? b.courtPrice ?? 0);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ date, total }));
  }, [revenue, filteredConfirmed]);

  // ── Derived: Booking ──────────────────────────────────────────────────────
  const filteredBookings = useMemo(() =>
    bookings.filter((b) => {
      const inRange = b.startAt >= startDate && b.startAt <= endDate + "T23:59:59";
      const ok = selectedCourt === "semua" || b.court?.name === selectedCourt;
      return inRange && ok;
    }), [bookings, startDate, endDate, selectedCourt]);

  const byStatus = useMemo(() => {
    if (bookingStat?.byStatus) return bookingStat.byStatus;
    const map: Record<string, number> = {};
    filteredBookings.forEach((b) => { map[b.status] = (map[b.status] ?? 0) + 1; });
    return map;
  }, [bookingStat, filteredBookings]);

  const byCourt = useMemo(() => {
    if (bookingStat?.byCourt) return bookingStat.byCourt;
    const map: Record<string, number> = {};
    filteredBookings.forEach((b) => {
      const n = b.court?.name ?? `Court ${b.courtId}`;
      map[n] = (map[n] ?? 0) + 1;
    });
    return map;
  }, [bookingStat, filteredBookings]);

  const totalByStatus = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const totalByCourt = Object.values(byCourt).reduce((a, b) => a + b, 0);

  // ── Derived: Pembayaran ───────────────────────────────────────────────────
  const totalConfirmedRevenue = useMemo(() =>
    payments.filter((p) => p.status === "confirmed")
      .reduce((s, p) => s + p.totalAmount, 0), [payments]);

  const paymentByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    payments.forEach((p) => { map[p.status] = (map[p.status] ?? 0) + 1; });
    return map;
  }, [payments]);

  // ── Derived: Membership ───────────────────────────────────────────────────
  const memberUsers = useMemo(() => users.filter((u) => u.role === "user"), [users]);
  const newUsersInRange = useMemo(() =>
    users.filter((u) => {
      const c = u.createdAt?.slice(0, 10) ?? "";
      return c >= startDate && c <= endDate;
    }), [users, startDate, endDate]);

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = () => {
    let rows: string[][] = [];
    if (tab === "pendapatan") {
      rows = [["Tanggal", "Total"], ...chartData.map((c) => [c.date, String(c.total)])];
    } else if (tab === "booking") {
      rows = [
        ["Kode", "Pelanggan", "Lapangan", "Waktu", "Status", "Total"],
        ...filteredBookings.map((b) => [
          b.bookingCode, b.user?.name ?? "", b.court?.name ?? "",
          b.startAt?.slice(0, 16) ?? "", b.status,
          String(b.payment?.totalAmount ?? 0),
        ]),
      ];
    } else if (tab === "pembayaran") {
      rows = [
        ["Kode Booking", "Pelanggan", "Lapangan", "Status", "Total"],
        ...payments.map((p) => [
          p.booking?.bookingCode ?? "", p.booking?.user?.name ?? "",
          p.booking?.court?.name ?? "", p.status, String(p.totalAmount),
        ]),
      ];
    } else {
      rows = [["Nama", "Email", "No. HP", "Bergabung"],
        ...newUsersInRange.map((u) => [u.name, u.email, u.phone ?? "", u.createdAt?.slice(0, 10) ?? ""])];
    }
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `laporan-${tab}-${startDate}-${endDate}.csv`;
    a.click();
  };

  // ── Tab config ────────────────────────────────────────────────────────────
  const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "pendapatan",  label: "Pendapatan",  icon: <TrendingUp size={15} /> },
    { key: "booking",     label: "Booking",     icon: <CalendarDays size={15} /> },
    { key: "pembayaran",  label: "Pembayaran",  icon: <CreditCard size={15} /> },
    { key: "membership",  label: "Membership",  icon: <Users size={15} /> },
  ];

  return (
    <div className="w-full">
      <div className="space-y-5">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">Admin</p>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Laporan</h1>
            <p className="text-slate-400 text-sm mt-1">Pendapatan, booking, dan ringkasan transaksi.</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* ── TABS ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                tab === t.key
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── FILTER BAR ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex flex-wrap items-end gap-3">
          {/* Preset dropdown */}
          <div className="relative group">
            <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wider">Periode</label>
            <div className="relative">
              <select
                value={preset}
                onChange={(e) => handlePreset(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[180px] transition"
              >
                {DATE_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Custom range */}
          {preset === "custom" && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wider">Dari</label>
                <input type="date" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wider">Sampai</label>
                <input type="date" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
              </div>
            </>
          )}

          {/* Court filter */}
          {(tab === "pendapatan" || tab === "booking") && (
            <div className="relative">
              <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wider">Lapangan</label>
              <div className="relative">
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[160px] transition"
                >
                  <option value="semua">Semua Lapangan</option>
                  {courtList.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Range info badge */}
          <div className="ml-auto flex items-end">
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              {format(new Date(startDate), "dd MMM yyyy", { locale: localeId })}
              {" — "}
              {format(new Date(endDate), "dd MMM yyyy", { locale: localeId })}
            </span>
          </div>
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center py-32">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-sm font-semibold">Memuat laporan...</p>
            </div>
          </div>
        ) : (
          <>

            {/* ════════════ TAB PENDAPATAN ════════════ */}
            {tab === "pendapatan" && (
              <div className="space-y-5">
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <BigStatCard
                    label="Total Pendapatan"
                    value={fmtShort(totalRevenue)}
                    sub={`${filteredConfirmed.length} transaksi confirmed`}
                    icon={<TrendingUp size={20} />}
                    iconBg="bg-emerald-100" iconColor="text-emerald-600"
                    accent="border-l-4 border-l-emerald-400"
                  />
                  <BigStatCard
                    label="Total Booking"
                    value={String(revenue?.totalBooking ?? filteredBookings.length)}
                    sub="dalam periode ini"
                    icon={<CalendarDays size={20} />}
                    iconBg="bg-blue-100" iconColor="text-blue-600"
                    accent="border-l-4 border-l-blue-400"
                  />
                  <BigStatCard
                    label="Rata-rata per Hari"
                    value={fmtShort(revenue?.avgPerDay ?? (chartData.length > 0 ? Math.round(totalRevenue / chartData.length) : 0))}
                    sub="pendapatan harian"
                    icon={<BarChart2 size={20} />}
                    iconBg="bg-violet-100" iconColor="text-violet-600"
                    accent="border-l-4 border-l-violet-400"
                  />
                </div>

                {/* Grafik */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Grafik</p>
                      <h2 className="text-lg font-bold text-slate-800">Grafik Pendapatan</h2>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200">
                      {presetLabel}
                    </span>
                  </div>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.18} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                          tickFormatter={(v) => format(new Date(v), "dd MMM", { locale: localeId })} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                          tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}Jt`} />
                        <Tooltip
                          contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 13 }}
                          formatter={(value) => [fmtRupiah(typeof value === "number" ? value : 0), "Pendapatan"]}
                          labelFormatter={(l) => format(new Date(l), "dd MMM yyyy", { locale: localeId })}
                        />
                        <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2.5}
                          fill="url(#grad1)" dot={false} activeDot={{ r: 5, fill: "#3B82F6", strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState text="Belum ada data pendapatan di periode ini" />
                  )}
                </div>
              </div>
            )}

            {/* ════════════ TAB BOOKING ════════════ */}
            {tab === "booking" && (
              <div className="space-y-5">
                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <BigStatCard label="Total Booking" value={String(filteredBookings.length)} sub="semua status"
                    icon={<CalendarDays size={20} />} iconBg="bg-blue-100" iconColor="text-blue-600" accent="border-l-4 border-l-blue-400" />
                  <BigStatCard label="Dikonfirmasi" value={String(byStatus["confirmed"] ?? 0)} sub="booking approved"
                    icon={<FileText size={20} />} iconBg="bg-emerald-100" iconColor="text-emerald-600" accent="border-l-4 border-l-emerald-400" />
                  <BigStatCard label="Menunggu Bayar" value={String(byStatus["pending"] ?? 0)} sub="perlu tindakan"
                    icon={<BarChart2 size={20} />} iconBg="bg-amber-100" iconColor="text-amber-600" accent="border-l-4 border-l-amber-400" />
                  <BigStatCard label="Dibatalkan" value={String(byStatus["cancelled"] ?? 0)} sub="booking batal"
                    icon={<FileText size={20} />} iconBg="bg-red-100" iconColor="text-red-500" accent="border-l-4 border-l-red-400" />
                </div>

                {/* Breakdown charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Status */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Statistik</p>
                    <h3 className="text-base font-bold text-slate-800 mb-5">Status Booking</h3>
                    <div className="space-y-4">
                      {Object.entries(byStatus).map(([status, count]) => {
                        const pct = totalByStatus > 0 ? Math.round((count / totalByStatus) * 100) : 0;
                        const color = BAR_COLOR[status] ?? "#94a3b8";
                        return (
                          <div key={status}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_PILL[status] ?? "bg-slate-100 text-slate-500"}`}>
                                {STATUS_LABEL[status] ?? status}
                              </span>
                              <span className="text-sm font-bold text-slate-700">
                                {count} <span className="text-slate-400 font-normal text-xs">({pct}%)</span>
                              </span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-2 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        );
                      })}
                      {Object.keys(byStatus).length === 0 && <EmptyState text="Tidak ada data" />}
                    </div>
                  </div>

                  {/* Per lapangan */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Lapangan</p>
                    <h3 className="text-base font-bold text-slate-800 mb-5">Booking per Lapangan</h3>
                    <div className="space-y-4">
                      {Object.entries(byCourt).map(([court, count], i) => {
                        const pct = totalByCourt > 0 ? Math.round((count / totalByCourt) * 100) : 0;
                        const colors = ["#3B82F6","#6366F1","#06B6D4","#10B981","#F59E0B"];
                        const c = colors[i % colors.length];
                        return (
                          <div key={court}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />
                                <span className="text-sm font-semibold text-slate-700">{court}</span>
                              </div>
                              <span className="text-sm font-bold text-slate-700">
                                {count} <span className="text-slate-400 font-normal text-xs">({pct}%)</span>
                              </span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-2 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: c }} />
                            </div>
                          </div>
                        );
                      })}
                      {Object.keys(byCourt).length === 0 && <EmptyState text="Tidak ada data" />}
                    </div>
                  </div>
                </div>

                {/* Tabel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Daftar</p>
                      <h3 className="text-base font-bold text-slate-800">Booking ({filteredBookings.length})</h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs">
                          <th className="text-left px-6 py-3 font-semibold">Kode</th>
                          <th className="text-left px-6 py-3 font-semibold">Pelanggan</th>
                          <th className="text-left px-6 py-3 font-semibold">Lapangan</th>
                          <th className="text-left px-6 py-3 font-semibold">Waktu</th>
                          <th className="text-left px-6 py-3 font-semibold">Status</th>
                          <th className="text-right px-6 py-3 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredBookings.slice(0, 25).map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-3.5 font-mono text-xs text-slate-500">{b.bookingCode}</td>
                            <td className="px-6 py-3.5 font-semibold text-slate-800">{b.user?.name ?? "—"}</td>
                            <td className="px-6 py-3.5 text-slate-500">{b.court?.name ?? "—"}</td>
                            <td className="px-6 py-3.5 text-slate-400 text-xs">
                              {format(new Date(b.startAt), "dd MMM, HH:mm", { locale: localeId })}
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_PILL[b.status] ?? "bg-slate-100 text-slate-500"}`}>
                                {STATUS_LABEL[b.status] ?? b.status}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right font-bold text-slate-800">
                              {b.payment?.totalAmount ? fmtRupiah(b.payment.totalAmount) : "—"}
                            </td>
                          </tr>
                        ))}
                        {filteredBookings.length === 0 && (
                          <tr><td colSpan={6} className="py-16"><EmptyState text="Tidak ada booking di periode ini" /></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════ TAB PEMBAYARAN ════════════ */}
            {tab === "pembayaran" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <BigStatCard label="Total Pendapatan" value={fmtShort(totalConfirmedRevenue)} sub="dari payment confirmed"
                    icon={<TrendingUp size={20} />} iconBg="bg-emerald-100" iconColor="text-emerald-600" accent="border-l-4 border-l-emerald-400" />
                  <BigStatCard label="Total Transaksi" value={String(payments.length)} sub="semua status"
                    icon={<CreditCard size={20} />} iconBg="bg-blue-100" iconColor="text-blue-600" accent="border-l-4 border-l-blue-400" />
                  <BigStatCard label="Menunggu Konfirmasi" value={String(paymentByStatus["uploaded"] ?? 0)} sub="bukti sudah diunggah"
                    icon={<BarChart2 size={20} />} iconBg="bg-amber-100" iconColor="text-amber-600" accent="border-l-4 border-l-amber-400" />
                </div>

                {/* Status chips */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Breakdown</p>
                  <h3 className="text-base font-bold text-slate-800 mb-5">Status Pembayaran</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(paymentByStatus).map(([status, count]) => (
                      <div key={status} className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 ${STATUS_PILL[status] ?? "bg-slate-50 border-slate-200 text-slate-500"}`}>
                        <span className="text-sm font-semibold">{STATUS_LABEL[status] ?? status}</span>
                        <span className="text-xl font-black">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Daftar</p>
                    <h3 className="text-base font-bold text-slate-800">Pembayaran ({payments.length})</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs">
                          <th className="text-left px-6 py-3 font-semibold">Kode Booking</th>
                          <th className="text-left px-6 py-3 font-semibold">Pelanggan</th>
                          <th className="text-left px-6 py-3 font-semibold">Lapangan</th>
                          <th className="text-left px-6 py-3 font-semibold">Status</th>
                          <th className="text-right px-6 py-3 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {payments.slice(0, 25).map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-3.5 font-mono text-xs text-slate-500">{p.booking?.bookingCode ?? "—"}</td>
                            <td className="px-6 py-3.5 font-semibold text-slate-800">{p.booking?.user?.name ?? "—"}</td>
                            <td className="px-6 py-3.5 text-slate-500">{p.booking?.court?.name ?? "—"}</td>
                            <td className="px-6 py-3.5">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_PILL[p.status] ?? "bg-slate-100 text-slate-500"}`}>
                                {STATUS_LABEL[p.status] ?? p.status}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right font-bold text-slate-800">{fmtRupiah(p.totalAmount)}</td>
                          </tr>
                        ))}
                        {payments.length === 0 && (
                          <tr><td colSpan={5} className="py-16"><EmptyState text="Tidak ada data pembayaran" /></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════ TAB MEMBERSHIP ════════════ */}
            {tab === "membership" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <BigStatCard label="Total Member" value={String(memberUsers.length)} sub="pengguna terdaftar"
                    icon={<Users size={20} />} iconBg="bg-violet-100" iconColor="text-violet-600" accent="border-l-4 border-l-violet-400" />
                  <BigStatCard label="Member Baru" value={String(newUsersInRange.length)} sub="dalam periode ini"
                    icon={<Users size={20} />} iconBg="bg-blue-100" iconColor="text-blue-600" accent="border-l-4 border-l-blue-400" />
                  <BigStatCard
                    label="Periode"
                    value={`${format(new Date(startDate), "dd MMM", { locale: localeId })} – ${format(new Date(endDate), "dd MMM", { locale: localeId })}`}
                    sub="rentang laporan"
                    icon={<CalendarDays size={20} />} iconBg="bg-emerald-100" iconColor="text-emerald-600" accent="border-l-4 border-l-emerald-400"
                  />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Daftar</p>
                    <h3 className="text-base font-bold text-slate-800">Member Baru ({newUsersInRange.length})</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs">
                          <th className="text-left px-6 py-3 font-semibold">Nama</th>
                          <th className="text-left px-6 py-3 font-semibold">Email</th>
                          <th className="text-left px-6 py-3 font-semibold">No. HP</th>
                          <th className="text-left px-6 py-3 font-semibold">Bergabung</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {newUsersInRange.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-slate-800">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
                            <td className="px-6 py-3.5 text-slate-500">{u.phone ?? "—"}</td>
                            <td className="px-6 py-3.5 text-slate-400 text-xs">
                              {u.createdAt
                                ? format(new Date(u.createdAt), "dd MMM yyyy", { locale: localeId })
                                : "—"}
                            </td>
                          </tr>
                        ))}
                        {newUsersInRange.length === 0 && (
                          <tr><td colSpan={4} className="py-16"><EmptyState text="Tidak ada member baru di periode ini" /></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function BigStatCard({
  label, value, sub, icon, iconBg, iconColor, accent = "",
}: {
  label: string; value: string; sub: string;
  icon: React.ReactNode; iconBg: string; iconColor: string; accent?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${accent}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">{label}</p>
        <p className="text-xl font-extrabold text-slate-900 mt-0.5 leading-tight">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-300 gap-2">
      <FileText size={36} />
      <p className="text-sm font-semibold text-slate-400">{text}</p>
    </div>
  );
}