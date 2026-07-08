import { motion } from "framer-motion";
import { PartyPopper, Receipt, Home, MessageCircle, Calendar, Clock, Tag, MapPin, Info } from "lucide-react";
import type { BookingData } from "../../pages/Booking";

interface Props {
  bookingData: BookingData;
  bookingResult: any;
  onLihatRiwayat: () => void;
}

export default function StepBookingBerhasil({ bookingData, bookingResult, onLihatRiwayat }: Props) {
  const subtotal = bookingData.courtPrice * bookingData.durasi;
  const biayaLayanan = subtotal > 0 ? 2000 : 0;
  const total = subtotal + biayaLayanan;

  const isConfirmed = bookingResult?.payment?.status === "confirmed";
  const statusLabel = isConfirmed ? "Terkonfirmasi" : "Menunggu Pembayaran";
  const statusColor = isConfirmed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600";

  const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex justify-between items-start gap-3">
      <span className="flex items-center gap-1.5 text-gray-400 text-xs">{icon} {label}</span>
      <span className="text-sm font-medium text-[#001845] text-right">{value}</span>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6 w-full">
      <div className="lg:col-span-2 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-300/40"
          >
            <PartyPopper className="text-white" size={28} />
          </motion.div>

          <h2 className="font-bold text-lg text-[#001845] mb-1">Booking Berhasil!</h2>
          <p className="text-sm text-gray-400 mb-6">
            {isConfirmed ? "Terima kasih, booking kamu sudah dikonfirmasi." : "Selesaikan pembayaran sebelum waktu berakhir."}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2.5">
            <Row icon={<Receipt size={13} />} label="Kode Booking" value={bookingResult?.bookingCode ?? "—"} />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Status</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>{statusLabel}</span>
            </div>
            <Row icon={<MapPin size={13} />} label="Lapangan" value={bookingData.courtName} />
            <Row
              icon={<Calendar size={13} />}
              label="Tanggal"
              value={bookingData.date ? new Date(bookingData.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
            />
            <Row icon={<Clock size={13} />} label="Waktu" value={bookingData.startTime ? `${bookingData.startTime.slice(0, 5)} - ${bookingData.endTime.slice(0, 5)} (${bookingData.durasi} Jam)` : "-"} />
            {bookingData.kodePromo && <Row icon={<Tag size={13} />} label="Kode Promo" value={bookingData.kodePromo} />}
            <div className="border-t border-gray-200 pt-2.5 flex justify-between items-center">
              <span className="font-bold text-[#001845] text-sm">Total Pembayaran</span>
              <span className="font-bold text-[#0050FF]">Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {!isConfirmed && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-left flex gap-2.5">
              <Info size={15} className="text-[#0050FF] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Langkah selanjutnya: admin akan memverifikasi bukti pembayaranmu. Status booking akan berubah menjadi
                <span className="font-semibold"> "Terkonfirmasi" </span> setelah pembayaran diverifikasi.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={onLihatRiwayat}
              className="flex-1 bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Lihat Booking Saya
            </button>
            <a
              href="/"
              className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Home size={14} /> Kembali ke Beranda
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bantuan */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sticky top-6">
          <h3 className="font-bold text-[#001845] mb-3 flex items-center gap-2">
            <MessageCircle size={16} className="text-[#0050FF]" /> Butuh bantuan?
          </h3>
          <p className="text-xs text-gray-400 mb-3">Hubungi kami via WhatsApp jika ada kendala pembayaran.</p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-[#0050FF] hover:underline">
            <Clock size={14} /> 0812 3456 7890
          </a>
        </div>
      </div>
    </div>
  );
}