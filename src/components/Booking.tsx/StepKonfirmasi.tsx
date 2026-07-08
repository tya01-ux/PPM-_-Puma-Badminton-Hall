// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight, ClipboardCheck, MapPin, Calendar, Clock, User, Tag } from "lucide-react";
// import type { BookingData } from "../../pages/Booking";

// interface Props {
//   bookingData: BookingData;
//   loading: boolean;
//   onConfirm: () => void;
//   onBack: () => void;
// }

// export default function StepKonfirmasi({ bookingData, loading, onConfirm, onBack }: Props) {
//   const subtotal = bookingData.courtPrice * bookingData.durasi;
//   const biayaLayanan = subtotal > 0 ? 2000 : 0;
//   const total = subtotal + biayaLayanan;

//   const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
//     <div className="flex justify-between items-start gap-3 py-2">
//       <div className="flex items-center gap-2 text-gray-400 text-xs">
//         {icon}
//         {label}
//       </div>
//       <span className="text-sm font-medium text-[#001845] text-right">{value}</span>
//     </div>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//       className="space-y-4"
//     >
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
//           <ClipboardCheck size={18} className="text-white" />
//         </div>
//         <div>
//           <h2 className="font-bold text-base text-[#001845] leading-tight">Ringkasan Pesanan</h2>
//           <p className="text-xs text-gray-400 mt-0.5">Periksa kembali detail pesananmu</p>
//         </div>
//       </div>

//       {/* Detail Booking */}
//       <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
//         <div className="px-4 pt-4 pb-2">
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Detail Booking</p>
//         </div>
//         <div className="px-4 pb-4 divide-y divide-gray-50">
//           <Row icon={<MapPin size={13} />} label="Lapangan" value={bookingData.courtName} />
//           <Row
//             icon={<Calendar size={13} />}
//             label="Tanggal"
//             value={new Date(bookingData.date).toLocaleDateString("id-ID", {
//               weekday: "long",
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             })}
//           />
//           <Row
//             icon={<Clock size={13} />}
//             label="Waktu"
//             value={`${bookingData.startTime.slice(0, 5)} - ${bookingData.endTime.slice(0, 5)} WIB`}
//           />
//           <Row icon={<Clock size={13} />} label="Durasi" value={`${bookingData.durasi} Jam`} />
//         </div>
//       </div>

//       {/* Detail Pemesan */}
//       <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
//         <div className="px-4 pt-4 pb-2">
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Detail Pemesan</p>
//         </div>
//         <div className="px-4 pb-4 divide-y divide-gray-50">
//           <Row icon={<User size={13} />} label="Nama" value={bookingData.namaLengkap} />
//           <Row icon={<User size={13} />} label="No. WhatsApp" value={bookingData.noWhatsapp} />
//           <Row icon={<User size={13} />} label="Email" value={bookingData.email} />
//           {bookingData.catatanBooking && (
//             <Row icon={<ClipboardCheck size={13} />} label="Catatan" value={bookingData.catatanBooking} />
//           )}
//           {bookingData.kodePromo && (
//             <Row icon={<Tag size={13} />} label="Kode Promo" value={bookingData.kodePromo} />
//           )}
//         </div>
//       </div>

//       {/* Rincian Pembayaran */}
//       <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
//         <div className="px-4 pt-4 pb-2">
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rincian Pembayaran</p>
//         </div>
//         <div className="px-4 pb-4 space-y-2 text-sm">
//           <div className="flex justify-between text-gray-500">
//             <span>Harga Lapangan ({bookingData.durasi} Jam)</span>
//             <span>Rp {subtotal.toLocaleString("id-ID")}</span>
//           </div>
//           <div className="flex justify-between text-gray-500">
//             <span>Biaya Layanan</span>
//             <span>Rp {biayaLayanan.toLocaleString("id-ID")}</span>
//           </div>
//           <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
//             <span className="font-bold text-[#001845]">Total Pembayaran</span>
//             <span className="font-bold text-lg text-[#0050FF]">Rp {total.toLocaleString("id-ID")}</span>
//           </div>
//         </div>
//       </div>

//       <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex gap-2">
//         <span>ℹ️</span>
//         <span>Dengan melanjutkan, pesananmu akan dibuat dan menunggu pembayaran.</span>
//       </div>

//       <div className="flex gap-3 pt-1">
//         <button
//           onClick={onBack}
//           className="w-1/3 border border-gray-200 text-gray-500 py-3 sm:py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1"
//         >
//           <ChevronLeft size={14} />
//           Kembali
//         </button>
//         <motion.button
//           whileTap={{ scale: 0.98 }}
//           onClick={onConfirm}
//           disabled={loading}
//           className="w-2/3 bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:shadow-xl enabled:hover:shadow-blue-500/30 flex items-center justify-center gap-1"
//         >
//           {loading ? "Memproses..." : "Lanjut ke Pembayaran"}
//           {!loading && <ChevronRight size={14} />}
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }