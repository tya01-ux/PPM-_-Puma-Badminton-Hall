import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, User, Phone, Mail, FileText, Tag,
  CheckCircle2, AlertCircle, MapPin, Calendar, Clock, ImageOff,
} from "lucide-react";
import type { BookingData } from "../../pages/Booking";

interface Props {
  bookingData: BookingData;
  onNext: (info: Partial<BookingData>) => void;
  onBack: () => void;
}

const VALID_PROMOS: Record<string, { discount: number; label: string }> = {
  PUMA10: { discount: 10, label: "Diskon 10%" },
  BADMINTON20: { discount: 20, label: "Diskon 20%" },
};

export default function StepDetailPemesanan({ bookingData, onNext, onBack }: Props) {
  const [namaLengkap, setNamaLengkap] = useState(bookingData.namaLengkap || "");
  const [noWhatsapp, setNoWhatsapp] = useState(bookingData.noWhatsapp || "");
  const [email, setEmail] = useState(bookingData.email || "");
  const [catatanBooking, setCatatanBooking] = useState(bookingData.catatanBooking || "");
  const [kodePromo, setKodePromo] = useState(bookingData.kodePromo || "");
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [promoInfo, setPromoInfo] = useState<{ discount: number; label: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!namaLengkap.trim()) e.namaLengkap = "Nama lengkap wajib diisi";
    if (!noWhatsapp.trim()) e.noWhatsapp = "No. WhatsApp wajib diisi";
    else if (!/^(\+62|62|0)[0-9]{8,13}$/.test(noWhatsapp.replace(/\s/g, "")))
      e.noWhatsapp = "Format nomor tidak valid";
    if (!email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format email tidak valid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (VALID_PROMOS[code]) {
      setPromoStatus("valid");
      setPromoInfo(VALID_PROMOS[code]);
      setKodePromo(code);
    } else {
      setPromoStatus("invalid");
      setPromoInfo(null);
      setKodePromo("");
    }
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext({ namaLengkap, noWhatsapp, email, catatanBooking, kodePromo });
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border text-sm text-gray-700 bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#0050FF] placeholder:text-gray-300";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
          <User size={18} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-base text-[#001845] leading-tight">Detail Pemesanan</h2>
          <p className="text-xs text-gray-400 mt-0.5">Cek lapangan & isi data diri kamu</p>
        </div>
      </div>

      {/* Informasi Lapangan (read-only) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Informasi Lapangan</p>
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#001845] via-[#0050FF] to-[#001845] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {bookingData.courtImage ? (
                <img src={bookingData.courtImage} alt={bookingData.courtName} className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="w-6 h-6 text-white/30" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-[#001845]">{bookingData.courtName}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin size={11} /> Jl. Sport Center No.10
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-0.5"><Calendar size={10} /> Tanggal</p>
              <p className="text-xs font-semibold text-[#001845]">
                {bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                  : "-"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-0.5"><Clock size={10} /> Waktu</p>
              <p className="text-xs font-semibold text-[#001845]">
                {bookingData.startTime ? `${bookingData.startTime.slice(0, 5)} - ${bookingData.endTime.slice(0, 5)}` : "-"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-400 mb-0.5">Harga Sewa</p>
              <p className="text-xs font-semibold text-[#0050FF]">Rp {bookingData.courtPrice.toLocaleString("id-ID")}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-400 mb-0.5">Durasi</p>
              <p className="text-xs font-semibold text-[#001845]">{bookingData.durasi} Jam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Diri */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Pemesan</p>
        </div>

        <div className="px-4 pb-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <User size={12} className="text-gray-400" /> Nama Lengkap <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => { setNamaLengkap(e.target.value); setErrors((p) => ({ ...p, namaLengkap: "" })); }}
              placeholder="Contoh: Ahmad Fauzi"
              className={`${inputBase} ${errors.namaLengkap ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200"}`}
            />
            {errors.namaLengkap && <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.namaLengkap}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Phone size={12} className="text-gray-400" /> No. WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={noWhatsapp}
              onChange={(e) => { setNoWhatsapp(e.target.value); setErrors((p) => ({ ...p, noWhatsapp: "" })); }}
              placeholder="0812 3456 7890"
              className={`${inputBase} ${errors.noWhatsapp ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200"}`}
            />
            {errors.noWhatsapp && <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.noWhatsapp}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Mail size={12} className="text-gray-400" /> Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
              placeholder="kamu@email.com"
              className={`${inputBase} ${errors.email ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200"}`}
            />
            {errors.email && <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} /> {errors.email}</p>}
          </div>
        </div>
      </div>

      {/* Data Tambahan */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Tambahan</p>
        </div>

        <div className="px-4 pb-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <FileText size={12} className="text-gray-400" /> Catatan Booking <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={catatanBooking}
              onChange={(e) => setCatatanBooking(e.target.value)}
              placeholder="Contoh: Butuh net tambahan, dll."
              rows={3}
              className={`${inputBase} border-gray-200 resize-none`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Tag size={12} className="text-gray-400" /> Kode Promo <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus("idle"); }}
                placeholder="Masukkan kode promo"
                className={`${inputBase} flex-1 ${
                  promoStatus === "valid" ? "border-emerald-300 focus:ring-emerald-100 focus:border-emerald-400" : promoStatus === "invalid" ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={!promoInput.trim()}
                className="px-4 py-3 rounded-xl bg-gradient-to-b from-[#001845] to-[#0050FF] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:shadow-blue-400/25 transition-all duration-200 whitespace-nowrap"
              >
                Gunakan
              </button>
            </div>

            <AnimatePresence>
              {promoStatus === "valid" && promoInfo && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-emerald-600 font-medium">Kode berhasil! {promoInfo.label} diterapkan.</p>
                </motion.div>
              )}
              {promoStatus === "invalid" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400 font-medium">Kode promo tidak valid atau sudah kadaluarsa.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Syarat & Ketentuan */}
      <div className="flex items-start gap-3 px-1">
        <div className="w-4 h-4 mt-0.5 rounded bg-[#0050FF] flex items-center justify-center flex-shrink-0">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Saya telah membaca dan menyetujui <span className="text-[#0050FF] font-semibold cursor-pointer hover:underline">Syarat & Ketentuan</span> yang berlaku.
        </p>
      </div>

      {/* CTA */}
      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="w-1/3 border border-gray-200 text-gray-500 py-3 sm:py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1">
          <ChevronLeft size={14} /> Kembali
        </button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-2/3 bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-1"
        >
          Lanjutkan ke Pembayaran <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}