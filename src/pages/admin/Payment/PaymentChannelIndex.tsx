import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { usePaymentStore, type PaymentChannel } from "../../../store/usePaymentStore";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

export default function PaymentChannelIndex() {
  const { channels, fetchChannels, addChannel, updateChannel, deleteChannel } = usePaymentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentChannel | null>(null);

  // ── FORM STATE ──
  const [form, setForm] = useState({ name: "", type: "transfer", accountNumber: "", accountName: "" });
  const [qrFile, setQrFile] = useState<File | null>(null);

  useEffect(() => { fetchChannels(); }, []);

  const resetForm = () => {
    setForm({ name: "", type: "transfer", accountNumber: "", accountName: "" });
    setQrFile(null);
    setEditing(null);
    setIsOpen(false);
  };

  const openEdit = (ch: PaymentChannel) => {
    setEditing(ch);
    setForm({ name: ch.name, type: ch.type, accountNumber: ch.accountNumber ?? "", accountName: ch.accountName ?? "" });
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("type", form.type);
    if (form.accountNumber) fd.append("accountNumber", form.accountNumber);
    if (form.accountName) fd.append("accountName", form.accountName);
    if (qrFile) fd.append("qrImage", qrFile);

    try {
      if (editing) {
        await updateChannel(editing.id, fd);
        alert("Channel diupdate!");
      } else {
        await addChannel(fd);
        alert("Channel ditambahkan!");
      }
      resetForm();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Nonaktifkan "${name}"?`)) return;
    try {
      await deleteChannel(id);
    } catch (err: any) { alert(err.message); }
  };

  const typeLabel = { transfer: "Transfer Bank", qris: "E-Wallet (QRIS)", cash: "Tunai" };

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-4 md:p-6 rounded-[2.5rem]">
      <div className="w-full bg-white border border-slate-200/90 p-6 md:p-8 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl tracking-tight">Metode Pembayaran</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Kelola rekening, e-wallet, QRIS, dan tunai.</p>
          </div>
          <button onClick={() => setIsOpen(true)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={14} /> Tambah Metode
          </button>
        </div>

        {/* ── TABLE ── */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4 text-center">No</th>
                <th className="py-4 px-4">Nama Metode</th>
                <th className="py-4 px-4">Tipe</th>
                <th className="py-4 px-4">Nomor Rekening / No HP</th>
                <th className="py-4 px-4">Atas Nama</th>
                <th className="py-4 px-4">QR Code</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {channels.map((ch, i) => (
                <tr key={ch.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 text-center text-slate-400 font-bold">{i + 1}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{ch.name}</td>
                  <td className="py-4 px-4 text-slate-500">{typeLabel[ch.type]}</td>
                  <td className="py-4 px-4 text-slate-500">{ch.accountNumber ?? "-"}</td>
                  <td className="py-4 px-4 text-slate-500">{ch.accountName ?? "-"}</td>

                  {/* ── KOLOM QR ── */}
                  <td className="py-4 px-4">
                    {ch.qrImage ? (
                      <img src={`${BASE_URL}${ch.qrImage}`} alt="QR"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    ) : <span className="text-slate-400 text-xs">-</span>}
                  </td>

                  <td className="py-4 px-4">
                    {ch.isActive
                      ? <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">Aktif</span>
                      : <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-500 border border-slate-200">Nonaktif</span>}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(ch)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(ch.id, ch.name)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL TAMBAH / EDIT ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
              <h3 className="font-black text-slate-900">{editing ? "Edit Metode" : "Tambah Metode Pembayaran"}</h3>
              <button onClick={resetForm}><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <input type="text" placeholder="Nama (BRI, DANA, dll)" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-400" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-400 font-bold text-slate-700 cursor-pointer">
                <option value="transfer">Transfer Bank</option>
                <option value="qris">E-Wallet / QRIS</option>
                <option value="cash">Tunai</option>
              </select>
              <input type="text" placeholder="No. Rekening / No. HP" value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-400" />
              <input type="text" placeholder="Atas Nama" value={form.accountName}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-blue-400" />

              {/* UPLOAD QR */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Upload QR Code (opsional)</label>
                <input type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
              </div>

              <button onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition">
                {editing ? "Simpan Perubahan" : "Tambah Metode"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}