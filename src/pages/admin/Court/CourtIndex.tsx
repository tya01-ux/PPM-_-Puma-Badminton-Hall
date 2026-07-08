import { useState, useEffect, type ComponentType, type Dispatch, type SetStateAction } from "react";
import { Search, Layers, Trash2, Edit2 } from "lucide-react"; 
import { useCourtStore } from "../../../store/useCourtBoking"; 
import type { Court } from "../../../store/useCourtBoking";
import CourtCreate from "./CourtCreate"; 
import CourtEdit from "./CourtEdit"; 

const CourtCreateComponent = CourtCreate as ComponentType<{ setIsOpen: Dispatch<SetStateAction<boolean>> }>;

export default function CourtIndex() {
  const { courts, loading, fetchCourts, deleteCourt } = useCourtStore(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isOpen, setIsOpen] = useState(false);
  
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus lapangan "${name}"?`)) {
      try {
        await deleteCourt(id);
      } catch (error) {
        console.error("Gagal menghapus lapangan:", error);
      }
    }
  };

  const filteredCourts = courts.filter((court) => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "Semua" || 
      (statusFilter === "Tersedia" && court.isActive === true) ||
      (statusFilter === "Perawatan" && court.isActive === false);

    return matchesSearch && matchesStatus;
  });

  return (
    /* LAYER 1: Kontainer dasar pudar */
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-4 md:p-6 rounded-[2.5rem]">
        
      {/* LAYER 2: Boks utama putih solid */}
      <div className="w-full bg-white border border-slate-200/90 p-6 md:p-8 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl tracking-tight">Daftar Court</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Kelola ketersediaan, harga sewa, dan kondisi operasional setiap lapangan.</p>
          </div>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="self-start sm:self-auto rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white transition hover:bg-blue-700 shadow-sm flex items-center gap-2 tracking-wide"
          >
            <Layers size={14} className="stroke-[2.5]" />
            Tambah Court
          </button>
        </div>

        {/* FILTER BAR PANEL */}
        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <div className="relative w-full flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Cari user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-[180px] rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-bold text-slate-600 outline-none transition focus:border-blue-500 cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Perawatan">Perawatan</option>
          </select>
        </div>

        {/* RENDER KONTEN TABEL */}
        {loading ? (
          <div className="w-full text-center py-20 text-slate-500 font-bold text-sm bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
            Memuat data lapangan dari server Railway...
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="w-full text-center py-16 text-slate-600 font-bold text-sm rounded-2xl border border-dashed border-slate-300 bg-slate-50/40 tracking-wide">
            Tidak ada lapangan yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center">No</th>
                  <th className="py-4 px-6">Nama Court</th>
                  <th className="py-4 px-6">Jenis</th>
                  <th className="py-4 px-6">Harga / Jam</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {filteredCourts.map((court, index) => {
                  // Penentuan warna lapangan mini berbasis CSS sesuai logic bawaanmu (fallback kalau tidak ada gambar)
                  let courtColor = "blue";
                  if (court.name.toLowerCase().includes("5") || court.name.toLowerCase().includes("6") || court.name.toLowerCase().includes("7")) {
                    courtColor = "green";
                  }
                  if (!court.isActive) {
                    courtColor = "slate";
                  }

                  return (
                    <tr key={court.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Kolom No */}
                      <td className="py-4 px-6 text-center text-slate-400 font-bold">{index + 1}</td>
                      
                      {/* Kolom Nama Court + Miniatur Lapangan */}
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-4">
                          {/* Miniatur Lapangan — pakai foto asli kalau ada, fallback gradient kalau kosong/rusak */}
                          <div className="w-14 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                            {court.image ? (
                              <img
                                src={court.image}
                                alt={court.name}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                  const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-full h-full rounded relative border border-white/60 shadow-inner items-center justify-center
                                ${court.image ? "hidden" : "flex"}
                                ${courtColor === "blue" ? "bg-gradient-to-b from-blue-600 to-blue-700" : ""}
                                ${courtColor === "green" ? "bg-gradient-to-b from-emerald-600 to-emerald-700" : ""}
                                ${courtColor === "slate" ? "bg-gradient-to-b from-slate-500 to-slate-600" : ""}
                              `}
                            >
                              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/40 -translate-y-1/2" />
                              <div className="absolute inset-x-2 top-1 bottom-1 border border-white/20 pointer-events-none" />
                            </div>
                          </div>
                          <span>{court.name}</span>
                        </div>
                      </td>

                      {/* Kolom Jenis */}
                      <td className="py-4 px-6 text-slate-500">{court.type}</td>

                      {/* Kolom Harga */}
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        Rp {court.price.toLocaleString("id-ID")}
                      </td>

                      {/* Kolom Status Badge */}
                      <td className="py-4 px-6">
                        {court.isActive ? (
                          <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Kolom Aksi */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingCourt(court)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition border border-transparent hover:border-blue-100"
                            title="Edit Lapangan"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(court.id, court.name)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-100"
                            title="Hapus Lapangan"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AREA MODAL */}
      {isOpen && <CourtCreateComponent setIsOpen={setIsOpen} />}
      {editingCourt && <CourtEdit setIsOpen={() => setEditingCourt(null)} court={editingCourt} />}
    </div>
  );
}