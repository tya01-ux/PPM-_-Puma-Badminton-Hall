import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, AlertTriangle,
  Calendar, Zap, ImageOff, CheckCircle2,
} from "lucide-react";
import { useCourtStore } from "../../store/useCourtBoking";
import { useBookingStore } from "../../store/useBookingStore";
import type { BookingData } from "../../pages/Booking";

interface Props {
  bookingData: BookingData;
  onNext: (data: {
    courtId: number;
    courtName: string;
    courtPrice: number;
    courtImage?: string;
    date: string;
    startTime: string;
    endTime: string;
    durasi: number;
  }) => void;
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
];

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function formatDateLocal(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function StepPilihLapangan({ bookingData, onNext }: Props) {
  const { courts, fetchCourts, loading: courtsLoading } = useCourtStore();
  const { bookings, fetchBookings } = useBookingStore();

  const todayObj = new Date();
  const todayStr = formatDateLocal(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());

  const [courtId, setCourtId]       = useState<number | null>(bookingData.courtId);
  const [courtName, setCourtName]   = useState(bookingData.courtName);
  const [courtPrice, setCourtPrice] = useState(bookingData.courtPrice);
  const [courtImage, setCourtImage] = useState(bookingData.courtImage);

  const [viewYear, setViewYear]   = useState(todayObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayObj.getMonth());
  const [date, setDate]           = useState(bookingData.date || "");
  const [startTime, setStartTime] = useState(bookingData.startTime?.slice(0, 5) || "");
  const [durasi, setDurasi]       = useState(bookingData.durasi || 1);

  useEffect(() => { fetchCourts(); fetchBookings(); }, [fetchCourts, fetchBookings]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days: { day: number | null; dateStr: string | null }[] = [];
    for (let i = 0; i < firstDay; i++) days.push({ day: null, dateStr: null });
    for (let d = 1; d <= totalDays; d++) days.push({ day: d, dateStr: formatDateLocal(viewYear, viewMonth, d) });
    return days;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectDate = (dateStr: string) => {
    if (dateStr < todayStr) return;
    setDate(dateStr);
    setStartTime("");
  };

  const selectCourt = (court: { id: number; name: string; price: number; image?: string }) => {
    setCourtId(court.id);
    setCourtName(court.name);
    setCourtPrice(court.price);
    setCourtImage(court.image);
    setStartTime(""); // jam bisa beda ketersediaannya per court
  };

  const bookedSlots = useMemo(() => {
    if (!date || !courtId) return [];
    return bookings
      .filter((b: any) => {
        const sameCourt = b.courtId === courtId;
        const sameDate = b.startAt?.slice(0, 10) === date;
        return sameCourt && sameDate && b.status !== "cancelled";
      })
      .map((b: any) => ({
        start: b.startAt.slice(11, 16),
        end: b.endAt.slice(11, 16),
      }));
  }, [bookings, date, courtId]);

  const isSlotBooked = (slot: string) => bookedSlots.some((b) => slot >= b.start && slot < b.end);

  const getEndTime = (start: string, jam: number) => {
    if (!start) return "";
    const [h] = start.split(":").map(Number);
    return `${String(h + jam).padStart(2, "0")}:00`;
  };

  const endTime = getEndTime(startTime, durasi);

  const isRangeAvailable = useMemo(() => {
    if (!startTime) return true;
    const [startH] = startTime.split(":").map(Number);
    for (let i = 0; i < durasi; i++) {
      const slot = `${String(startH + i).padStart(2, "0")}:00`;
      if (isSlotBooked(slot)) return false;
    }
    return true;
  }, [startTime, durasi, bookedSlots]);

  const totalHarga = courtPrice * durasi;
  const durasiOptions = [
    { value: 1, label: "1 Jam" },
    { value: 2, label: "2 Jam" },
    { value: 3, label: "3 Jam" },
  ];

  const canProceed = !!courtId && !!date && !!startTime && isRangeAvailable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 space-y-5"
    >
      {/* Header */}
      <div>
        <h2 className="font-bold text-base sm:text-lg text-[#001845] leading-tight">Pilih Lapangan</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Pilih lapangan, tanggal dan waktu yang tersedia.</p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-5">

        {/* ── Kolom Kiri: Kalender ── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pilih Tanggal</p>
          <div className="border border-gray-100 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <button onClick={goPrevMonth} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-[#0050FF] transition-all duration-200">
                <ChevronLeft size={14} />
              </button>
              <span className="font-bold text-sm text-[#001845]">{BULAN[viewMonth]} {viewYear}</span>
              <button onClick={goNextMonth} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-[#0050FF] transition-all duration-200">
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {HARI.map((h, i) => (
                <div key={h} className={`text-center text-[10px] font-semibold py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-300"}`}>
                  {h}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map((d, idx) => {
                if (d.day === null) return <div key={idx} />;
                const isPast = d.dateStr! < todayStr;
                const isToday = d.dateStr === todayStr;
                const isSelected = d.dateStr === date;
                const dayOfWeek = idx % 7;

                return (
                  <motion.button
                    key={idx}
                    whileTap={!isPast ? { scale: 0.85 } : {}}
                    disabled={isPast}
                    onClick={() => selectDate(d.dateStr!)}
                    className={`relative w-full aspect-square text-[11px] rounded-lg flex items-center justify-center font-medium transition-all duration-200 ${
                      isPast ? "text-gray-200 cursor-not-allowed"
                        : isSelected ? "bg-gradient-to-br from-[#0050FF] to-indigo-600 text-white font-bold shadow-md shadow-blue-400/30"
                        : isToday ? "bg-blue-50 border-2 border-[#0050FF] text-[#0050FF] font-bold"
                        : dayOfWeek === 0 ? "text-red-400 hover:bg-red-50"
                        : dayOfWeek === 6 ? "text-blue-400 hover:bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {d.day}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Tanggal tersedia
          </div>
        </div>

        {/* ── Kolom Kanan: Pilih Lapangan ── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pilih Lapangan</p>

          {courtsLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-6 h-6 border-2 border-[#0050FF] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Memuat data lapangan...</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {courts.map((court: any, i: number) => {
              const isSelected = courtId === court.id;
              const isActive = court.isActive;
              return (
                <motion.button
                  key={court.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={isActive ? { y: -3 } : {}}
                  disabled={!isActive}
                  onClick={() => selectCourt(court)}
                  className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    !isActive ? "opacity-50 cursor-not-allowed border-gray-100"
                      : isSelected ? "border-[#0050FF] shadow-lg shadow-blue-500/15"
                      : "border-gray-100 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  <div className="relative h-20 bg-gradient-to-br from-[#001845] via-[#0050FF] to-[#001845]">
                    {court.image ? (
                      <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-6 h-6 text-white/30" strokeWidth={1.5} />
                      </div>
                    )}
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-4 h-4 text-[#0050FF]" />
                      </motion.div>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-[10px] font-semibold bg-black/30 px-2 py-0.5 rounded-full">Tidak Aktif</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="font-semibold text-xs text-slate-900 truncate">{court.name}</p>
                    <p className="text-[11px] font-bold text-[#0050FF] mt-0.5">
                      Rp {court.price.toLocaleString("id-ID")}
                      <span className="text-gray-400 font-normal"> /jam</span>
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {!courtsLoading && courts.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada lapangan tersedia.</p>
          )}
        </div>
      </div>

      {/* ── Pilih Waktu (full width) ── */}
      <div className="border-t border-gray-50 pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pilih Waktu</p>
          {bookedSlots.length > 0 && (
            <div className="flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-[10px] font-medium text-red-400">Sudah terisi</span>
            </div>
          )}
        </div>

        {!courtId || !date ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-300">
            <Calendar size={22} />
            <p className="text-sm">{!courtId ? "Pilih lapangan terlebih dahulu" : "Pilih tanggal terlebih dahulu"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
            {TIME_SLOTS.map((slot, i) => {
              const booked = isSlotBooked(slot);
              const isSelected = startTime === slot;
              return (
                <motion.button
                  key={slot}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  whileTap={!booked ? { scale: 0.92 } : {}}
                  disabled={booked}
                  onClick={() => setStartTime(slot)}
                  className={`py-2 sm:py-2.5 px-0.5 rounded-lg sm:rounded-xl text-[12px] sm:text-[13px] font-semibold transition-all duration-200 ${
                    booked ? "bg-red-50 text-red-200 cursor-not-allowed line-through"
                      : isSelected ? "bg-gradient-to-b from-[#001845] to-[#0050FF] text-white shadow-lg shadow-blue-400/25"
                      : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-[#0050FF]"
                  }`}
                >
                  {slot}
                </motion.button>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {startTime && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Durasi</p>
              <div className="flex gap-2">
                {durasiOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDurasi(opt.value)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      durasi === opt.value
                        ? "bg-gradient-to-b from-[#001845] to-[#0050FF] text-white shadow-md shadow-blue-400/20"
                        : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-[#0050FF]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Ringkasan / Warning ── */}
      <AnimatePresence>
        {startTime && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`rounded-2xl overflow-hidden border ${
              isRangeAvailable ? "border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50" : "border-red-100 bg-red-50"
            }`}
          >
            {isRangeAvailable ? (
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Zap size={13} className="text-white" fill="white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Waktu Bermain</p>
                    <p className="text-sm font-bold text-[#001845]">{startTime} – {endTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-gray-400">Total Harga</p>
                  <p className="text-sm font-bold text-[#0050FF]">Rp {totalHarga.toLocaleString("id-ID")}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={15} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-600 mb-0.5">Jadwal Bentrok</p>
                  <p className="text-xs text-red-400 leading-relaxed">
                    Durasi ini bertabrakan dengan booking lain. Pilih durasi lebih singkat atau jam yang berbeda.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Peraturan Booking ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex gap-2">
        <span>ℹ️</span>
        <span>Minimal booking 1 jam · Pembatalan maksimal 2 jam sebelum jadwal · Datang 15 menit sebelum waktu bermain · Pembayaran wajib dilakukan sebelum bermain.</span>
      </div>

      {/* ── CTA ── */}
      <div className="flex justify-end">
        <motion.button
          whileTap={canProceed ? { scale: 0.98 } : {}}
          disabled={!canProceed}
          onClick={() =>
            onNext({
              courtId: courtId!,
              courtName,
              courtPrice,
              courtImage,
              date,
              startTime: `${startTime}:00`,
              endTime: `${endTime}:00`,
              durasi,
            })
          }
          className="w-full sm:w-auto bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:shadow-xl enabled:hover:shadow-blue-500/30 enabled:hover:-translate-y-0.5 flex items-center justify-center gap-1"
        >
          Lanjutkan
          <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}