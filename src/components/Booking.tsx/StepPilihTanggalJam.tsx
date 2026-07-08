// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight, AlertTriangle, Calendar, Zap } from "lucide-react";
// import { useBookingStore } from "../../store/useBookingStore";
// import type { BookingData } from "../../pages/Booking";

// interface Props {
//   bookingData: BookingData;
//   onNext: (date: string, startTime: string, endTime: string, durasi: number) => void;
//   onBack: () => void;
// }

// const TIME_SLOTS = [
//   "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
//   "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
// ];

// const BULAN = [
//   "Januari", "Februari", "Maret", "April", "Mei", "Juni",
//   "Juli", "Agustus", "September", "Oktober", "November", "Desember",
// ];

// const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// function formatDateLocal(year: number, month: number, day: number) {
//   const m = String(month + 1).padStart(2, "0");
//   const d = String(day).padStart(2, "0");
//   return `${year}-${m}-${d}`;
// }

// export default function StepPilihTanggalJam({ bookingData, onNext, onBack }: Props) {
//   const { bookings, fetchBookings } = useBookingStore();

//   const todayObj = new Date();
//   const todayStr = formatDateLocal(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());

//   const [viewYear, setViewYear] = useState(todayObj.getFullYear());
//   const [viewMonth, setViewMonth] = useState(todayObj.getMonth());
//   const [date, setDate] = useState(bookingData.date || "");
//   const [startTime, setStartTime] = useState(bookingData.startTime?.slice(0, 5) || "");
//   const [durasi, setDurasi] = useState(bookingData.durasi || 1);

//   useEffect(() => { fetchBookings(); }, [fetchBookings]);

//   const calendarDays = useMemo(() => {
//     const firstDay = new Date(viewYear, viewMonth, 1).getDay();
//     const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
//     const days: { day: number | null; dateStr: string | null }[] = [];
//     for (let i = 0; i < firstDay; i++) days.push({ day: null, dateStr: null });
//     for (let d = 1; d <= totalDays; d++) days.push({ day: d, dateStr: formatDateLocal(viewYear, viewMonth, d) });
//     return days;
//   }, [viewYear, viewMonth]);

//   const goPrevMonth = () => {
//     if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
//     else setViewMonth((m) => m - 1);
//   };

//   const goNextMonth = () => {
//     if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
//     else setViewMonth((m) => m + 1);
//   };

//   const selectDate = (dateStr: string) => {
//     if (dateStr < todayStr) return;
//     setDate(dateStr);
//     setStartTime("");
//   };

//   // ✅ FIX: pakai startAt/endAt (ISO datetime), bukan bookingDate/startTime/endTime lagi
//   const bookedSlots = useMemo(() => {
//     if (!date || !bookingData.courtId) return [];
//     return bookings
//       .filter((b: any) => {
//         const sameCourt = b.courtId === bookingData.courtId;
//         const sameDate = b.startAt?.slice(0, 10) === date;
//         return sameCourt && sameDate && b.status !== "cancelled";
//       })
//       .map((b: any) => ({
//         start: b.startAt.slice(11, 16),
//         end: b.endAt.slice(11, 16),
//       }));
//   }, [bookings, date, bookingData.courtId]);

//   const isSlotBooked = (slot: string) => bookedSlots.some((b) => slot >= b.start && slot < b.end);

//   const getEndTime = (start: string, jam: number) => {
//     if (!start) return "";
//     const [h] = start.split(":").map(Number);
//     return `${String(h + jam).padStart(2, "0")}:00`;
//   };

//   const endTime = getEndTime(startTime, durasi);

//   const isRangeAvailable = useMemo(() => {
//     if (!startTime) return true;
//     const [startH] = startTime.split(":").map(Number);
//     for (let i = 0; i < durasi; i++) {
//       const slot = `${String(startH + i).padStart(2, "0")}:00`;
//       if (isSlotBooked(slot)) return false;
//     }
//     return true;
//   }, [startTime, durasi, bookedSlots]);

