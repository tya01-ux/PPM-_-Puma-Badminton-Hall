import { useEffect, useMemo } from "react";
import {
  LayoutGrid,
  Landmark,
  DoorOpen,
  UtensilsCrossed,
  Droplets,
  Car,
  Wifi,
  Video,
  Calendar,
  CheckCircle2,
  Lock,
  Wrench,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCourtStore } from "../../store/useCourtBoking";
import { useBookingStore } from "../../store/useBookingStore";

const facilities = [
  { icon: LayoutGrid, label: "5 Lapangan", desc: "Tersedia 5 lapangan berstandar untuk berbagai kegiatan olahraga." },
  { icon: Landmark, label: "Mushola", desc: "Mushola bersih, nyaman, dan tenang untuk beribadah." },
  { icon: DoorOpen, label: "Ruang Ganti", desc: "Ruang ganti bersih dan nyaman dengan fasilitas lengkap." },
  { icon: UtensilsCrossed, label: "Kantin", desc: "Kantin bersih dengan berbagai pilihan menu lezat dan terjangkau." },
  { icon: Droplets, label: "Toilet Bersih", desc: "Toilet bersih dan terawat untuk kenyamanan pengunjung." },
  { icon: Car, label: "Area Parkir", desc: "Area parkir luas dan aman untuk kendaraan roda dua maupun roda empat." },
  { icon: Wifi, label: "Free Wi-Fi", desc: "Akses Wi-Fi gratis dan stabil di seluruh area fasilitas." },
  { icon: Video, label: "CCTV 24 Jam", desc: "Keamanan terjamin dengan sistem CCTV yang aktif 24 jam." },
];

type SlotStatus = "available" | "booked" | "maintenance";

const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

const slotRanges: Record<string, string> = {
  "08:00": "08:00 - 10:00",
  "10:00": "10:00 - 12:00",
  "12:00": "12:00 - 14:00",
  "14:00": "14:00 - 16:00",
  "16:00": "16:00 - 18:00",
  "18:00": "18:00 - 20:00",
  "20:00": "20:00 - 22:00",
};

// jam 18:00 ke atas dianggap malam -> pakai ikon bulan
function isEveningSlot(t: string) {
  return parseInt(t.split(":")[0], 10) >= 18;
}

const statusConfig: Record<
  SlotStatus,
  { label: string; icon: any; badge: string; text: string }
> = {
  available: { label: "Tersedia", icon: CheckCircle2, badge: "bg-emerald-50", text: "text-emerald-600" },
  booked: { label: "Booked", icon: Lock, badge: "bg-red-50", text: "text-red-500" },
  maintenance: { label: "Maintenance", icon: Wrench, badge: "bg-amber-50", text: "text-amber-500" },
};

// "YYYY-MM-DD" hari ini, dipakai buat nyusun Date lengkap tiap slot jam
function getTodayDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// cek apakah ada booking aktif (bukan cancelled) di court tsb yang menutupi jam slot ini
function isSlotBooked(
  slotTime: string,
  dateStr: string,
  courtId: number,
  bookings: { courtId: number; startAt: string; endAt: string; status: string }[]
) {
  const slotDate = new Date(`${dateStr}T${slotTime}:00`);
  return bookings.some((b) => {
    if (b.courtId !== courtId) return false;
    if (b.status === "cancelled") return false;
    const start = new Date(b.startAt);
    const end = new Date(b.endAt);
    return slotDate >= start && slotDate < end;
  });
}

