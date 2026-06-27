import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  ChevronDown,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { BookingData } from "../../pages/Booking";

interface Props {
  bookingData: BookingData;
  onNext: (info: Partial<BookingData>) => void;
  onBack: () => void;
}

const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan", "Prefer tidak menyebutkan"];

// Simulasi validasi kode promo
const VALID_PROMOS: Record<string, { discount: number; label: string }> = {
  PUMA10: { discount: 10, label: "Diskon 10%" },
  BADMINTON20: { discount: 20, label: "Diskon 20%" },
};

export default function StepInformasiPemesan({ bookingData, onNext, onBack }: Props) {
  const [namaLengkap, setNamaLengkap] = useState(bookingData.namaLengkap || "");
  const [noWhatsapp, setNoWhatsapp] = useState(bookingData.noWhatsapp || "");
  const [email, setEmail] = useState(bookingData.email || "");
  const [jenisKelamin, setJenisKelamin] = useState(bookingData.jenisKelamin || "");
  const [catatanBooking, setCatatanBooking] = useState(bookingData.catatanBooking || "");
  const [kodePromo, setKodePromo] = useState(bookingData.kodePromo || "");
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [promoInfo, setPromoInfo] = useState<{ discount: number; label: string } | null>(null);
  const [showGender, setShowGender] = useState(false);
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
    onNext({ namaLengkap, noWhatsapp, email, jenisKelamin, catatanBooking, kodePromo });
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border text-sm text-gray-700 bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#0050FF] placeholder:text-gray-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
          <User size={18} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-base text-[#001845] leading-tight">Informasi Pemesan</h2>
          <p className="text-xs text-gray-400 mt-0.5">Isi data diri kamu untuk booking</p>
        </div>
      </div>

      {/* Data Diri Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Pemesan</p>
        </div>

        <div className="px-4 pb-4 space-y-3">
          {/* Nama Lengkap */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <User size={12} className="text-gray-400" />
              Nama Lengkap <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => { setNamaLengkap(e.target.value); setErrors((p) => ({ ...p, namaLengkap: "" })); }}
              placeholder="Contoh: Ahmad Fauzi"
              className={`${inputBase} ${errors.namaLengkap ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200"}`}
            />
            {errors.namaLengkap && (
              <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.namaLengkap}
              </p>
            )}
          </div>

          {/* No WhatsApp */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Phone size={12} className="text-gray-400" />
              No. WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={noWhatsapp}
              onChange={(e) => { setNoWhatsapp(e.target.value); setErrors((p) => ({ ...p, noWhatsapp: "" })); }}
              placeholder="0812 3456 7890"
              className={`${inputBase} ${errors.noWhatsapp ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200"}`}
            />
            {errors.noWhatsapp && (
              <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.noWhatsapp}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Mail size={12} className="text-gray-400" />
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
              placeholder="kamu@email.com"
              className={`${inputBase} ${errors.email ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200"}`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.email}
              </p>
            )}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Jenis Kelamin <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowGender((v) => !v)}
                className={`${inputBase} border-gray-200 flex items-center justify-between text-left ${!jenisKelamin ? "text-gray-300" : "text-gray-700"}`}
              >
                {jenisKelamin || "Pilih jenis kelamin"}
                <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${showGender ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showGender && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                    className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                  >
                    {JENIS_KELAMIN_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setJenisKelamin(opt); setShowGender(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 hover:text-[#0050FF] ${jenisKelamin === opt ? "text-[#0050FF] font-semibold bg-blue-50" : "text-gray-600"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Data Tambahan Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Tambahan</p>
        </div>

        <div className="px-4 pb-4 space-y-3">
          {/* Catatan */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <FileText size={12} className="text-gray-400" />
              Catatan Booking <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={catatanBooking}
              onChange={(e) => setCatatanBooking(e.target.value)}
              placeholder="Contoh: Butuh net tambahan, dll."
              rows={3}
              className={`${inputBase} border-gray-200 resize-none`}
            />
          </div>

          {/* Kode Promo */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Tag size={12} className="text-gray-400" />
              Kode Promo <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus("idle"); }}
                placeholder="Masukkan kode promo"
                className={`${inputBase} flex-1 ${
                  promoStatus === "valid"
                    ? "border-emerald-300 focus:ring-emerald-100 focus:border-emerald-400"
                    : promoStatus === "invalid"
                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                    : "border-gray-200"
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

            {/* Promo feedback */}
            <AnimatePresence>
              {promoStatus === "valid" && promoInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2"
                >
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-emerald-600 font-medium">
                    Kode berhasil! {promoInfo.label} diterapkan.
                  </p>
                </motion.div>
              )}
              {promoStatus === "invalid" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2"
                >
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400 font-medium">
                    Kode promo tidak valid atau sudah kadaluarsa.
                  </p>
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
          Saya telah membaca dan menyetujui{" "}
          <span className="text-[#0050FF] font-semibold cursor-pointer hover:underline">
            Syarat & Ketentuan
          </span>{" "}
          yang berlaku.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="w-1/3 border border-gray-200 text-gray-500 py-3 sm:py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1"
        >
          <ChevronLeft size={14} />
          Kembali
        </button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-2/3 bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-1"
        >
          Lanjut Pembayaran
          <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}