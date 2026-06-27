import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useCourtStore } from "../../../store/useCourtBoking"; 
import type { Court } from "../../../store/useCourtBoking";
import { X, Layers, DollarSign, AlignLeft, Activity, Info } from "lucide-react";

interface CourtEditProps {
  setIsOpen: Dispatch<SetStateAction<boolean>> | ((v: boolean) => void);
  court: Court; 
}

export default function CourtEdit({ setIsOpen, court }: CourtEditProps) {
  const updateCourt = useCourtStore((state) => state.updateCourt);

  const [name, setName] = useState(court.name);
  const [type, setType] = useState(court.type);
  const [price, setPrice] = useState(court.price.toString());
  const [isActive, setIsActive] = useState<boolean>(court.isActive);
  const [description, setDescription] = useState(court.description || "");

  useEffect(() => {
    if (court) {
      setName(court.name);
      setType(court.type);
      setPrice(court.price.toString());
      setIsActive(court.isActive);
      setDescription(court.description || "");
    }
  }, [court]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateCourt(court.id, {
      name,
      type,
      price: Number(price),
      isActive,
      description,
      image: court.image || "" 
    });

    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md p-6 md:p-7 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-5 top-5 p-1.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-100 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="mb-6 pr-8">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Edit Data Lapangan</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Ubah rincian informasi, harga sewa, atau status operasional lapangan.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              <Layers size={12} className="text-slate-400" /> Nama Lapangan
            </label>
            <input
              type="text"
              placeholder="Contoh: Lapangan Utama A (Vinyl)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              <Info size={12} className="text-slate-400" /> Tipe Lapangan
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-semibold text-slate-600 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_auto] bg-[right_14px_center] bg-no-repeat"
              required
            >
              <option value="">-- Pilih Tipe --</option>
              <option value="Vinyl">Matras Vinyl</option>
              <option value="Interlock">Interlock Polypropylene</option>
              <option value="Sintetis">Rumput Sintetis</option>
              <option value="Semen">Semen / Hard Court</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                <DollarSign size={12} className="text-slate-400" /> Harga / Jam
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  placeholder="85000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                <Activity size={12} className="text-slate-400" /> Status Operasional
              </label>
              <select
                value={String(isActive)}
                onChange={(e) => setIsActive(e.target.value === "true")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-semibold text-slate-600 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_auto] bg-[right_14px_center] bg-no-repeat"
                required
              >
                <option value="true">Tersedia (Ready)</option>
                <option value="false">Perbaikan (Maintenance)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              <AlignLeft size={12} className="text-slate-400" /> Deskripsi / Fasilitas
            </label>
            <textarea
              placeholder="Fasilitas lapangan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-medium text-slate-700 outline-none transition h-24 resize-none placeholder:text-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
              required
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 py-2.5 text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition-all shadow-sm shadow-slate-900/10"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}