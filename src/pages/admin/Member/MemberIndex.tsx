import { useEffect, useState } from "react";
import {
  Eye, X, Check, ImageIcon, User, Mail, Phone,
  Crown, Calendar, Search, ChevronLeft, ChevronRight,
  Download, Users, Clock, ShieldCheck, CheckCircle2,
  XCircle, AlertCircle, Star, Ban,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useMembershipRegistrationStore,
  type MembershipRegistration,
} from "../../../store/useMembershipRegistrationStore";
import { useMembershipStore } from "../../../store/useMembershipStore";
import { useUserMembershipStore } from "../../../store/useUserMembershipStore";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "—";
const formatDateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";
const formatTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "—";
const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

// ── Status config ────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { cls: string; dot: string; label: string }> = {
  pending:      { cls: "bg-amber-50 text-amber-600 border-amber-200",       dot: "bg-amber-400",   label: "Menunggu Pembayaran"   },
  verification: { cls: "bg-violet-50 text-violet-600 border-violet-200",    dot: "bg-violet-400",  label: "Verifikasi Pembayaran" },
  active:       { cls: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400", label: "Member Aktif"           },
  rejected:     { cls: "bg-rose-50 text-rose-500 border-rose-200",          dot: "bg-rose-400",    label: "Ditolak"               },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ── Metode Pembayaran ────────────────────────────────────────────────────

const METHOD_MAP: Record<string, { icon: string; label: string; color: string }> = {
  transfer: { icon: "🏦", label: "Transfer Bank", color: "text-blue-600"    },
  qris:     { icon: "⊞",  label: "QRIS",          color: "text-violet-600"  },
  ewallet:  { icon: "💳", label: "E-Wallet",       color: "text-emerald-600" },
  cash:     { icon: "💵", label: "Tunai",           color: "text-amber-600"   },
};

function MethodBadge({ method }: { method?: string | null }) {
  if (!method) return <span className="text-xs text-slate-300">—</span>;
  const m = METHOD_MAP[method] ?? { icon: "💳", label: method, color: "text-slate-500" };
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${m.color}`}>
      <span>{m.icon}</span>{m.label}
    </span>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, bg, text, iconBg, Icon }: {
  label: string; value: number; sub: string;
  bg: string; text: string; iconBg: string; Icon: any;
}) {
  return (
    <div className={`${bg} rounded-2xl p-4 flex items-center gap-3`}>
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <Icon size={19} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium leading-tight">{label}</p>
        <p className={`text-2xl font-black ${text} leading-tight`}>{value}</p>
        <p className="text-[10px] text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

// ── Section & Row helper ─────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[#0050FF]">{icon}</span>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
      </div>
      <div className="bg-slate-50/60 rounded-xl px-3 py-2.5 space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start text-xs gap-2">
      <span className="text-slate-400 flex items-center gap-1 flex-shrink-0">{icon}{label}</span>
      <span className="font-semibold text-slate-700 text-right leading-tight max-w-[58%]">{value}</span>
    </div>
  );
}

// ── Detail Panel ─────────────────────────────────────────────────────────

function DetailPanel({ detail, onClose, onApprove, onVerify, onReject, processing }: {
  detail: MembershipRegistration;
  onClose: () => void;
  onApprove: (id: number) => void;
  onVerify: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  processing: boolean;
}) {
  const [reason, setReason] = useState(detail.rejectReason || "");

  const proofUrl = detail.proofImageUrl
    ? detail.proofImageUrl.startsWith("http")
      ? detail.proofImageUrl
      : `${BASE_URL}${detail.proofImageUrl}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="bg-white border border-slate-200/80 rounded-[1.8rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col"
      style={{ maxHeight: 720 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-400/25">
            <Crown size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Detail Pendaftaran</p>
            <p className="text-sm font-black text-[#001845] leading-tight">{detail.user?.name ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={detail.status} />
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Data Member */}
        <Section icon={<User size={13} />} title="Data Member">
          <Row label="Nama Lengkap" value={detail.user?.name ?? "—"} icon={<User size={11} />} />
          <Row label="No. WhatsApp" value={detail.user?.phone ?? "—"} icon={<Phone size={11} />} />
          <Row label="Email" value={detail.user?.email ?? "—"} icon={<Mail size={11} />} />
          <Row label="Tanggal Daftar" value={
            detail.createdAt
              ? `${formatDateLong(detail.createdAt)}, ${formatTime(detail.createdAt)} WIB`
              : "—"
          } icon={<Calendar size={11} />} />
        </Section>

        {/* Detail Paket */}
        <Section icon={<Crown size={13} />} title="Detail Paket">
          <Row label="Nama Paket"  value={detail.membership?.name ?? "—"} />
          <Row label="Durasi"      value={`${detail.membership?.duration ?? 30} Hari`} />
          <Row label="Total Bayar" value={
            <span className="font-black text-[#0050FF]">
              {formatRupiah(detail.membership?.price ?? 0)}
            </span>
          } />
          <Row label="Metode" value={<MethodBadge method={detail.paymentMethod} />} />
        </Section>

        {/* Bukti Pembayaran */}
        {proofUrl ? (
          <Section icon={<ImageIcon size={13} />} title="Bukti Pembayaran">
            <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="relative block group mt-1">
              <img src={proofUrl} alt="Bukti" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded-xl transition-all duration-200">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 shadow">
                  <Download size={12} /> Lihat Penuh
                </div>
              </div>
            </a>
          </Section>
        ) : (
          <Section icon={<ImageIcon size={13} />} title="Bukti Pembayaran">
            <div className="flex flex-col items-center justify-center py-5 text-slate-300">
              <ImageIcon size={22} />
              <p className="text-xs mt-1">Belum ada bukti diunggah</p>
            </div>
          </Section>
        )}

        {/* Catatan / Alasan Tolak */}
        {(detail.status === "pending" || detail.status === "verification") && (
          <Section icon={<AlertCircle size={13} />} title="Alasan Penolakan (jika ditolak)">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Tulis alasan penolakan..."
              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0050FF] transition placeholder:text-slate-300"
            />
          </Section>
        )}

        {/* Info kalau sudah approved/rejected */}
        {detail.status === "active" && detail.approvedAt && (
          <Section icon={<CheckCircle2 size={13} />} title="Info Aktivasi">
            <Row label="Diaktifkan Pada" value={`${formatDate(detail.approvedAt)}, ${formatTime(detail.approvedAt)} WIB`} />
          </Section>
        )}
        {detail.status === "rejected" && (
          <Section icon={<XCircle size={13} />} title="Info Penolakan">
            {detail.rejectedAt && (
              <Row label="Ditolak Pada" value={`${formatDate(detail.rejectedAt)}, ${formatTime(detail.rejectedAt)} WIB`} />
            )}
            {detail.rejectReason && (
              <Row label="Alasan" value={<span className="text-rose-500">{detail.rejectReason}</span>} />
            )}
          </Section>
        )}
      </div>

      {/* Footer Aksi */}
      <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0 space-y-2">
        {detail.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject(detail.id, reason)}
              disabled={processing}
              className="flex-1 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <XCircle size={13} /> Tolak
            </button>
            <button
              onClick={() => onVerify(detail.id)}
              disabled={processing}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-bold hover:shadow-md hover:shadow-violet-400/25 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <ShieldCheck size={13} /> Verifikasi
            </button>
          </div>
        )}

        {detail.status === "verification" && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject(detail.id, reason)}
              disabled={processing}
              className="flex-1 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <XCircle size={13} /> Tolak
            </button>
            <button
              onClick={() => onApprove(detail.id)}
              disabled={processing}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold hover:shadow-md hover:shadow-emerald-400/25 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <CheckCircle2 size={13} /> Aktifkan Member
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white text-xs font-bold hover:shadow-md hover:shadow-blue-400/25 transition"
        >
          Tutup
        </button>
      </div>
    </motion.div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

const TABS = ["Pendaftaran", "Member Aktif"] as const;
type Tab = (typeof TABS)[number];

export default function MembershipIndex() {
  const {
    registrations, loading: loadingReg,
    fetchRegistrations, approveRegistration, rejectRegistration, moveToVerification,
  } = useMembershipRegistrationStore();

  const { memberships, fetchMemberships } = useMembershipStore();

  const {
    userMemberships, loading: loadingUM,
    fetchUserMemberships, deleteUserMembership,
  } = useUserMembershipStore();

  const [activeTab,    setActiveTab]    = useState<Tab>("Pendaftaran");
  const [search,       setSearch]       = useState("");
  const [paketFilter,  setPaketFilter]  = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [detail,       setDetail]       = useState<MembershipRegistration | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [page,         setPage]         = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    fetchRegistrations();
    fetchMemberships();
    fetchUserMemberships();
  }, []);

  // ── Stats ──
  const total  = registrations.length;
  const pend   = registrations.filter((r) => r.status === "pending").length;
  const verif  = registrations.filter((r) => r.status === "verification").length;
  const aktif  = userMemberships.filter((m) => m.status === "active").length;

  // ── Filter Registrations ──
  const filteredReg = registrations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || r.user?.name?.toLowerCase().includes(q)
      || r.user?.phone?.includes(q)
      || r.user?.email?.toLowerCase().includes(q);
    const matchPaket  = paketFilter  === "Semua" || r.membership?.name === paketFilter;
    const matchStatus = statusFilter === "Semua" || r.status === statusFilter;
    return matchSearch && matchPaket && matchStatus;
  });

  // ── Filter Member Aktif ──
  const filteredUM = userMemberships.filter((m) => {
    const q = search.toLowerCase();
    return !q
      || m.user?.name?.toLowerCase().includes(q)
      || m.user?.email?.toLowerCase().includes(q);
  });

  const dataToPage = activeTab === "Pendaftaran" ? filteredReg : filteredUM;
  const totalPages = Math.max(1, Math.ceil(dataToPage.length / PER_PAGE));
  const paginated  = dataToPage.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Handlers ──
  const handleApprove = async (id: number) => {
    if (!confirm("Aktifkan member ini?")) return;
    setProcessingId(id);
    try { await approveRegistration(id); setDetail(null); }
    catch (e: any) { alert(e.message); }
    finally { setProcessingId(null); }
  };

  const handleVerify = async (id: number) => {
    setProcessingId(id);
    try { await moveToVerification(id); setDetail(null); }
    catch (e: any) { alert(e.message); }
    finally { setProcessingId(null); }
  };

  const handleReject = async (id: number, reason: string) => {
    if (!reason.trim()) { alert("Alasan penolakan wajib diisi."); return; }
    setProcessingId(id);
    try { await rejectRegistration(id, reason); setDetail(null); }
    catch (e: any) { alert(e.message); }
    finally { setProcessingId(null); }
  };

  const handleDeleteUM = async (id: number) => {
    if (!confirm("Hapus membership ini?")) return;
    try { await deleteUserMembership(id); }
    catch (e: any) { alert(e.message); }
  };

  // ── Export CSV ──
  const handleExport = () => {
    const rows = [
      ["Nama", "WA", "Email", "Paket", "Metode", "Total", "Status", "Tanggal Daftar"],
      ...filteredReg.map((r) => [
        r.user?.name ?? "", r.user?.phone ?? "", r.user?.email ?? "",
        r.membership?.name ?? "", r.paymentMethod ?? "",
        r.membership?.price ?? 0, r.status, formatDate(r.createdAt),
      ]),
    ];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "membership-registrations.csv"; a.click();
  };

  const loading = activeTab === "Pendaftaran" ? loadingReg : loadingUM;

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-3 md:p-5 rounded-[2.5rem]">
      <div className="w-full bg-white border border-slate-200/90 p-5 md:p-7 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Membership</h1>
            <p className="text-sm font-medium text-slate-400 mt-0.5">Kelola pendaftaran dan status member</p>
          </div>
          <button
            onClick={handleExport}
            className="self-start sm:self-auto rounded-xl bg-gradient-to-r from-[#0050FF] to-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:shadow-lg hover:shadow-blue-500/25 transition flex items-center gap-2"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Pendaftaran"     value={total} sub="Semua waktu"          bg="bg-blue-50"    text="text-[#0050FF]"   iconBg="bg-[#0050FF]"    Icon={Users}        />
          <StatCard label="Menunggu Pembayaran"   value={pend}  sub="Belum dibayar"         bg="bg-amber-50"   text="text-amber-600"   iconBg="bg-amber-500"    Icon={Clock}        />
          <StatCard label="Verifikasi Pembayaran" value={verif} sub="Menunggu konfirmasi"   bg="bg-violet-50"  text="text-violet-600"  iconBg="bg-violet-600"   Icon={ShieldCheck}  />
          <StatCard label="Member Aktif"          value={aktif} sub="Sedang aktif"          bg="bg-emerald-50" text="text-emerald-600" iconBg="bg-emerald-500"  Icon={CheckCircle2} />
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch(""); setPage(1); setDetail(null); }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-[#0050FF] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
              {tab === "Pendaftaran" && verif > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-violet-100 text-violet-600 rounded-full font-black">{verif}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── FILTER BAR ── */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "Pendaftaran" ? "Cari nama, WA, atau email..." : "Cari nama atau email..."}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-[#0050FF] focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          {activeTab === "Pendaftaran" && (
            <>
              <select
                value={paketFilter}
                onChange={(e) => { setPaketFilter(e.target.value); setPage(1); }}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-600 outline-none focus:border-[#0050FF] cursor-pointer"
              >
                <option value="Semua">Semua Paket</option>
                {memberships.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-600 outline-none focus:border-[#0050FF] cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="pending">Menunggu Pembayaran</option>
                <option value="verification">Verifikasi Pembayaran</option>
                <option value="active">Member Aktif</option>
                <option value="rejected">Ditolak</option>
              </select>
            </>
          )}
        </div>

        {/* ── TABLE + DETAIL PANEL ── */}
        <div className={`flex gap-4 ${detail ? "flex-col xl:flex-row" : ""}`}>

          {/* TABLE */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-20 text-slate-400 font-bold text-sm">Memuat data...</div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-bold text-sm border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                Tidak ada data.
              </div>
            ) : activeTab === "Pendaftaran" ? (

              /* ── TABEL PENDAFTARAN ── */
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse min-w-[820px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4 text-center">No</th>
                      <th className="py-3.5 px-4">Nama Member</th>
                      <th className="py-3.5 px-4">Paket</th>
                      <th className="py-3.5 px-4">No. WhatsApp</th>
                      <th className="py-3.5 px-4">Tanggal Daftar</th>
                      <th className="py-3.5 px-4">Metode</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(paginated as MembershipRegistration[]).map((r, i) => {
                      const isSelected   = detail?.id === r.id;
                      const isProcessing = processingId === r.id;
                      return (
                        <tr
                          key={r.id}
                          onClick={() => setDetail(isSelected ? null : r)}
                          className={`border-b border-slate-50 transition-colors cursor-pointer ${
                            isSelected ? "bg-blue-50/60" : "hover:bg-slate-50/60"
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center text-slate-400 text-xs font-bold">
                            {(page - 1) * PER_PAGE + i + 1}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                                {r.user?.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800 leading-tight">{r.user?.name ?? "—"}</p>
                                <p className="text-[10px] text-slate-400">{r.user?.email ?? ""}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <Crown size={12} className="text-amber-500 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-slate-700 leading-tight">{r.membership?.name ?? "—"}</p>
                                <p className="text-[10px] text-slate-400">{r.membership?.duration ?? 30} Hari</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-xs text-slate-600">{r.user?.phone ?? "—"}</td>

                          <td className="py-3.5 px-4">
                            <p className="text-xs font-semibold text-slate-700">{formatDate(r.createdAt)}</p>
                            <p className="text-[10px] text-slate-400">{formatTime(r.createdAt)} WIB</p>
                          </td>

                          <td className="py-3.5 px-4">
                            <MethodBadge method={r.paymentMethod} />
                          </td>

                          <td className="py-3.5 px-4 text-xs font-bold text-slate-800">
                            {formatRupiah(r.membership?.price ?? 0)}
                          </td>

                          <td className="py-3.5 px-4">
                            <StatusBadge status={r.status} />
                          </td>

                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setDetail(isSelected ? null : r)}
                                title="Lihat Detail"
                                className={`p-1.5 rounded-lg border transition text-xs font-bold flex items-center gap-1 ${
                                  isSelected
                                    ? "bg-[#0050FF] text-white border-[#0050FF]"
                                    : "text-[#0050FF] hover:bg-blue-50 border-transparent hover:border-blue-100"
                                }`}
                              >
                                <Eye size={13} /> Detail
                              </button>

                              {r.status === "pending" && (
                                <button
                                  onClick={() => handleVerify(r.id)}
                                  disabled={isProcessing}
                                  title="Verifikasi"
                                  className="p-1.5 text-violet-600 hover:bg-violet-50 rounded-lg border border-transparent hover:border-violet-100 disabled:opacity-40 transition"
                                >
                                  <ShieldCheck size={13} />
                                </button>
                              )}

                              {r.status === "verification" && (
                                <button
                                  onClick={() => handleApprove(r.id)}
                                  disabled={isProcessing}
                                  title="Aktifkan"
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-100 disabled:opacity-40 transition"
                                >
                                  <Check size={13} />
                                </button>
                              )}

                              {(r.status === "pending" || r.status === "verification") && (
                                <button
                                  onClick={() => handleReject(r.id, prompt("Alasan penolakan:") || "")}
                                  disabled={isProcessing}
                                  title="Tolak"
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 disabled:opacity-40 transition"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            ) : (

              /* ── TABEL MEMBER AKTIF ── */
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4 text-center">No</th>
                      <th className="py-3.5 px-4">Nama Member</th>
                      <th className="py-3.5 px-4">Paket</th>
                      <th className="py-3.5 px-4">Mulai</th>
                      <th className="py-3.5 px-4">Selesai</th>
                      <th className="py-3.5 px-4">Sisa Hari</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((m: any, i) => {
                      const sisa = Math.max(0, Math.ceil(
                        (new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                      ));
                      return (
                        <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 text-center text-slate-400 text-xs font-bold">
                            {(page - 1) * PER_PAGE + i + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                                {m.user?.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800 leading-tight">{m.user?.name ?? "—"}</p>
                                <p className="text-[10px] text-slate-400">{m.user?.email ?? ""}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <Star size={11} className="text-amber-500 flex-shrink-0" />
                              <p className="text-xs font-bold text-slate-700">{m.membership?.name ?? "—"}</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{formatDate(m.startDate)}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{formatDate(m.endDate)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`text-xs font-black ${sisa <= 3 ? "text-rose-500" : sisa <= 7 ? "text-amber-500" : "text-emerald-600"}`}>
                              {sisa} hari
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border ${
                              m.status === "active"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${m.status === "active" ? "bg-emerald-400" : "bg-slate-400"}`} />
                              {m.status === "active" ? "Aktif" : "Expired"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleDeleteUM(m.id)}
                              title="Hapus"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition"
                            >
                              <Ban size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── PAGINATION ── */}
            {dataToPage.length > PER_PAGE && (
              <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                <span>
                  Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, dataToPage.length)} dari {dataToPage.length} data
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition">
                    <ChevronLeft size={13} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pg) => (
                    <button key={pg} onClick={() => setPage(pg)}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold transition ${
                        page === pg ? "bg-[#0050FF] text-white border-[#0050FF]" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}>
                      {pg}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="px-1 text-slate-300">...</span>}
                  {totalPages > 5 && (
                    <button onClick={() => setPage(totalPages)}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold transition ${
                        page === totalPages ? "bg-[#0050FF] text-white border-[#0050FF]" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}>
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

          {/* ── DETAIL PANEL (muncul di kanan, hanya tab Pendaftaran) ── */}
          <AnimatePresence>
            {detail && activeTab === "Pendaftaran" && (
              <div className="xl:w-[360px] flex-shrink-0">
                <DetailPanel
                  detail={detail}
                  onClose={() => setDetail(null)}
                  onApprove={handleApprove}
                  onVerify={handleVerify}
                  onReject={handleReject}
                  processing={processingId === detail.id}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}