import { useEffect, useState } from "react";
import {
  Eye, X, CalendarDays, Check, ImageIcon, User, Mail, Phone,
  Building2, QrCode, Wallet, CreditCard, Clock, Calendar,
  ChevronLeft, ChevronRight, Search, Filter, Pencil, Printer,
  CheckCircle2, XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore, type Booking } from "../../../store/useBookingStore";
import { usePaymentStore } from "../../../store/usePaymentStore";
import BookingCreate from "./BokingCreate";
import EditBookingModal from "./Editbookingmodal";
import CetakInvoice from "./Cetakinvoice";

// ─── Helpers ───────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const formatDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

// ─── Badge Status Booking ──────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: Booking["status"] }) => {
  const map = {
    pending:   { cls: "bg-amber-50 text-amber-600 border-amber-200",       dot: "bg-amber-400",   label: "Menunggu Bayar" },
    confirmed: { cls: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400", label: "Dikonfirmasi"   },
    cancelled: { cls: "bg-rose-50 text-rose-500 border-rose-200",          dot: "bg-rose-400",    label: "Dibatalkan"     },
    completed: { cls: "bg-blue-50 text-blue-600 border-blue-200",          dot: "bg-blue-400",    label: "Selesai"        },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ─── Badge Status Payment ──────────────────────────────────────────────────

const PaymentBadge = ({ status }: { status?: string }) => {
  if (!status) return <span className="text-xs text-slate-300">—</span>;
  const map: Record<string, { cls: string; label: string }> = {
    pending:   { cls: "bg-slate-100 text-slate-500 border-slate-200",      label: "Belum Bayar" },
    uploaded:  { cls: "bg-amber-50 text-amber-600 border-amber-200",       label: "Cek Bukti"   },
    confirmed: { cls: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Lunas"       },
    rejected:  { cls: "bg-rose-50 text-rose-500 border-rose-200",          label: "Ditolak"     },
    expired:   { cls: "bg-rose-50 text-rose-400 border-rose-100",          label: "Kadaluarsa"  },
    cash:      { cls: "bg-blue-50 text-blue-600 border-blue-200",          label: "Tunai"       },
  };
  const s = map[status] ?? { cls: "bg-slate-100 text-slate-500 border-slate-200", label: status };
  return (
    <span className={`inline-flex px-2 py-0.5 text-[11px] font-bold rounded-lg border ${s.cls}`}>
      {s.label}
    </span>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  const colors: Record<string, { bg: string; text: string; icon: string }> = {
    blue:  { bg: "bg-blue-50",    text: "text-[#0050FF]",   icon: "bg-[#0050FF]"   },
    green: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-500" },
    amber: { bg: "bg-amber-50",   text: "text-amber-600",   icon: "bg-amber-500"   },
    rose:  { bg: "bg-rose-50",    text: "text-rose-600",    icon: "bg-rose-500"    },
  };
  const c = colors[color] ?? colors.blue;
  return (
    <div className={`${c.bg} rounded-2xl p-4 flex items-center gap-3`}>
      <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
        <CalendarDays size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className={`text-2xl font-black ${c.text} leading-tight`}>{value}</p>
        <p className="text-[10px] text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

// ─── Sub komponen Detail Panel ─────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[#0050FF]">{icon}</span>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      </div>
      <div className="bg-slate-50/70 rounded-xl px-3 py-2 space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-400 flex items-center gap-1">{icon}{label}</span>
      <span className="font-semibold text-slate-700 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

// ─── Booking Row (baris tabel) ─────────────────────────────────────────────

function BookingRow({ b, i, selected, onSelect, onApprove, onReject, onCancel, processing }: {
  b: any; i: number; selected: boolean; processing: boolean;
  onSelect: () => void; onApprove: () => void; onReject: () => void; onCancel: () => void;
}) {
  const needsReview = b.payment?.status === "uploaded";
  return (
    <tr onClick={onSelect}
      className={`border-b border-slate-50 transition-colors cursor-pointer ${selected ? "bg-blue-50/60" : "hover:bg-slate-50/70"}`}>
      <td className="py-3.5 px-4 text-center text-slate-400 text-xs font-bold">{i}</td>
      <td className="py-3.5 px-4">
        <span className="text-xs font-bold text-[#0050FF]">{b.bookingCode}</span>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          {/* Avatar inisial user */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0050FF] to-indigo-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
            {b.user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">{b.user?.name ?? "—"}</p>
            <p className="text-[10px] text-slate-400">{b.user?.email ?? ""}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <p className="text-xs font-semibold text-slate-700">{b.court?.name ?? "—"}</p>
        <p className="text-[10px] text-slate-400">{b.court?.type ?? "Badminton"}</p>
      </td>
      <td className="py-3.5 px-4 text-xs text-slate-600">{formatDate(b.startAt)}</td>
      <td className="py-3.5 px-4">
        <p className="text-xs font-semibold text-slate-700">{formatTime(b.startAt)} – {formatTime(b.endAt)}</p>
        <p className="text-[10px] text-slate-400">{b.duration ?? "—"} Jam</p>
      </td>
      <td className="py-3.5 px-4"><StatusBadge status={b.status} /></td>
      <td className="py-3.5 px-4 text-xs font-bold text-slate-800">
        {formatRupiah(b.payment?.totalAmount ?? b.courtPrice ?? 0)}
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Tombol detail */}
          <button onClick={onSelect} title="Lihat Detail"
            className={`p-1.5 rounded-lg border transition ${selected ? "bg-[#0050FF] text-white border-[#0050FF]" : "text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-100"}`}>
            <Eye size={13} />
          </button>
          {/* Tombol approve & reject — muncul kalau payment uploaded */}
          {needsReview && (
            <>
              <button onClick={onApprove} disabled={processing} title="Approve"
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-100 disabled:opacity-40 transition">
                <Check size={13} />
              </button>
              <button onClick={onReject} disabled={processing} title="Tolak"
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 disabled:opacity-40 transition">
                <X size={13} />
              </button>
            </>
          )}
          {/* Tombol cancel — muncul kalau pending & belum upload */}
          {b.status === "pending" && !needsReview && (
            <button onClick={onCancel} title="Batalkan"
              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition">
              <X size={13} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Detail Panel (muncul di kanan tabel) ─────────────────────────────────

function DetailPanel({ detail, onClose, onApprove, onReject, onEdit, onCetak }: {
  detail: any;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onEdit: () => void;
  onCetak: () => void;
}) {
  const needsReview = detail.payment?.status === "uploaded";
  const subtotal    = detail.courtPrice ?? 0;
  const biayaAdmin  = detail.payment?.adminFee ?? 2500;
  const discount    = detail.payment?.discount ?? 0;
  const total       = detail.payment?.totalAmount ?? subtotal + biayaAdmin - discount;

  const TYPE_ICON: Record<string, React.ReactNode> = {
    qris:     <QrCode size={13} />,
    transfer: <Building2 size={13} />,
    cash:     <Wallet size={13} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white border border-slate-200/80 rounded-[1.8rem] shadow-[0_8px_30px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full"
    >
      {/* ── HEADER DETAIL PANEL ── */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-600 flex items-center justify-center shadow-md shadow-blue-400/25">
            <Calendar size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Booking Code</p>
            <p className="text-sm font-black text-[#0050FF] tracking-wide">{detail.bookingCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={detail.status} />
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── ISI DETAIL PANEL ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Informasi Booking */}
        <Section icon={<Calendar size={13} />} title="Informasi Booking">
          <Row label="Tanggal" value={formatDateLong(detail.startAt)} />
          <Row label="Waktu" value={`${formatTime(detail.startAt)} – ${formatTime(detail.endAt)} WIB`} />
          <Row label="Durasi" value={`${detail.duration ?? "—"} Jam`} />
        </Section>

        {/* Informasi Pelanggan */}
        <Section icon={<User size={13} />} title="Informasi Pelanggan">
          <Row label="Nama"  value={detail.user?.name  ?? "—"} icon={<User size={11} />} />
          <Row label="Email" value={detail.user?.email ?? "—"} icon={<Mail size={11} />} />
          <Row label="No. HP" value={detail.user?.phone ?? "—"} icon={<Phone size={11} />} />
        </Section>

        {/* Informasi Lapangan */}
        <Section icon={<Building2 size={13} />} title="Informasi Lapangan">
          <Row label="Nama Lapangan" value={detail.court?.name ?? "—"} />
          <Row label="Jenis"         value={detail.court?.type ?? "Badminton"} />
          <Row label="Harga / Jam"   value={formatRupiah(detail.court?.price ?? 0)} />
        </Section>

        {/* Informasi Pembayaran */}
        <Section icon={<CreditCard size={13} />} title="Informasi Pembayaran">
          <Row label="Metode" value={
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">
                {TYPE_ICON[detail.payment?.channel?.type ?? ""] ?? <CreditCard size={11} />}
              </span>
              {detail.payment?.channel?.name ?? "—"}
            </div>
          } />
          <Row label="Status" value={<PaymentBadge status={detail.payment?.status} />} />

          {/* Rincian harga */}
          <div className="flex justify-between items-center text-xs pt-1 mt-1 border-t border-slate-50">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold text-slate-700">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Biaya Admin</span>
            <span className="font-semibold text-slate-700">{formatRupiah(biayaAdmin)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Diskon</span>
              <span className="font-semibold text-emerald-600">-{formatRupiah(discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-100 mt-1">
            <span className="font-bold text-slate-800">Total Pembayaran</span>
            <span className="font-black text-[#0050FF] text-sm">{formatRupiah(total)}</span>
          </div>
          {detail.payment?.paidAt && (
            <Row label="Dibayar Pada" value={formatDate(detail.payment.paidAt)} />
          )}
          {detail.payment?.note && (
            <Row label="Catatan Admin" value={
              <span className="text-rose-500">{detail.payment.note}</span>
            } />
          )}
        </Section>

        {/* Bukti Pembayaran */}
        {detail.payment?.proofs?.length > 0 && (
          <Section icon={<ImageIcon size={13} />} title="Bukti Pembayaran">
            <div className="grid grid-cols-2 gap-2 mt-1">
              {detail.payment.proofs.map((p: any) => {
                const src = p.image.startsWith("http") ? p.image : `${BASE_URL}${p.image}`;
                return (
                  <a key={p.id} href={src} target="_blank" rel="noopener noreferrer">
                    <img src={src} alt="Bukti"
                      className="w-full h-24 object-cover rounded-xl border border-slate-200 hover:opacity-90 transition" />
                  </a>
                );
              })}
            </div>
          </Section>
        )}

        {/* Catatan Booking */}
        {detail.notes && (
          <Section icon={<Filter size={13} />} title="Catatan">
            <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 leading-relaxed">{detail.notes}</p>
          </Section>
        )}
      </div>

      {/* ── FOOTER AKSI DETAIL PANEL ── */}
      <div className="px-5 py-4 border-t border-slate-100 space-y-2">

        {/* Tombol approve/reject — muncul kalau payment uploaded */}
        {needsReview && (
          <div className="flex gap-2">
            <button onClick={() => onReject(detail.id)}
              className="flex-1 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition flex items-center justify-center gap-1.5">
              <XCircle size={13} /> Tolak
            </button>
            <button onClick={() => onApprove(detail.id)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold hover:shadow-md hover:shadow-emerald-400/25 transition flex items-center justify-center gap-1.5">
              <CheckCircle2 size={13} /> Konfirmasi Bayar
            </button>
          </div>
        )}

        {/* Tombol edit, cetak invoice, tutup */}
        <div className="flex gap-2">
          <button onClick={onEdit}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1.5">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={onCetak}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1.5">
            <Printer size={12} /> Invoice
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white text-xs font-bold hover:shadow-md hover:shadow-blue-400/25 transition">
            Tutup
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function BookingIndex() {
  const { bookings, loading, fetchBookings, cancelBooking } = useBookingStore();
  const { confirmPayment, rejectPayment } = usePaymentStore();

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [courtFilter,  setCourtFilter]  = useState("Semua");
  const [detail,       setDetail]       = useState<any | null>(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [showEdit,     setShowEdit]     = useState(false);
  const [showCetak,    setShowCetak]    = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [page,         setPage]         = useState(1);
  const PER_PAGE = 10;

  useEffect(() => { fetchBookings(); }, []);

  // ── Daftar court unik untuk filter dropdown ──
  const courts = [...new Set(bookings.map((b) => b.court?.name).filter(Boolean))];

  // ── Filter data ──
  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.bookingCode?.toLowerCase().includes(q) || b.user?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "Semua" || b.status === statusFilter.toLowerCase();
    const matchCourt  = courtFilter  === "Semua" || b.court?.name === courtFilter;
    return matchSearch && matchStatus && matchCourt;
  });

  // ── Paginasi ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Data stats ──
  const total     = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending   = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  // ── Handler cancel ──
  const handleCancel = async (id: number) => {
    if (!confirm("Batalkan booking ini?")) return;
    try { await cancelBooking(id); setDetail(null); }
    catch (err: any) { alert(err.message); }
  };

  // ── Handler approve payment ──
  const handleApprove = async (id: number) => {
    if (!confirm("Konfirmasi pembayaran booking ini?")) return;
    setProcessingId(id);
    try {
      await confirmPayment(id);
      await fetchBookings();
      setDetail(null);
    } catch (err: any) { alert(err.message); }
    finally { setProcessingId(null); }
  };

  // ── Handler reject payment ──
  const handleReject = async (id: number) => {
    const note = prompt("Alasan penolakan (opsional):") || "";
    setProcessingId(id);
    try {
      await rejectPayment(id, note);
      await fetchBookings();
      setDetail(null);
    } catch (err: any) { alert(err.message); }
    finally { setProcessingId(null); }
  };

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-3 md:p-5 rounded-[2.5rem]">
      <div className="w-full bg-white border border-slate-200/90 p-5 md:p-7 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Booking</h1>
            <p className="text-sm font-medium text-slate-400 mt-0.5">Kelola semua data booking dengan mudah</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="self-start sm:self-auto rounded-xl bg-gradient-to-r from-[#0050FF] to-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:shadow-lg hover:shadow-blue-500/25 transition flex items-center gap-2">
            <CalendarDays size={14} /> + Tambah Booking
          </button>
        </div>

        {/* ── STATS CARD ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Booking" value={total}
            sub="Semua waktu" color="blue" />
          <StatCard label="Confirmed" value={confirmed}
            sub={`${total ? ((confirmed / total) * 100).toFixed(1) : 0}% dari total`} color="green" />
          <StatCard label="Pending" value={pending}
            sub={`${total ? ((pending / total) * 100).toFixed(1) : 0}% dari total`} color="amber" />
          <StatCard label="Cancelled" value={cancelled}
            sub={`${total ? ((cancelled / total) * 100).toFixed(1) : 0}% dari total`} color="rose" />
        </div>

        {/* ── FILTER BAR ── */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari booking ID atau nama user..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-[#0050FF] focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-600 outline-none focus:border-[#0050FF] cursor-pointer">
            <option value="Semua">Semua Status</option>
            <option value="pending">Menunggu Bayar</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="cancelled">Dibatalkan</option>
            <option value="completed">Selesai</option>
          </select>
          <select value={courtFilter} onChange={(e) => { setCourtFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-600 outline-none focus:border-[#0050FF] cursor-pointer">
            <option value="Semua">Semua Lapangan</option>
            {courts.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* ── TABLE + DETAIL PANEL SIDE BY SIDE ── */}
        <div className={`flex gap-4 ${detail ? "flex-col xl:flex-row" : ""}`}>

          {/* TABLE */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-20 text-slate-400 font-bold text-sm">Memuat data...</div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-bold text-sm border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                Tidak ada data booking.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4 text-center">No</th>
                      <th className="py-3.5 px-4">ID Booking</th>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Lapangan</th>
                      <th className="py-3.5 px-4">Tanggal</th>
                      <th className="py-3.5 px-4">Waktu</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((b: any, i) => (
                      <BookingRow key={b.id} b={b}
                        i={(page - 1) * PER_PAGE + i + 1}
                        selected={detail?.id === b.id}
                        onSelect={() => setDetail(detail?.id === b.id ? null : b)}
                        onApprove={() => handleApprove(b.id)}
                        onReject={() => handleReject(b.id)}
                        onCancel={() => handleCancel(b.id)}
                        processing={processingId === b.id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── PAGINATION ── */}
            {filtered.length > PER_PAGE && (
              <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                <span>
                  Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} data
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition">
                    <ChevronLeft size={13} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pg) => (
                    <button key={pg} onClick={() => setPage(pg)}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold transition ${page === pg ? "bg-[#0050FF] text-white border-[#0050FF]" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`}>
                      {pg}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="px-1">...</span>}
                  {totalPages > 5 && (
                    <button onClick={() => setPage(totalPages)}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold transition ${page === totalPages ? "bg-[#0050FF] text-white border-[#0050FF]" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`}>
                      {totalPages}
                    </button>
                  )}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition">
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── DETAIL PANEL — muncul di kanan kalau ada yang diklik ── */}
          <AnimatePresence>
            {detail && (
              <div className="xl:w-[360px] flex-shrink-0 xl:max-h-[720px]">
                <DetailPanel
                  detail={detail}
                  onClose={() => setDetail(null)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onEdit={() => setShowEdit(true)}
                  onCetak={() => setShowCetak(true)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── MODAL BUAT BOOKING ── */}
      <AnimatePresence>
        {showCreate && (
          <BookingCreate onClose={() => { setShowCreate(false); fetchBookings(); }} />
        )}
      </AnimatePresence>

      {/* ── MODAL EDIT BOOKING ── */}
      <AnimatePresence>
        {showEdit && detail && (
          <EditBookingModal
            booking={detail}
            onClose={() => setShowEdit(false)}
            onSaved={() => {
              setShowEdit(false);
              fetchBookings();
              setDetail(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── MODAL CETAK INVOICE ── */}
      <AnimatePresence>
        {showCetak && detail && (
          <CetakInvoice
            booking={detail}
            onClose={() => setShowCetak(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}