export function FacilitiesSchedule() {
  const { courts, fetchCourts, loading: loadingCourts } = useCourtStore();
  const { bookings, fetchBookings, loading: loadingBookings } = useBookingStore();

  useEffect(() => {
    fetchCourts();
    fetchBookings();
  }, [fetchCourts, fetchBookings]);

  const today = useMemo(() => getTodayDateString(), []);

  // gabungin data court asli + hasil hitung status tiap slot berdasarkan booking hari ini
  const scheduleRows = useMemo(() => {
    return courts.map((court) => {
      const slots: SlotStatus[] = timeSlots.map((t) => {
        if (!court.isActive) return "maintenance";
        return isSlotBooked(t, today, court.id, bookings) ? "booked" : "available";
      });
      return { id: court.id, name: court.name, slots };
    });
  }, [courts, bookings, today]);

  const isLoading = loadingCourts || loadingBookings;

  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-col gap-14 md:gap-16">

        {/* ============ FASILITAS ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block bg-blue-500/10 text-[#0050FF] px-6 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em]">
            Fasilitas Kami
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-[#001845] leading-tight">
            Fasilitas Lengkap &amp; Nyaman
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-500 max-w-xl mx-auto">
            Berbagai fasilitas terbaik yang tersedia untuk mendukung kegiatan dan kenyamanan Anda.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5 mt-10 text-left">
            {facilities.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <span className="text-lg font-bold text-[#0050FF]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-6 h-0.5 rounded-full bg-[#0050FF] mt-2 mb-3" />
                <h4 className="font-bold text-[#001845] text-sm mb-1.5 relative z-10">
                  {f.label}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed relative z-10">
                  {f.desc}
                </p>

                {/* blob dekoratif pojok kanan bawah */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-blue-50 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          <button className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#0050FF] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#001845] transition-colors">
            Lihat Semua Fasilitas
          </button>
        </motion.div>

        {/* ============ JADWAL ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 md:p-7"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-[#001845]">
                  Jadwal Hari Ini
                </h3>
                <p className="text-xs md:text-sm text-slate-500">
                  Pilih lapangan dan lihat ketersediaan waktu secara mudah.
                </p>
              </div>
            </div>
            <button className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2.5 text-xs md:text-sm font-semibold text-[#0050FF] hover:bg-blue-100 transition-colors whitespace-nowrap">
              Lihat Semua Jadwal →
            </button>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-400">
              Memuat jadwal...
            </div>
          ) : scheduleRows.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              Belum ada data lapangan.
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-separate border-spacing-2 min-w-[760px]">
                <thead>
                  <tr>
                    <th className="text-left align-middle pb-1 pl-1">
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-3">
                        <LayoutGrid size={16} className="text-[#0050FF]" />
                        <span className="text-xs font-bold text-[#001845]">Lapangan</span>
                      </div>
                    </th>
                    {timeSlots.map((t) => {
                      const SlotIcon = isEveningSlot(t) ? Moon : Sun;
                      return (
                        <th key={t} className="align-middle pb-1">
                          <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <SlotIcon size={13} className={isEveningSlot(t) ? "text-indigo-400" : "text-amber-400"} />
                              <span className="text-xs font-bold text-[#001845]">{t}</span>
                            </div>
                            <span className="block text-[10px] text-slate-400 mt-0.5">
                              {slotRanges[t]}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((court) => (
                    <tr key={court.id}>
                      <td className="pl-1">
                        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-3.5 py-3.5 shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <LayoutGrid size={15} className="text-[#0050FF]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#001845] leading-tight whitespace-nowrap">
                              {court.name}
                            </p>
                            <p className="text-[11px] text-slate-400 leading-tight">Standard</p>
                          </div>
                        </div>
                      </td>
                      {court.slots.map((status, si) => {
                        const cfg = statusConfig[status];
                        const StatusIcon = cfg.icon;
                        return (
                          <td key={si}>
                            <div
                              className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-3.5 ${cfg.badge}`}
                            >
                              <StatusIcon size={13} className={cfg.text} />
                              <span className={`text-xs font-semibold whitespace-nowrap ${cfg.text}`}>
                                {cfg.label}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* LEGEND, bentuk pill bar */}
          <div className="flex justify-center mt-2">
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 rounded-2xl border border-slate-100 bg-slate-50/60 px-6 py-3.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span className="text-xs font-medium text-slate-600">Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={15} className="text-red-500" />
                <span className="text-xs font-medium text-slate-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench size={15} className="text-amber-500" />
                <span className="text-xs font-medium text-slate-600">Maintenance</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}