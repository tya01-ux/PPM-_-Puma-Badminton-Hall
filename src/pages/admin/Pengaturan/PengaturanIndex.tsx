import { useEffect, useState } from "react";
import { Save, UploadCloud } from "lucide-react";
import { useVenueStore } from "../../../store/useVenueStore";

const BASE_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

export default function PengaturanIndex() {
  const { venue, loading, fetchVenue, updateVenue } = useVenueStore();

  const [form, setForm] = useState({
    name: "", address: "", phone: "", email: "", openHour: "", closeHour: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchVenue(); }, []);

  useEffect(() => {
    if (venue) {
      setForm({
        name: venue.name || "",
        address: venue.address || "",
        phone: venue.phone || "",
        email: venue.email || "",
        openHour: venue.openHour || "",
        closeHour: venue.closeHour || "",
      });
    }
  }, [venue]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) fd.append(key, val);
      });
      if (logoFile) fd.append("logo", logoFile);
      if (bannerFile) fd.append("banner", bannerFile);

      await updateVenue(fd);
      alert("Pengaturan berhasil disimpan!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !venue) {
    return (
      <div className="w-full text-center py-20 text-slate-500 font-bold text-sm">
        Memuat pengaturan venue...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 p-4 md:p-6 rounded-[2.5rem]">
      <div className="w-full bg-white border border-slate-200/90 p-6 md:p-8 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl tracking-tight">Pengaturan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Profil venue, kontak, dan tampilan halaman publik.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── PROFIL VENUE ── */}
          <div>
            <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">Profil Venue</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Venue</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Alamat</label>
                <input type="text" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">No. Telepon</label>
                <input type="text" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Jam Buka</label>
                  <input type="time" value={form.openHour}
                    onChange={(e) => setForm({ ...form, openHour: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Jam Tutup</label>
                  <input type="time" value={form.closeHour}
                    onChange={(e) => setForm({ ...form, closeHour: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* ── LOGO & BANNER ── */}
          <div>
            <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">Logo & Banner</h3>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 mb-2 block">Logo Venue</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {logoFile ? (
                    <img src={URL.createObjectURL(logoFile)} alt="Logo" className="w-full h-full object-contain" />
                  ) : venue?.logo ? (
                    <img src={`${BASE_URL}${venue.logo}`} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400">No Logo</span>
                  )}
                </div>
                <label className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center gap-2">
                  <UploadCloud size={14} /> Ubah Logo
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-2 block">Banner</label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center overflow-hidden mb-3">
                {bannerFile ? (
                  <img src={URL.createObjectURL(bannerFile)} alt="Banner" className="w-full h-full object-cover" />
                ) : venue?.banner ? (
                  <img src={`${BASE_URL}${venue.banner}`} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">No Banner</span>
                )}
              </div>
              <label className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center gap-2 w-fit">
                <UploadCloud size={14} /> Ubah Banner
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:bg-slate-300 transition flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}