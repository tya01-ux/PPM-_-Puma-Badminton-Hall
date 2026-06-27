import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { usePromoStore, type Promo } from "../../../store/usePromoStore";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function PromoIndex() {
  const { promos, loading, fetchPromos, addPromo, updatePromo, deletePromo } = usePromoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState({
    code: "", discount: 0, isPercent: true,
    maxDiscount: 0, startDate: "", endDate: "", isActive: true,
  });

  useEffect(() => { fetchPromos(); }, []);

  const resetForm = () => {
    setForm({ code: "", discount: 0, isPercent: true, maxDiscount: 0, startDate: "", endDate: "", isActive: true });
    setEditing(null);
    setIsOpen(false);
  };

  const openEdit = (p: Promo) => {
    setEditing(p);
    setForm({
      code: p.code, discount: p.discount, isPercent: p.isPercent,
      maxDiscount: p.maxDiscount ?? 0,
      startDate: p.startDate.slice(0, 10),
      endDate: p.endDate.slice(0, 10),
      isActive: p.isActive,
    });
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, discount: Number(form.discount), maxDiscount: Number(form.maxDiscount) || undefined };
      if (editing) {
        await updatePromo(editing.id, payload);
        alert("Promo diupdate!");
      } else {
        await addPromo(payload as any);
        alert("Promo ditambahkan!");
      }
      resetForm();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus promo ini?")) return;
    try { await deletePromo(id); } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-4 md:p-6 rounded-[2.5rem]">
      <div className="w-full bg-white border border-slate-200/90 p-6 md:p-8 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl tracking-tight">Daftar Promo</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Kelola kode promo, diskon, dan periode berlaku.</p>
          </div>
          <button onClick={() => setIsOpen(true)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={14} /> Tambah Promo
          </button>
        </div>

        {/* ── TABLE ── */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold text-sm">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4 text-center">No</th>
                  <th className="py-4 px-4">Kode Promo</th>
                  <th className="py-4 px-4">Diskon</th>
                  <th className="py-4 px-4">Tipe</th>
                  <th className="py-4 px-4">Min. Pembelian</th>
                  <th className="py-4 px-4">Berlaku Hingga</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {promos.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-center text-slate-400 font-bold">{i + 1}</td>
                    <td className="py-4 px-4 font-black text-blue-600">{p.code}</td>
                    <td className="py-4 px-4 font-semibold">
                      {p.isPercent ? `${p.discount}%` : `Rp ${p.discount.toLocaleString("id-ID")}`}
                    </td>
                    <td className="py-4 px-4 text-slate-500">{p.isPercent ? "Persentase" : "Nominal"}</td>
                    <td className="py-4 px-4 text-slate-500">
                      {p.maxDiscount ? `Rp ${p.maxDiscount.toLocaleString("id-ID")}` : "-"}
                    </td>
                    <td className="py-4 px-4 text-slate-500">{formatDate(p.endDate)}</td>
                    <td className="py-4 px-4">
                      {p.isActive
                        ? <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">Aktif</span>
                        : <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-md bg-rose-50 text-rose-600 border border-rose-100">Nonaktif</span>}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL TAMBAH / EDIT ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
              <h3 className="font-black text-slate-900">{editing ? "Edit Promo" : "Tambah Promo Baru"}</h3>
              <button onClick={resetForm}><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <input type="text" placeholder="Kode Promo (e.g. RAMADAN10)" value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-blue-400 uppercase" />

              <div className="flex gap-3">
                <input type="number" placeholder="Nilai Diskon" value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                  className="flex-1 rounded-xl border p-3 text-sm outline-none focus:border-blue-400" />
                <select value={form.isPercent ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, isPercent: e.target.value === "true" })}
                  className="rounded-xl border p-3 text-sm font-bold text-slate-700 outline-none cursor-pointer">
                  <option value="true">%</option>
                  <option value="false">Rp</option>
                </select>
              </div>

              {form.isPercent && (
                <input type="number" placeholder="Maks. Diskon (Rp)" value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                  className="w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-400" />
              )}

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Mulai</label>
                  <input type="date" value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Berakhir</label>
                  <input type="date" value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>

              {editing && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded" />
                  <span className="text-sm font-bold text-slate-700">Promo Aktif</span>
                </label>
              )}

              <button onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition">
                {editing ? "Simpan Perubahan" : "Tambah Promo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}