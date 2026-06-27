import type { BookingData } from "../../pages/Booking";

interface Props {
  bookingData: BookingData;
  currentStep: number;
  steps: { label: string; desc: string }[];
}

export default function BookingSidebar({ bookingData, currentStep, steps }: Props) {
  const subtotal = bookingData.courtPrice * bookingData.durasi;
  const biayaLayanan = subtotal > 0 ? 2000 : 0;
  const total = subtotal + biayaLayanan;

  return (
    <div className="sticky top-6 space-y-4">
      {/* Ringkasan Booking */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <h3 className="font-bold text-[#001845] mb-4">Ringkasan Booking</h3>

        {bookingData.courtId ? (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#001845] to-[#0050FF] flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{bookingData.courtName}</p>
              <p className="text-xs text-gray-400">Badminton</p>
              <p className="text-xs font-medium text-[#0050FF]">
                Rp {bookingData.courtPrice.toLocaleString("id-ID")} / jam
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">Belum ada lapangan dipilih</p>
        )}

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal</span>
            <span className={bookingData.date ? "font-medium text-gray-800" : "text-gray-400"}>
              {bookingData.date
                ? new Date(bookingData.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Belum dipilih"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Waktu</span>
            <span className={bookingData.startTime ? "font-medium text-gray-800" : "text-gray-400"}>
              {bookingData.startTime
                ? `${bookingData.startTime.slice(0, 5)} - ${bookingData.endTime.slice(0, 5)}`
                : "Belum dipilih"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Durasi</span>
            <span className={bookingData.startTime ? "font-medium text-gray-800" : "text-gray-400"}>
              {bookingData.startTime ? `${bookingData.durasi} Jam` : "-"}
            </span>
          </div>
        </div>

        <hr className="my-4 border-gray-100" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span className="flex items-center gap-1">
              Biaya Layanan
              <span className="text-gray-300 text-xs">ⓘ</span>
            </span>
            <span>Rp {biayaLayanan.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <hr className="my-4 border-gray-100" />

        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-800">Total</span>
          <span className="font-bold text-lg text-[#0050FF]">Rp {total.toLocaleString("id-ID")}</span>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex gap-2">
          <span>ℹ️</span>
          <span>Waktu akan dikunci selama proses pembayaran berlangsung.</span>
        </div>
      </div>

      {/* Langkah Booking */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <h3 className="font-bold text-[#001845] mb-4">Langkah Booking</h3>
        <div className="space-y-4">
          {steps.map((s, i) => {
            const stepNum = i + 1;
            const isActive = currentStep === stepNum;
            const isDone = currentStep > stepNum;
            return (
              <div key={s.label} className="flex items-start gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isActive
                      ? "bg-[#0050FF] text-white"
                      : isDone
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? "✓" : stepNum}
                </span>
                <div>
                  <p className={`text-sm font-medium ${isActive ? "text-[#001845]" : "text-gray-600"}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}