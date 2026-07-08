// import { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronLeft, ChevronRight, CreditCard, QrCode, Building2,
//   Wallet, Clock, Upload, X, CheckCircle2, ImageIcon, AlertCircle,
// } from "lucide-react";
// import { usePaymentStore } from "../../store/usePaymentStore";
// import type { PaymentChannel } from "../../store/usePaymentStore";
// import type { BookingData } from "../../pages/Booking";

// interface Props {
//   bookingData: BookingData;
//   bookingResult: any;
//   onNext: () => void;
//   onBack: () => void;
// }

// const TYPE_ICON: Record<string, React.ReactNode> = {
//   qris:     <QrCode size={15} />,
//   transfer: <Building2 size={15} />,
//   cash:     <Wallet size={15} />,
// };

// const TYPE_LABEL: Record<string, string> = {
//   qris:     "QRIS",
//   transfer: "Transfer Bank",
//   cash:     "Tunai",
// };

// export default function StepPembayaran({ bookingData, bookingResult, onNext, onBack }: Props) {
//   const { channels, fetchChannels, uploadProof } = usePaymentStore();
//   const [selectedChannel, setSelectedChannel] = useState<PaymentChannel | null>(null);
//   const [timeLeft, setTimeLeft]               = useState(15 * 60);
//   const [proofFile, setProofFile]             = useState<File | null>(null);
//   const [proofPreview, setProofPreview]       = useState<string | null>(null);
//   const [uploaded, setUploaded]               = useState(false);
//   const [uploadError, setUploadError]         = useState("");
//   const [uploadingProof, setUploadingProof]   = useState(false);
//   const fileInputRef                          = useRef<HTMLInputElement>(null);

//   useEffect(() => { fetchChannels(); }, [fetchChannels]);

//   useEffect(() => {
//     if (channels.length > 0 && !selectedChannel) {
//       setSelectedChannel(channels.find((c) => c.isActive) ?? channels[0]);
//     }
//   }, [channels]);

//   // Reset bukti kalau ganti channel
//   useEffect(() => {
//     setProofFile(null);
//     setProofPreview(null);
//     setUploaded(false);
//     setUploadError("");
//   }, [selectedChannel]);

