import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useBookingStore } from "../../store/useBookingStore";

export default function UserProfile() {
  const { user, logout } = useAuthStore();
  const { bookings, fetchBookings } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Hanya tampilkan booking milik user yang sedang login
  const myBookings = bookings.filter((b) => b.userId === user?.id);

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-black text-slate-800 mb-6">Profil Saya</h1>
      
      {/* Informasi Akun */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="font-bold text-lg mb-4">Data Akun</h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-slate-500 text-sm">Nama: <span className="font-semibold text-slate-800">{user?.name}</span></p>
          <p className="text-slate-500 text-sm">Email: <span className="font-semibold text-slate-800">{user?.email}</span></p>
        </div>
        <button onClick={logout} className="mt-6 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-rose-100">
          Logout
        </button>
      </div>

      {/* Riwayat Booking */}
      <h2 className="font-bold text-lg mb-4">Riwayat Booking</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {myBookings.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left">Lapangan</th>
                <th className="p-4 text-left">Tanggal</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myBookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-4">{b.court?.name}</td>
                  <td className="p-4">{b.bookingDate}</td>
                  <td className="p-4 uppercase font-bold text-[10px]">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-slate-400">Belum ada riwayat booking.</p>
        )}
      </div>
    </div>
  );
}