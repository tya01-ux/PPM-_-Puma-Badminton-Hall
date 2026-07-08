// import { useEffect } from "react";
// import { motion } from "framer-motion";
// import { ImageOff, CheckCircle2 } from "lucide-react";
// import { useCourtStore } from "../../store/useCourtBoking";

// interface Props {
//   selectedCourtId: number | null;
//   onNext: (court: { id: number; name: string; price: number }) => void;
// }

// export default function StepPilihLapangan({ selectedCourtId, onNext }: Props) {
//   const { courts, fetchCourts, loading } = useCourtStore();

//   useEffect(() => {
//     fetchCourts();
//   }, [fetchCourts]);

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-sm">
//       <h2 className="font-bold text-lg mb-1 text-[#001845]">Pilih Lapangan</h2>
//       <p className="text-sm text-gray-500 mb-5">Pilih lapangan yang ingin dipesan.</p>

//       {loading && (
//         <div className="flex flex-col items-center justify-center py-12 gap-2">
//           <div className="w-6 h-6 border-2 border-[#0050FF] border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Memuat data lapangan...</p>
//         </div>
//       )}

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         {courts.map((court, i) => {
//           const isSelected = selectedCourtId === court.id;
//           const isActive = court.isActive;

//           return (
//             <motion.button
//               key={court.id}
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.05 }}
//               whileHover={isActive ? { y: -4 } : {}}
//               disabled={!isActive}
//               onClick={() => onNext({ id: court.id, name: court.name, price: court.price })}
//               className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
//                 !isActive
//                   ? "opacity-50 cursor-not-allowed border-gray-100"
//                   : isSelected
//                   ? "border-[#0050FF] shadow-lg shadow-blue-500/15"
//                   : "border-gray-100 hover:border-blue-200 hover:shadow-lg"
//               }`}
//             >
//               {/* Top accent line, mirip card membership */}
//               <div
//                 className={`absolute top-0 left-0 w-full h-1 z-10 ${
//                   isSelected
//                     ? "bg-gradient-to-r from-[#0050FF] to-indigo-600"
//                     : "bg-gradient-to-r from-slate-200 to-slate-300"
//                 }`}
//               />

//               {/* Thumbnail */}
//               <div className="relative h-28 bg-gradient-to-br from-[#001845] via-[#0050FF] to-[#001845]">
//                 {court.image ? (
//                   <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center">
//                     <ImageOff className="w-8 h-8 text-white/30" strokeWidth={1.5} />
//                   </div>
//                 )}

//                 {/* Selected check */}
//                 {isSelected && (
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
//                   >
//                     <CheckCircle2 className="w-5 h-5 text-[#0050FF]" />
//                   </motion.div>
//                 )}

//                 {!isActive && (
//                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                     <span className="text-white text-xs font-semibold bg-black/30 px-2 py-1 rounded-full">
//                       Tidak Aktif
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Info */}
//               <div className="p-3">
//                 <div className="flex items-center justify-between mb-1">
//                   <p className="font-semibold text-sm text-slate-900">{court.name}</p>
//                   {!isActive && (
//                     <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600 shrink-0">
//                       Nonaktif
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-400 mb-1.5 capitalize">{court.type}</p>
//                 <p className="text-sm font-bold text-[#0050FF]">
//                   Rp {court.price.toLocaleString("id-ID")}{" "}
//                   <span className="text-gray-400 font-normal text-xs">/ jam</span>
//                 </p>
//               </div>
//             </motion.button>
//           );
//         })}
//       </div>

//       {!loading && courts.length === 0 && (
//         <p className="text-sm text-gray-400 text-center py-8">Belum ada lapangan tersedia.</p>
//       )}

//       <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex gap-2">
//         <span>ℹ️</span>
//         <span>Ketersediaan jam akan dicek pada langkah pemilihan tanggal & waktu.</span>
//       </div>
//     </div>
//   );
// }