//   const totalHarga = bookingData.courtPrice * durasi;
//   const durasiOptions = [
//     { value: 1, label: "1 Jam" },
//     { value: 2, label: "2 Jam" },
//     { value: 3, label: "3 Jam" },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//       className="space-y-4"
//     >
//       {/* Section Header */}
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
//           <Calendar size={18} className="text-white" />
//         </div>
//         <div>
//           <h2 className="font-bold text-base text-[#001845] leading-tight">Tanggal & Waktu</h2>
//           <p className="text-xs text-gray-400 mt-0.5">Pilih jadwal bermain kamu</p>
//         </div>
//       </div>

//       {/* Calendar Card */}
//       <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
//         <div className="px-4 pt-4 pb-2">
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pilih Tanggal</p>
//         </div>

//         <div className="px-3 sm:px-4 pb-2">
//           <div className="flex items-center justify-between mb-2 sm:mb-3">
//             <button
//               onClick={goPrevMonth}
//               className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-[#0050FF] transition-all duration-200"
//             >
//               <ChevronLeft size={14} />
//             </button>
//             <span className="font-bold text-sm text-[#001845]">
//               {BULAN[viewMonth]} {viewYear}
//             </span>
//             <button
//               onClick={goNextMonth}
//               className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-[#0050FF] transition-all duration-200"
//             >
//               <ChevronRight size={14} />
//             </button>
//           </div>

//           <div className="grid grid-cols-7 mb-1">
//             {HARI.map((h, i) => (
//               <div
//                 key={h}
//                 className={`text-center text-[10px] sm:text-[11px] font-semibold py-1 ${
//                   i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-300"
//                 }`}
//               >
//                 {h}
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-7 gap-0.5 sm:gap-1 pb-3">
//             {calendarDays.map((d, idx) => {
//               if (d.day === null) return <div key={idx} />;

//               const isPast = d.dateStr! < todayStr;
//               const isToday = d.dateStr === todayStr;
//               const isSelected = d.dateStr === date;
//               const dayOfWeek = idx % 7;

//               return (
//                 <motion.button
//                   key={idx}
//                   whileTap={!isPast ? { scale: 0.82 } : {}}
//                   disabled={isPast}
//                   onClick={() => selectDate(d.dateStr!)}
//                   className={`relative w-full aspect-square text-[11px] sm:text-[13px] rounded-lg sm:rounded-xl flex items-center justify-center font-medium transition-all duration-200 ${
//                     isPast
//                       ? "text-gray-200 cursor-not-allowed"
//                       : isSelected
//                       ? "bg-gradient-to-br from-[#0050FF] to-indigo-600 text-white font-bold shadow-md shadow-blue-400/30"
//                       : isToday
//                       ? "bg-blue-50 border-2 border-[#0050FF] text-[#0050FF] font-bold"
//                       : dayOfWeek === 0
//                       ? "text-red-400 hover:bg-red-50"
//                       : dayOfWeek === 6
//                       ? "text-blue-400 hover:bg-blue-50"
//                       : "text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   {d.day}
//                   {isToday && !isSelected && (
//                     <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0050FF]" />
//                   )}
//                 </motion.button>
//               );
//             })}
//           </div>
//         </div>

//         <AnimatePresence>
//           {date && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="mx-3 sm:mx-4 mb-4"
//             >
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-2.5 flex items-center gap-2">
//                 <div className="w-1.5 h-1.5 rounded-full bg-[#0050FF] flex-shrink-0" />
//                 <p className="text-xs text-gray-500 leading-snug">
//                   Terpilih:{" "}
//                   <span className="font-semibold text-[#001845]">
//                     {new Date(date).toLocaleDateString("id-ID", {
//                       weekday: "long",
//                       day: "numeric",
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </span>
//                 </p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Time Slots Card */}
//       <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
//         <div className="px-4 pt-4 pb-3">
//           <div className="flex items-center gap-2 mb-3">
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam Mulai</p>
//             {bookedSlots.length > 0 && (
//               <div className="flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full">
//                 <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
//                 <span className="text-[10px] font-medium text-red-400">Sudah terisi</span>
//               </div>
//             )}
//           </div>

