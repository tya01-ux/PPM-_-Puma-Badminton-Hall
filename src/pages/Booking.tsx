import { useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useBookingStore } from "../store/useBookingStore";

import StepPilihLapangan from "../components/Booking.tsx/StepPilihLapangan";
import StepPilihTanggalJam from "../components/Booking.tsx/StepPilihTanggalJam";
import StepInformasiPemesan from "../components/Booking.tsx/StepInformasiPemesan";
import StepKonfirmasi from "../components/Booking.tsx/StepKonfirmasi";
import StepPembayaran from "../components/Booking.tsx/StepPembayaran";
import StepBookingBerhasil from "../components/Booking.tsx/StepBookingBerhasil";
import BookingSidebar from "../components/Booking.tsx/BookingSidebar";
import kokk from "../assets/kokk.png";

export interface BookingData {
  courtId: number | null;
  courtName: string;
  courtPrice: number;
  courtImage?: string;
  date: string;
  startTime: string;
  endTime: string;
  durasi: number;
  namaLengkap: string;
  noWhatsapp: string;
  email: string;
  jenisKelamin: string;
  catatanBooking: string;
  kodePromo: string;
}

const STEPS = [
  { label: "Pilih Lapangan", desc: "Pilih lapangan yang tersedia" },
  { label: "Tanggal & Waktu", desc: "Pilih tanggal dan jam" },
  { label: "Info Pemesan",    desc: "Isi data diri kamu" },
  { label: "Ringkasan",       desc: "Cek kembali pesananmu" },
  { label: "Pembayaran",      desc: "Selesaikan pembayaran" },
  { label: "Selesai",         desc: "Booking berhasil!" },
];

export default function BookingFlow() {
  const { user }                                      = useAuthStore();
  const { createBooking, bookings, loading: bookingLoading } = useBookingStore();

  const [step, setStep]               = useState(1);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    courtId:       null,
    courtName:     "",
    courtPrice:    0,
    courtImage:    "",
    date:          "",
    startTime:     "",
    endTime:       "",
    durasi:        1,
    namaLengkap:   user?.name  || "",
    noWhatsapp:    "",
    email:         user?.email || "",
    jenisKelamin:  "",
    catatanBooking:"",
    kodePromo:     "",
  });

  const updateData = (data: Partial<BookingData>) =>
    setBookingData((prev) => ({ ...prev, ...data }));

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleCreateBooking = async () => {
    if (!user) { alert("Silahkan login terlebih dahulu"); return; }
    try {
      const startAt = `${bookingData.date}T${bookingData.startTime}`;
      const endAt   = `${bookingData.date}T${bookingData.endTime}`;
      const result  = await createBooking({
        startAt,
        endAt,
        courtId: bookingData.courtId!,
        notes:   bookingData.catatanBooking || undefined,
      });
      setBookingResult(result ?? null);
      goNext();
    } catch (error) {
      console.error(error);
      alert("Booking gagal, silakan coba lagi.");
    }
  };

  const isFinalStep = step === STEPS.length;

  return (
    <section className="bg-slate-50 min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#001845] to-[#1741B6] mt-14 md:mt-20">
        <img
          src={kokk} alt=""
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-40 md:w-[420px] opacity-[0.05] pointer-events-none select-none"
        />
        {/* subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="w-12 h-1 rounded-full bg-blue-300 mb-5" />
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight">
            <span className="text-white">Booking </span>
            <span className="text-[#AFC8FF]">Lapangan</span>
          </h1>
          <p className="mt-3 text-blue-200 text-sm md:text-base leading-relaxed max-w-lg">
            Pilih lapangan, tanggal, dan jam bermain favoritmu hanya dalam beberapa langkah mudah.
          </p>

          {/* mini breadcrumb di hero */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {STEPS.slice(0, step).map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  i === step - 1
                    ? "bg-white text-[#001845]"
                    : "bg-white/20 text-white/70"
                }`}>
                  {s.label}
                </span>
                {i < step - 1 && <ChevronRight size={12} className="text-white/40" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-28">

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-7 md:mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0050FF] text-[10px] md:text-xs font-bold">
            <Calendar size={11} />
            Jadwal Bermain
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-black leading-tight text-slate-900">
            Booking Lapangan{" "}
            <span className="text-[#0050FF]">Jadi Lebih Mudah.</span>
          </h2>
        </motion.div>

        {/* ── Step Indicator ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {!isFinalStep && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 md:mb-10 overflow-x-auto"
            >
              <div className="flex items-stretch min-w-max sm:min-w-0">
                {STEPS.map((s, i) => {
                  const idx      = i + 1;
                  const isActive = step === idx;
                  const isDone   = step > idx;
                  const isLast   = i === STEPS.length - 1;

                  return (
                    <div key={s.label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                      <div className={`flex items-center gap-2.5 px-4 py-3.5 relative ${
                        isActive ? "bg-blue-50/60" : ""
                      }`}>
                        {/* Active left border accent */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-[#0050FF]" />
                        )}

                        {/* Circle */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 transition-all duration-300 ${
                          isDone
                            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-300/40"
                            : isActive
                            ? "bg-[#0050FF] text-white shadow-md shadow-blue-400/30"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {isDone ? (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : idx}
                        </div>

                        {/* Label */}
                        <div className="hidden sm:block">
                          <p className={`whitespace-nowrap text-xs font-bold leading-tight ${
                            isActive ? "text-[#001845]" : isDone ? "text-slate-500" : "text-gray-400"
                          }`}>
                            {s.label}
                          </p>
                          <p className={`text-[10px] leading-tight mt-0.5 ${
                            isActive ? "text-[#0050FF]" : "text-gray-300"
                          }`}>
                            {s.desc}
                          </p>
                        </div>

                        {/* Mobile: hanya label pendek */}
                        <p className={`sm:hidden whitespace-nowrap text-[11px] font-bold ${
                          isActive ? "text-[#001845]" : isDone ? "text-slate-400" : "text-gray-300"
                        }`}>
                          {s.label}
                        </p>
                      </div>

                      {/* Connector line */}
                      {!isLast && (
                        <div className={`flex-1 h-px mx-1 transition-colors duration-300 ${
                          isDone ? "bg-emerald-300" : "bg-gray-100"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content Grid */}
        <AnimatePresence mode="wait">
          {isFinalStep ? (
            /* Full-width success screen */
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center"
            >
              <StepBookingBerhasil
                bookingData={bookingData}
                bookingResult={bookingResult}
                onLihatRiwayat={() => {}}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* ── Steps ── */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <StepPilihLapangan
                        selectedCourtId={bookingData.courtId}
                        onNext={(court) => {
                          updateData({ courtId: court.id, courtName: court.name, courtPrice: court.price });
                          goNext();
                        }}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <StepPilihTanggalJam
                        bookingData={bookingData}
                        onNext={(date, startTime, endTime, durasi) => {
                          updateData({ date, startTime, endTime, durasi });
                          goNext();
                        }}
                        onBack={goBack}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <StepInformasiPemesan
                        bookingData={bookingData}
                        onNext={(info) => { updateData(info); goNext(); }}
                        onBack={goBack}
                      />
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <StepKonfirmasi
                        bookingData={bookingData}
                        loading={bookingLoading}
                        onConfirm={handleCreateBooking}
                        onBack={goBack}
                      />
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <StepPembayaran
                        bookingData={bookingData}
                        bookingResult={bookingResult}
                        onNext={goNext}
                        onBack={goBack}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Sidebar ── */}
              <div className="lg:col-span-1">
                <BookingSidebar
                  bookingData={bookingData}
                  currentStep={step}
                  steps={STEPS}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}