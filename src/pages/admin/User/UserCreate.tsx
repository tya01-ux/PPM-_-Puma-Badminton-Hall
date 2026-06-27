import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { UserPlus, ArrowLeft, Mail, Phone, User, Lock } from "lucide-react";
import { useUserStore } from "../../../store/useUserStore";

export default function UserCreate() {
  const navigate = useNavigate();
  const { addUser, fetchUsers, loading } = useUserStore(); // Menambahkan fetchUsers ke hooks

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "User",
    password: "", 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password) {
      alert("Password wajib diisi!");
      return;
    }

    try {
      await addUser(formData);
      await fetchUsers(); // ⚡️ Krusial: Ambil ulang data terbaru dari Railway agar halaman index langsung ter-update!
      alert("Pengguna baru berhasil dibuat dan disimpan ke database!");
      navigate("/admin/user"); 
    } catch (error: any) {
      console.error("Gagal membuat user baru:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan sistem saat menyimpan data.");
    }
  };

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-4 md:p-6 rounded-[2.5rem]">
      <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200/90 p-6 md:p-8 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md">
              <UserPlus size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight md:text-2xl">Tambah User Baru</h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Daftarkan akun hak akses baru ke dalam ekosistem aplikasi.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)} 
            className="self-start sm:self-auto rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            Kembali
          </button>
        </div>

        {/* FORM SECTION */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Nama Lengkap</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-500 placeholder:text-slate-400"
                placeholder="Masukkan nama lengkap user..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Alamat Email Resmi</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-500 placeholder:text-slate-400"
                placeholder="contoh: namauser@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Nomor Handphone (WhatsApp)</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-500 placeholder:text-slate-400"
                placeholder="Contoh: 081234xxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Kata Sandi / Password Akun</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-500 placeholder:text-slate-400"
                placeholder="Masukkan kata sandi akun baru..."
              />
            </div>
          </div>

          {/* ROLE SELECTOR GRID */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Pilih Tingkatan Akun / Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setFormData({ ...formData, role: "User" })}
                className={`border rounded-xl p-4 cursor-pointer transition flex items-start gap-3 ${
                  formData.role === "User" ? "border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={formData.role === "User"}
                  onChange={() => setFormData({ ...formData, role: "User" })}
                  className="mt-1 accent-blue-600"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Role Member / User</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Akses terbatas standar. Hanya bisa melakukan order, sewa lapangan, dan melihat jadwal.</p>
                </div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, role: "Admin" })}
                className={`border rounded-xl p-4 cursor-pointer transition flex items-start gap-3 ${
                  formData.role === "Admin" ? "border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/20" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={formData.role === "Admin"}
                  onChange={() => setFormData({ ...formData, role: "Admin" })}
                  className="mt-1 accent-rose-600"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Role Full Admin</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Akses penuh sistem. Berhak mengelola lapangan, memantau semua user, dan melihat laporan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-500 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-sm font-bold text-white shadow-sm transition flex items-center gap-2"
            >
              {loading ? "Menyimpan..." : "Simpan Pengguna"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}