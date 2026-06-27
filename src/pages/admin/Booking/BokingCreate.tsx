import { useState, useEffect } from "react";
import { X, CalendarPlus, Wallet, User, Building2, Clock, FileText, CreditCard, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "../../../store/useBookingStore";
import { useUserStore } from "../../../store/useUserStore";
import { useCourtStore } from "../../../store/useCourtBoking";
import { usePaymentStore } from "../../../store/usePaymentStore";

interface BookingCreateProps {
  onClose: () => void;
}

const PAYMENT_METHODS = [
  { value: "cash",     label: "Tunai (Cash)",       icon: <Wallet size={15} /> },
  { value: "transfer", label: "Transfer Bank",       icon: <Building2 size={15} /> },
  { value: "qris",     label: "QRIS",               icon: <QrCode size={15} /> },
];

export default function BookingCreate({ onClose }: BookingCreateProps) {
  const { createBooking, loading } = useBookingStore();
  const { users, fetchUsers }      = useUserStore();
  const { courts, fetchCourts }    = useCourtStore();
  const { channels, fetchChannels } = usePaymentStore();

  useEffect(() => {
    fetchUsers();
    fetchCourts();
    fetchChannels();
  }, []);

  const [formData, setFormData] = useState({
    userId:        "",
    courtId:       "",
    date:          "",
    startTime:     "",
    endTime:       "",
    notes:         "",
    paymentMethod: "cash",
    channelId:     "",
  });

  const [step, setStep] = useState<1 | 2>(1);

  // Hitung durasi & harga
  const selectedCourt = courts.find((c) => c.id === Number(formData.courtId));
  const durasi = (() => {
    if (!formData.startTime || !formData.endTime) return 0;
    const [sh, sm] = formData.startTime.split(":").map(Number);
    const [eh, em] = formData.endTime.split(":").map(Number);
    return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
  })();
  const subtotal     = (selectedCourt?.price ?? 0) * durasi;
  const biayaAdmin   = subtotal > 0 ? 2000 : 0;
  const total        = subtotal + biayaAdmin;

  // Filter channels by selected method
  const filteredChannels = channels.filter(
    (c) => c.isActive && c.type === formData.paymentMethod
  );

  const validateStep1 = () => {
    if (!formData.userId || !formData.courtId || !formData.date || !formData.startTime || !formData.endTime) {
      alert("Semua field wajib diisi!");
      return false;
    }
    if (formData.endTime <= formData.startTime) {
      alert("Jam selesai harus setelah jam mulai!");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    try {
      const startAt = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
      const endAt   = new Date(`${formData.date}T${formData.endTime}:00`).toISOString();

      await createBooking({
        startAt,
        endAt,
        courtId:       Number(formData.courtId),
        userId:        Number(formData.userId),
        notes:         formData.notes || undefined,
        paymentMethod: formData.paymentMethod,
        channelId:     formData.channelId ? Number(formData.channelId) : undefined,
      } as any);

      alert("Booking manual berhasil dibuat!");
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0050FF] focus:ring-2 focus:ring-blue-100 transition placeholder:text-slate-300";

  const selectedUser  = users.find((u) => u.id === Number(formData.userId));

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-600 flex items-center justify-center shadow-md shadow-blue-400/25">
              <CalendarPlus size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Booking Manual</h3>
              <p className="text-[10px] text-slate-400">Admin — {step === 1 ? "Data Booking" : "Metode Pembayaran"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2">
          {["Data Booking", "Pembayaran"].map((label, i) => {
            const active  = step === i + 1;
            const done    = step > i + 1;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-1.5 ${active ? "" : "opacity-50"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 transition-all ${done ? "bg-emerald-500 text-white" : active ? "bg-[#0050FF] text-white" : "bg-slate-200 text-slate-500"}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-bold ${active ? "text-[#001845]" : "text-slate-400"}`}>{label}</span>
                </div>
                {i < 1 && <div className={`flex-1 h-px ${step > 1 ? "bg-emerald-400" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Data Booking ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Pelanggan */}
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <User size={11} /> Pelanggan <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                {/* Lapangan */}
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <Building2 size={11} /> Lapangan <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.courtId}
                    onChange={(e) => setFormData({ ...formData, courtId: e.target.value })}
                    className={inputCls}
                  >
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
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                    Tanggal <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputCls}
                  />
                </div>

                {/* Jam */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <Clock size={11} /> Jam Mulai <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <Clock size={11} /> Jam Selesai <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Preview harga */}
                {durasi > 0 && selectedCourt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 space-y-1.5"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Durasi</span>
                      <span className="font-semibold text-slate-700">{durasi} Jam</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-semibold text-slate-700">{subtotal.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Biaya Admin</span>
                      <span className="font-semibold text-slate-700">Rp {biayaAdmin.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-blue-100 pt-1.5">
                      <span className="font-bold text-slate-700">Total</span>
                      <span className="font-black text-[#0050FF]">Rp {total.toLocaleString("id-ID")}</span>
                    </div>
                  </motion.div>
                )}

                {/* Catatan */}
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <FileText size={11} /> Catatan <span className="text-slate-300 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Catatan tambahan..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Pembayaran ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Ringkasan booking */}
                <div className="bg-slate-50 rounded-xl px-4 py-3 space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ringkasan</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Pelanggan</span>
                    <span className="font-semibold text-slate-700">{selectedUser?.name ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Lapangan</span>
                    <span className="font-semibold text-slate-700">{selectedCourt?.name ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Waktu</span>
                    <span className="font-semibold text-slate-700">{formData.startTime} – {formData.endTime} ({durasi} Jam)</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-slate-200 pt-1.5 mt-1">
                    <span className="font-bold text-slate-700">Total</span>
                    <span className="font-black text-[#0050FF]">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Pilih metode */}
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2">Metode Pembayaran</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map((m) => {
                      const active = formData.paymentMethod === m.value;
                      return (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: m.value, channelId: "" })}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all duration-200 ${
                            active
                              ? "border-[#0050FF] bg-blue-50 text-[#0050FF]"
                              : "border-slate-200 text-slate-500 hover:border-blue-200"
                          }`}
                        >
                          <span className={active ? "text-[#0050FF]" : "text-slate-400"}>{m.icon}</span>
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pilih channel (kalau bukan cash dan ada channels) */}
                {formData.paymentMethod !== "cash" && filteredChannels.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-2">
                      {formData.paymentMethod === "transfer" ? "Pilih Bank Tujuan" : "Pilih Channel QRIS"}
                    </p>
                    <div className="space-y-2">
                      {filteredChannels.map((ch) => {
                        const active = formData.channelId === String(ch.id);
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, channelId: String(ch.id) })}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 text-left transition-all duration-200 ${
                              active ? "border-[#0050FF] bg-blue-50" : "border-slate-200 hover:border-blue-200"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-[#0050FF] text-white" : "bg-slate-100 text-slate-400"}`}>
                              {ch.type === "qris" ? <QrCode size={15} /> : <Building2 size={15} />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{ch.name}</p>
                              {ch.accountNumber && (
                                <p className="text-[10px] text-slate-400">{ch.accountNumber} · {ch.accountName}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Info metode cash */}
                {formData.paymentMethod === "cash" && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0050FF] flex items-center justify-center flex-shrink-0">
                      <Wallet size={14} className="text-white" />
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Booking manual dengan metode <span className="font-bold">Tunai</span> otomatis ditandai <span className="font-bold">Lunas</span> karena dibuat langsung oleh admin.
                    </p>
                  </div>
                )}

                {/* Info transfer/qris */}
                {formData.paymentMethod !== "cash" && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <CreditCard size={14} className="text-white" />
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Status pembayaran akan <span className="font-bold">Menunggu Konfirmasi</span> sampai bukti transfer diverifikasi admin.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 text-sm font-bold transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white py-2.5 text-sm font-bold hover:shadow-lg hover:shadow-blue-400/25 transition"
              >
                Lanjut →
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 text-sm font-bold transition"
              >
                ← Kembali
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || (formData.paymentMethod !== "cash" && filteredChannels.length > 0 && !formData.channelId)}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white py-2.5 text-sm font-bold hover:shadow-lg hover:shadow-blue-400/25 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Menyimpan..." : "Simpan Booking"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}