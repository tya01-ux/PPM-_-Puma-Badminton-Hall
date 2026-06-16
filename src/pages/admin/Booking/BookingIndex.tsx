import { useState } from "react";
import { CalendarDays, Clock3, Check, X, Search } from "lucide-react";
import { useBookingStore } from "../../../store/useBookingStore";

export default function BookingIndex() {
  const { bookings, approveBooking, cancelBooking } = useBookingStore();

  /* FILTER STATE */
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  /* FILTER LOGIC */
  const filteredBookings = bookings.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* STATS */
  const totalBooking = bookings.length;
  const pendingBooking = bookings.filter((i) => i.status === "Pending").length;
  const approvedBooking = bookings.filter((i) => i.status === "Approved").length;
  const cancelledBooking = bookings.filter((i) => i.status === "Cancelled").length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-slate-800 md:text-3xl">Booking Management</h1>
        <p className="text-sm text-slate-500">Kelola semua booking lapangan badminton dengan mudah.</p>
      </div>

      {/* STATISTICS */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard title="Total" value={totalBooking} icon={<CalendarDays size={22} />} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Pending" value={pendingBooking} icon={<Clock3 size={22} />} iconBg="bg-yellow-100" iconColor="text-yellow-500" />
        <StatCard title="Approved" value={approvedBooking} icon={<Check size={22} />} iconBg="bg-green-100" iconColor="text-green-500" />
        <StatCard title="Cancelled" value={cancelledBooking} icon={<X size={22} />} iconBg="bg-red-100" iconColor="text-red-500" />
      </section>

      {/* TABLE / MOBILE CARD */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* FILTER */}
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-4 md:p-6 lg:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pemesan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 lg:w-[180px]"
          >
            <option>Semua</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* MOBILE VIEW */}
        <div className="space-y-4 p-4 md:hidden">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <MobileBookingCard key={booking.id} booking={booking} approveBooking={approveBooking} cancelBooking={cancelBooking} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.15em] text-slate-500">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Pemesan</th>
                <th className="px-6 py-5">Court</th>
                <th className="px-6 py-5">Tanggal</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <DesktopRow key={booking.id} booking={booking} approveBooking={approveBooking} cancelBooking={cancelBooking} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">Tidak ada data ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon, iconBg, iconColor }: any) {
  return (
    <div className="group rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 md:text-sm">{title}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-800 md:text-3xl">{value}</h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl md:h-14 md:w-14 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function MobileBookingCard({ booking, approveBooking, cancelBooking }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400">#{booking.id}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-800">{booking.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{booking.court}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Tanggal</span>
          <span className="font-medium text-slate-700">{booking.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Jam</span>
          <span className="font-medium text-slate-700">{booking.time}</span>
        </div>
      </div>

      {booking.status === "Pending" && (
        <div className="mt-5 flex gap-3">
          <button onClick={() => approveBooking(booking.id)} className="flex-1 rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700">Approve</button>
          <button onClick={() => cancelBooking(booking.id)} className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700">Cancel</button>
        </div>
      )}
    </div>
  );
}

function DesktopRow({ booking, approveBooking, cancelBooking }: any) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-5 font-medium text-slate-500">#{booking.id}</td>
      <td className="px-6 py-5">
        <div>
          <h3 className="font-semibold text-slate-800">{booking.name}</h3>
          <p className="text-sm text-slate-400">Puma Member</p>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">{booking.court}</span>
      </td>
      <td className="px-6 py-5 text-slate-600">{booking.date}</td>
      <td className="px-6 py-5">
        <StatusBadge status={booking.status} />
      </td>
      <td className="px-6 py-5">
        {booking.status === "Pending" ? (
          <div className="flex gap-2">
            <button onClick={() => approveBooking(booking.id)} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">Approve</button>
            <button onClick={() => cancelBooking(booking.id)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">Cancel</button>
          </div>
        ) : (
          <span className="text-sm italic text-slate-300">No Action</span>
        )}
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${status === "Approved" ? "bg-green-100 text-green-700" : status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>
      {status}
    </span>
  );
}

function EmptyState() {
  return <div className="py-10 text-center text-sm text-slate-400">Tidak ada data ditemukan</div>;
}