//           {!date ? (
//             <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-300">
//               <Calendar size={24} />
//               <p className="text-sm">Pilih tanggal terlebih dahulu</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
//               {TIME_SLOTS.map((slot, i) => {
//                 const booked = isSlotBooked(slot);
//                 const isSelected = startTime === slot;
//                 return (
//                   <motion.button
//                     key={slot}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: i * 0.02, duration: 0.2 }}
//                     whileTap={!booked ? { scale: 0.92 } : {}}
//                     disabled={booked}
//                     onClick={() => setStartTime(slot)}
//                     className={`py-2 sm:py-2.5 px-0.5 rounded-lg sm:rounded-xl text-[12px] sm:text-[13px] font-semibold transition-all duration-200 ${
//                       booked
//                         ? "bg-red-50 text-red-200 cursor-not-allowed line-through"
//                         : isSelected
//                         ? "bg-gradient-to-b from-[#001845] to-[#0050FF] text-white shadow-lg shadow-blue-400/25"
//                         : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-[#0050FF]"
//                     }`}
//                   >
//                     {slot}
//                   </motion.button>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <AnimatePresence>
//           {startTime && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="border-t border-gray-50 px-4 py-4"
//             >
//               <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Durasi</p>
//               <div className="flex gap-2">
//                 {durasiOptions.map((opt) => (
//                   <button
//                     key={opt.value}
//                     onClick={() => setDurasi(opt.value)}
//                     className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
//                       durasi === opt.value
//                         ? "bg-gradient-to-b from-[#001845] to-[#0050FF] text-white shadow-md shadow-blue-400/20"
//                         : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-[#0050FF]"
//                     }`}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Summary / Warning Card */}
//       <AnimatePresence>
//         {startTime && (
//           <motion.div
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.3 }}
//             className={`rounded-2xl overflow-hidden border ${
//               isRangeAvailable
//                 ? "border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50"
//                 : "border-red-100 bg-red-50"
//             }`}
//           >
//             {isRangeAvailable ? (
//               <div className="p-4">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
//                     <Zap size={13} className="text-white" fill="white" />
//                   </div>
//                   <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Jadwal Tersedia</span>
//                 </div>
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <p className="text-xs text-gray-400 mb-0.5">Waktu Bermain</p>
//                     <p className="text-base sm:text-lg font-bold text-[#001845]">
//                       {startTime} <span className="text-gray-300 font-normal">–</span> {endTime}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xs text-gray-400 mb-0.5">Total Harga</p>
//                     <p className="text-base sm:text-lg font-bold text-[#0050FF]">
//                       Rp {totalHarga.toLocaleString("id-ID")}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="p-4 flex items-start gap-3">
//                 <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <AlertTriangle size={15} className="text-red-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-red-600 mb-0.5">Jadwal Bentrok</p>
//                   <p className="text-xs text-red-400 leading-relaxed">
//                     Durasi ini bertabrakan dengan booking lain. Pilih durasi lebih singkat atau jam yang berbeda.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* CTA Buttons */}
//       <div className="flex gap-3 pt-1">
//         <button
//           onClick={onBack}
//           className="w-1/3 border border-gray-200 text-gray-500 py-3 sm:py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1"
//         >
//           <ChevronLeft size={14} />
//           Kembali
//         </button>
//         <motion.button
//           whileTap={(!date || !startTime || !isRangeAvailable) ? {} : { scale: 0.98 }}
//           onClick={() => onNext(date, `${startTime}:00`, `${endTime}:00`, durasi)}
//           disabled={!date || !startTime || !isRangeAvailable}
//           className="w-2/3 bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:shadow-xl enabled:hover:shadow-blue-500/30 enabled:hover:-translate-y-0.5 flex items-center justify-center gap-1"
//         >
//           Lanjut Konfirmasi
//           <ChevronRight size={14} />
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }