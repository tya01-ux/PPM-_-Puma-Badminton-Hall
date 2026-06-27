import { useEffect, useState } from "react";
import { Eye, Check, X } from "lucide-react";
import { usePaymentStore, type Payment } from "../../../store/usePaymentStore";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const formatDate = (iso?: string) => iso
  ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  : "-";

const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

// ── BADGE STATUS PAYMENT ──
const PaymentBadge = ({ status }: { status: Payment["status"] }) => {
  const map: Record<string, string> = {
    pending:   "bg-slate-100 text-slate-600 border-slate-200",
    uploaded:  "bg-yellow-50 text-yellow-600 border-yellow-100",
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected:  "bg-rose-50 text-rose-600 border-rose-100",
    expired:   "bg-orange-50 text-orange-600 border-orange-100",
    cash:      "bg-blue-50 text-blue-600 border-blue-100",
  };
  const label: Record<string, string> = {
    pending: "Pending", uploaded: "Uploaded", confirmed: "Confirmed",
    rejected: "Rejected", expired: "Expired", cash: "Cash",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-md border ${map[status] ?? ""}`}>
      {label[status] ?? status}
    </span>
  );
};

export default function PaymentIndex() {
  const { payments, loading, fetchAllPayments, confirmPayment, rejectPayment } = usePaymentStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [detail, setDetail] = useState<Payment | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [rejectId, setRejectId] = useState<number | null>(null);

  useEffect(() => { fetchAllPayments(); }, []);

  // ── FILTER ──
  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.booking?.bookingCode?.toLowerCase().includes(q) ||
      p.booking?.user?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "Semua" || p.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleConfirm = async (bookingId: number) => {
    if (!confirm("Konfirmasi pembayaran ini?")) return;
    try {
      await confirmPayment(bookingId);
      alert("Pembayaran dikonfirmasi!");
    } catch (err: any) { alert(err.message); }
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) return alert("Note wajib diisi!");
    try {
      await rejectPayment(rejectId!, rejectNote);
      setRejectId(null);
      setRejectNote("");
      alert("Pembayaran ditolak.");
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-4 md:p-6 rounded-[2.5rem]">
      <div className="w-full bg-white border border-slate-200/90 p-6 md:p-8 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

        {/* ── HEADER ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl tracking-tight">Daftar Pembayaran</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Verifikasi pembayaran & kelola transaksi.</p>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-bold text-slate-600 outline-none focus:border-blue-500 cursor-pointer">
            <option value="Semua">Semua Status</option>
            {["pending","uploaded","confirmed","rejected","expired","cash"].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <input type="text" placeholder="Cari booking code / nama..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-sm font-medium outline-none focus:border-blue-500" />
        </div>

        {/* ── TABLE ── */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold text-sm">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-bold text-sm border border-dashed rounded-2xl">Tidak ada data pembayaran.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4 text-center">No</th>
                  <th className="py-4 px-4">Booking Code</th>
                  <th className="py-4 px-4">Pelanggan</th>
                  <th className="py-4 px-4">Total Bayar</th>
                  <th className="py-4 px-4">Metode</th>
                  <th className="py-4 px-4">Bukti Transfer</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Dibuat Pada</th>
                  <th className="py-4 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {filtered.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-center text-slate-400 font-bold">{i + 1}</td>
                    <td className="py-4 px-4 font-bold text-blue-600 text-xs">{p.booking?.bookingCode ?? "-"}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{p.booking?.user?.name ?? "-"}</td>
                    <td className="py-4 px-4 font-semibold">{formatRupiah(p.totalAmount)}</td>
                    <td className="py-4 px-4 text-slate-500">{p.channel?.name ?? "-"}</td>

                    {/* ── KOLOM BUKTI TRANSFER ── */}
                    <td className="py-4 px-4">
                      {p.proofs && p.proofs.length > 0 ? (
                        <img
                          src={`${BASE_URL}${p.proofs[p.proofs.length - 1].image}`}
                          alt="Bukti"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 cursor-pointer hover:scale-105 transition"
                          onClick={() => setDetail(p)}
                        />
                      ) : (
                        <span className="text-slate-400 text-xs">Belum ada</span>
                      )}
                    </td>

                    <td className="py-4 px-4"><PaymentBadge status={p.status} /></td>
                    <td className="py-4 px-4 text-slate-500 text-xs">{formatDate(p.paidAt)}</td>

                    {/* ── AKSI ── */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setDetail(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Detail">
                          <Eye size={15} />
                        </button>
                        {p.status === "uploaded" && (
                          <>
                            <button onClick={() => handleConfirm(p.bookingId)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition" title="Konfirmasi">
                              <Check size={15} />
                            </button>
                            <button onClick={() => setRejectId(p.bookingId)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition" title="Tolak">
                              <X size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL DETAIL PAYMENT ── */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50 sticky top-0">
              <h3 className="font-black text-slate-900">Detail Pembayaran</h3>
              <button onClick={() => setDetail(null)}><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Booking Code</span><span className="font-bold text-blue-600">{detail.booking?.bookingCode}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Pelanggan</span><span className="font-bold">{detail.booking?.user?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Lapangan</span><span className="font-bold">{detail.booking?.court?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Metode</span><span className="font-semibold">{detail.channel?.name ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Harga Lapangan</span><span className="font-semibold">{formatRupiah(detail.courtPrice)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Biaya Admin</span><span className="font-semibold">{formatRupiah(detail.adminFee)}</span></div>
              {detail.discount > 0 && <div className="flex justify-between"><span className="text-slate-500">Diskon</span><span className="font-semibold text-emerald-600">-{formatRupiah(detail.discount)}</span></div>}
              <div className="flex justify-between border-t pt-3"><span className="font-bold">Total</span><span className="font-black text-blue-600">{formatRupiah(detail.totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><PaymentBadge status={detail.status} /></div>
              {detail.note && <div className="flex justify-between"><span className="text-slate-500">Catatan Admin</span><span className="font-semibold text-rose-600">{detail.note}</span></div>}

              {/* FOTO BUKTI */}
              {detail.proofs && detail.proofs.length > 0 && (
                <div className="mt-2">
                  <p className="text-slate-500 font-medium mb-2">Bukti Transfer</p>
                  <img src={`${BASE_URL}${detail.proofs[detail.proofs.length - 1].image}`}
                    alt="Bukti Transfer"
                    className="w-full rounded-xl border border-slate-200 object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL REJECT ── */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
              <h3 className="font-black text-slate-900">Tolak Pembayaran</h3>
              <button onClick={() => setRejectId(null)}><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <textarea rows={3} placeholder="Alasan penolakan..."
                value={rejectNote} onChange={(e) => setRejectNote(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-rose-400 resize-none" />
              <button onClick={handleReject}
                className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition">
                Tolak Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}