//   // Countdown
//   useEffect(() => {
//     const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatCountdown = (sec: number) => {
//     const m = Math.floor(sec / 60).toString().padStart(2, "0");
//     const s = (sec % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   const subtotal      = bookingData.courtPrice * bookingData.durasi;
//   const biayaLayanan  = subtotal > 0 ? 2000 : 0;
//   const total         = subtotal + biayaLayanan;
//   const isCash        = selectedChannel?.type === "cash";
//   const needsProof    = !isCash;
//   const canProceed    = isCash || uploaded;

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) {
//       setUploadError("Ukuran file maksimal 5MB.");
//       return;
//     }
//     if (!file.type.startsWith("image/")) {
//       setUploadError("File harus berupa gambar (JPG, PNG, dll).");
//       return;
//     }
//     setUploadError("");
//     setProofFile(file);
//     setProofPreview(URL.createObjectURL(file));
//     setUploaded(false);
//   };

// const handleUpload = async () => {
//   if (!proofFile || !bookingResult?.id) return;

//   setUploadingProof(true);

//   try {
//     await uploadProof(bookingResult.id, proofFile);
//     setUploaded(true);
//     setUploadError("");
//   } catch (err: any) {
//     setUploadError(err.message || "Gagal mengunggah bukti. Coba lagi.");
//   } finally {
//     setUploadingProof(false);
//   }
// };

//   const handleRemoveProof = () => {
//     setProofFile(null);
//     setProofPreview(null);
//     setUploaded(false);
//     setUploadError("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

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
//           <CreditCard size={18} className="text-white" />
//         </div>
//         <div>
//           <h2 className="font-bold text-base text-[#001845] leading-tight">Pembayaran</h2>
//           <p className="text-xs text-gray-400 mt-0.5">Pilih metode dan selesaikan pembayaran</p>
//         </div>
//       </div>

//       {/* Countdown + Total bar */}
//       <div className="bg-gradient-to-r from-[#001845] to-[#0050FF] rounded-2xl px-5 py-3.5 flex items-center justify-between">
//         <div>
//           <p className="text-[10px] text-blue-200 font-medium uppercase tracking-wider">Total Pembayaran</p>
//           <p className="text-xl font-black text-white mt-0.5">Rp {total.toLocaleString("id-ID")}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-[10px] text-blue-200 font-medium uppercase tracking-wider flex items-center gap-1 justify-end">
//             <Clock size={10} /> Batas Waktu
//           </p>
//           <p className={`text-xl font-black mt-0.5 ${timeLeft < 60 ? "text-red-300 animate-pulse" : "text-white"}`}>
//             {formatCountdown(timeLeft)}
//           </p>
//         </div>
//       </div>

//       <div className="grid sm:grid-cols-2 gap-4">

//         {/* ── Kolom Kiri: Pilih Metode ── */}
//         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
//           <div className="px-4 pt-4 pb-2">
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Metode Pembayaran</p>
//           </div>
//           <div className="px-4 pb-4 space-y-2">
//             {channels.length === 0 && (
//               <div className="flex items-center justify-center py-8 gap-2 text-gray-300">
//                 <CreditCard size={20} />
//                 <p className="text-sm">Memuat metode...</p>
//               </div>
//             )}
//             {channels.filter((c) => c.isActive).map((c) => {
//               const isSelected = selectedChannel?.id === c.id;
//               return (
//                 <motion.button
//                   key={c.id}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setSelectedChannel(c)}
//                   className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
//                     isSelected ? "border-[#0050FF] bg-blue-50" : "border-gray-100 hover:border-blue-200 hover:bg-slate-50"
//                   }`}
//                 >
//                   <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
//                     isSelected ? "bg-gradient-to-br from-[#0050FF] to-indigo-600 text-white shadow-md shadow-blue-400/25" : "bg-gray-100 text-gray-400"
//                   }`}>
//                     {TYPE_ICON[c.type] ?? <CreditCard size={15} />}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className={`text-sm font-bold leading-tight ${isSelected ? "text-[#001845]" : "text-gray-700"}`}>{c.name}</p>
//                     <p className="text-[11px] text-gray-400 mt-0.5">{TYPE_LABEL[c.type] ?? c.type}</p>
//                   </div>
//                   {isSelected && (
//                     <div className="w-4 h-4 rounded-full bg-[#0050FF] flex items-center justify-center flex-shrink-0">
//                       <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
//                         <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                   )}
//                 </motion.button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── Kolom Kanan: Instruksi + Upload ── */}
//         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
//           <div className="px-4 pt-4 pb-2">
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
//               {selectedChannel ? `Instruksi — ${selectedChannel.name}` : "Instruksi Pembayaran"}
//             </p>
//           </div>

//           <div className="px-4 pb-4 flex-1 flex flex-col gap-3">
//             {!selectedChannel ? (
//               <div className="flex-1 flex items-center justify-center text-gray-300 gap-2 py-6">
//                 <CreditCard size={20} />
//                 <p className="text-sm">Pilih metode dulu</p>
//               </div>
//             ) : selectedChannel.type === "qris" && selectedChannel.qrImage ? (
//               /* QRIS */
//               <div className="flex flex-col items-center gap-2">
//                 <div className="border-2 border-blue-100 rounded-2xl p-3 bg-blue-50/30">
//                   <img src={selectedChannel.qrImage} alt="QRIS" className="w-36 h-36 object-contain" />
//                 </div>
//                 <p className="text-[11px] text-gray-400 text-center leading-relaxed">
//                   Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking kamu.
//                 </p>
//               </div>
//             ) : selectedChannel.type === "transfer" ? (
//               /* Transfer */
//               <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-xl p-4 flex items-center gap-3 border border-slate-100">
//                 <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-blue-400/20">
//                   <Building2 size={18} />
//                 </div>
//                 <div>
//                   <p className="text-[10px] text-gray-400 font-medium">{selectedChannel.name}</p>
//                   <p className="text-base font-black text-[#001845] tracking-wider">{selectedChannel.accountNumber}</p>
//                   <p className="text-xs text-gray-500 font-medium">a.n. {selectedChannel.accountName}</p>
//                 </div>
//               </div>
//             ) : (
//               /* Cash */
//               <div className="flex flex-col items-center gap-3 py-4">
//                 <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
//                   <Wallet size={26} className="text-[#0050FF]" />
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm font-bold text-[#001845]">Bayar di Lokasi</p>
//                   <p className="text-xs text-gray-400 mt-1 leading-relaxed">
//                     Siapkan uang tunai sesuai total dan bayar langsung ke kasir saat tiba.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* ── Upload Bukti (non-cash) ── */}
//             <AnimatePresence>
//               {needsProof && selectedChannel && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="border-t border-gray-50 pt-3 space-y-2"
//                 >
//                   <p className="text-xs font-semibold text-gray-500">Upload Bukti Pembayaran</p>

//                   {!proofPreview ? (
//                     /* Drop zone */
//                     <button
//                       type="button"
//                       onClick={() => fileInputRef.current?.click()}
//                       className="w-full border-2 border-dashed border-gray-200 hover:border-[#0050FF] hover:bg-blue-50/40 rounded-xl py-5 flex flex-col items-center gap-2 text-gray-400 hover:text-[#0050FF] transition-all duration-200 group"
//                     >
//                       <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
//                         <Upload size={18} className="group-hover:text-[#0050FF]" />
//                       </div>
//                       <div className="text-center">
//                         <p className="text-xs font-semibold">Klik untuk pilih foto</p>
//                         <p className="text-[10px] mt-0.5">JPG, PNG — maks. 5MB</p>
//                       </div>
//                     </button>
//                   ) : (
//                     /* Preview */
//                     <div className="relative rounded-xl overflow-hidden border border-gray-200">
//                       <img src={proofPreview} alt="Bukti" className="w-full h-36 object-cover" />
//                       <div className="absolute inset-0 bg-black/20 flex items-start justify-end p-2">
//                         <button
//                           onClick={handleRemoveProof}
//                           className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow transition"
//                         >
//                           <X size={13} />
//                         </button>
//                       </div>
//                       {uploaded && (
//                         <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center gap-1.5 py-1.5">
//                           <CheckCircle2 size={12} className="text-white" />
//                           <p className="text-[11px] text-white font-bold">Berhasil diunggah!</p>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleFileChange}
//                   />

//                   {/* Error */}
//                   <AnimatePresence>
//                     {uploadError && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2"
//                       >
//                         <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
//                         <p className="text-[11px] text-red-500 font-medium">{uploadError}</p>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   {/* Tombol Upload */}
//                   {proofFile && !uploaded && (
//                     <motion.button
//                       initial={{ opacity: 0, y: 4 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={handleUpload}
//                       disabled={uploadingProof}
//                       className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold hover:shadow-md hover:shadow-emerald-400/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
//                     >
//                       {uploadingProof ? (
//                         <>
//                           <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                           Mengunggah...
//                         </>
//                       ) : (
//                         <>
//                           <ImageIcon size={13} /> Unggah Bukti Sekarang
//                         </>
//                       )}
//                     </motion.button>
//                   )}

//                   {/* Sukses */}
//                   <AnimatePresence>
//                     {uploaded && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5"
//                       >
//                         <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
//                         <p className="text-xs text-emerald-600 font-medium">
//                           Bukti berhasil diunggah! Admin akan memverifikasi pembayaranmu.
//                         </p>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   {/* Info non-cash */}
//                   {!uploaded && (
//                     <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-600 leading-relaxed">
//                       Upload bukti transfer setelah melakukan pembayaran. Booking akan dikonfirmasi setelah admin memverifikasi.
//                     </div>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       {/* CTA */}
//       <div className="flex gap-3 pt-1">
//         <button
//           onClick={onBack}
//           className="w-1/3 border border-gray-200 text-gray-500 py-3 sm:py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1"
//         >
//           <ChevronLeft size={14} />
//           Kembali
//         </button>
//         <motion.button
//           whileTap={canProceed ? { scale: 0.98 } : {}}
//           onClick={onNext}
//           disabled={!canProceed}
//           className="w-2/3 bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:shadow-xl enabled:hover:shadow-blue-500/30 enabled:hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
//         >
//           {isCash ? "Selesai, Lanjut" : uploaded ? "Lanjut ke Konfirmasi" : "Upload Bukti Dulu"}
//           <ChevronRight size={14} />
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }