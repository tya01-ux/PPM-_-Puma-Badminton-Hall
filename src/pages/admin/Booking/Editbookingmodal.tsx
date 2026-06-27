import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Pencil, CalendarDays, Clock, Building2,
  FileText, CheckCircle2, AlertCircle, Save,
} from "lucide-react";
import { useBookingStore } from "../../../store/useBookingStore";
import { useCourtStore } from "../../../store/useCourtBoking";

interface Props {
  booking: any;
  onClose: () => void;
  onSaved?: () => void;
}

const STATUS_OPTIONS = [
  { value: "pending",   label: "Menunggu Bayar", color: "bg-amber-50 text-amber-600 border-amber-200"       },
  { value: "confirmed", label: "Dikonfirmasi",   color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { value: "cancelled", label: "Dibatalkan",     color: "bg-rose-50 text-rose-500 border-rose-200"          },
  { value: "completed", label: "Selesai",        color: "bg-blue-50 text-blue-600 border-blue-200"          },
];

const DOT_COLOR: Record<string, string> = {
  pending:   "bg-amber-400",
  confirmed: "bg-emerald-400",
  cancelled: "bg-rose-400",
  completed: "bg-blue-400",
};

export default function EditBookingModal({ booking, onClose, onSaved }: Props) {
  const { updateBooking, loading } = useBookingStore();
  const { courts, fetchCourts }    = useCourtStore();

  const [form, setForm] = useState({
    courtId:   String(booking.courtId ?? ""),
    date:      booking.startAt?.slice(0, 10) ?? "",
    startTime: booking.startAt?.slice(11, 16) ?? "",
    endTime:   booking.endAt?.slice(11, 16)   ?? "",
    notes:     booking.notes ?? "",
    status:    booking.status ?? "pending",
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchCourts(); }, []);

  // ── PREVIEW HARGA ──
  const selectedCourt = courts.find((c) => c.id === Number(form.courtId));
  const durasi = (() => {
    if (!form.startTime || !form.endTime) return 0;
    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);
    return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
  })();
  const subtotal    = (selectedCourt?.price ?? booking.courtPrice ?? 0) * durasi;
  const biayaAdmin  = booking.payment?.adminFee ?? 2500;
  const total       = subtotal + biayaAdmin;

  const validate = () => {
    if (!form.courtId)   { setError("Lapangan wajib dipilih.");                             return false; }
    if (!form.date)      { setError("Tanggal wajib diisi.");                                return false; }
    if (!form.startTime) { setError("Jam mulai wajib diisi.");                              return false; }
    if (!form.endTime)   { setError("Jam selesai wajib diisi.");                            return false; }
    if (form.endTime <= form.startTime) { setError("Jam selesai harus setelah jam mulai."); return false; }
    return true;
  };

  const handleSave = async () => {
    setError("");
    if (!validate()) return;
    try {
      await updateBooking(booking.id, {
        courtId: Number(form.courtId),
        startAt: new Date(`${form.date}T${form.startTime}:00`).toISOString(),
        endAt:   new Date(`${form.date}T${form.endTime}:00`).toISOString(),
        notes:   form.notes || undefined,
        status:  form.status,
      });
      setSaved(true);
      setTimeout(() => { onSaved?.(); onClose(); }, 1200);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan.");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0050FF] focus:ring-2 focus:ring-blue-100 transition placeholder:text-slate-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* ── HEADER MODAL ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-600 flex items-center justify-center shadow-md shadow-blue-400/25">
              <Pencil size={15} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm leading-tight">Edit Booking</h3>
              <p className="text-[11px] text-slate-400 font-medium">{booking.bookingCode}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition">
            <X size={14} />
          </button>
        </div>

        {/* ── BODY MODAL ── */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Pilih Lapangan */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Building2 size={11} /> Lapangan
            </label>
            <select value={form.courtId}
              onChange={(e) => setForm({ ...form, courtId: e.target.value })}
              className={inputCls}>
              <option value="">-- Pilih Lapangan --</option>
              {courts.filter((c) => c.isActive).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — Rp {c.price.toLocaleString("id-ID")}/jam
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <CalendarDays size={11} /> Tanggal
            </label>
            <input type="date" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputCls} />
          </div>

          {/* Jam Mulai & Selesai */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Clock size={11} /> Jam Mulai
              </label>
              <input type="time" value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className={inputCls} />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Clock size={11} /> Jam Selesai
              </label>
              <input type="time" value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className={inputCls} />
            </div>
          </div>

          {/* Status Booking */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">Status Booking</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.value} type="button"
                  onClick={() => setForm({ ...form, status: opt.value })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-200 ${
                    form.status === opt.value
                      ? `${opt.color} border-current`
                      : "border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    form.status === opt.value ? DOT_COLOR[opt.value] : "bg-slate-200"
                  }`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <FileText size={11} /> Catatan
              <span className="font-normal text-slate-300">(opsional)</span>
            </label>
            <textarea rows={3} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Catatan tambahan..."
              className={`${inputCls} resize-none`} />
          </div>

          {/* ── PREVIEW HARGA ── */}
          <AnimatePresence>
            {durasi > 0 && selectedCourt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 space-y-1.5 overflow-hidden"
              >
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">
                  Preview Harga Baru
                </p>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Lapangan</span>
                  <span className="font-semibold text-slate-700">{selectedCourt.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Durasi</span>
                  <span className="font-semibold text-slate-700">{durasi} Jam</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-700">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Biaya Admin</span>
                  <span className="font-semibold text-slate-700">Rp {biayaAdmin.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-blue-100 pt-1.5 mt-1">
                  <span className="font-bold text-slate-700">Total Baru</span>
                  <span className="font-black text-[#0050FF]">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── ERROR ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 overflow-hidden"
              >
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-500 font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── SUCCESS ── */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 overflow-hidden"
              >
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                <p className="text-xs text-emerald-600 font-medium">Perubahan berhasil disimpan!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER MODAL ── */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition">
            Batal
          </button>
          <motion.button
            whileTap={loading || saved ? {} : { scale: 0.97 }}
            onClick={handleSave}
            disabled={loading || saved}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-400/25 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : saved ? (
              <><CheckCircle2 size={14} /> Tersimpan!</>
            ) : (
              <><Save size={14} /> Simpan Perubahan</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}