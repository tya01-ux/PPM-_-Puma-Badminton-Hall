import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Edit2, Trash2 } from "lucide-react";
import { useUserStore } from "../../../store/useUserStore";

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "-";

export default function UserIndex() {
  const navigate = useNavigate();
  const { users, loading, error, fetchUsers, deleteUser } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${name}"?`)) return;
    try {
      await deleteUser(id);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchesRole =
      roleFilter === "Semua" || u.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-4 md:p-6 rounded-[2.5rem]">
      <div className="w-full bg-white border border-slate-200/90 p-6 md:p-8 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl tracking-tight">Daftar Pengguna</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Kelola akun, hak akses, dan kontak pengguna.</p>
          </div>

          <button
            onClick={() => navigate("/admin/user/create")}
            className="self-start sm:self-auto rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white transition hover:bg-blue-700 shadow-sm flex items-center gap-2 tracking-wide"
          >
            <UserPlus size={14} className="stroke-[2.5]" />
            Tambah Pengguna
          </button>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <div className="relative w-full flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Cari nama / email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-[180px] rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-bold text-slate-600 outline-none transition focus:border-blue-500 cursor-pointer"
          >
            <option value="Semua">Semua Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        )}

        {/* ── TABLE ── */}
        {loading ? (
          <div className="w-full text-center py-20 text-slate-500 font-bold text-sm bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
            Memuat data pengguna dari server...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="w-full text-center py-16 text-slate-600 font-bold text-sm rounded-2xl border border-dashed border-slate-300 bg-slate-50/40 tracking-wide">
            Tidak ada pengguna yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center">No</th>
                  <th className="py-4 px-6">Nama</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">No. HP</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Tanggal Daftar</th>
                  <th className="py-4 px-6 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {filteredUsers.map((u, index) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-center text-slate-400 font-bold">{index + 1}</td>

                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs uppercase shrink-0">
                          {u.name?.charAt(0) ?? "?"}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600">{u.email}</td>
                    <td className="py-4 px-6 text-slate-500">{u.phone || "-"}</td>

                    <td className="py-4 px-6">
                      {u.role?.toLowerCase() === "admin" ? (
                        <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                          User
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-slate-500 text-xs">{formatDate(u.createdAt)}</td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/user/edit/${u.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition border border-transparent hover:border-blue-100"
                          title="Edit Pengguna"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={u.role?.toLowerCase() === "admin"}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title={u.role?.toLowerCase() === "admin" ? "Admin tidak bisa dihapus" : "Hapus Pengguna"}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}