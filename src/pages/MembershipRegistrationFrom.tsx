import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  QrCode,
  Wallet,
  Building2,
  UploadCloud,
  FileImage,
  X,
  ShieldCheck,
  Zap,
  CalendarCheck,
  ClipboardCheck,
  Crown,
  Phone,
  Loader2,
  CheckCircle2,
  Pencil,
  Save,
  CreditCard,
} from "lucide-react";
import { useMembershipStore, type Membership } from "../store/useMembershipStore";
import { useMembershipRegistrationStore } from "../store/useMembershipRegistrationStore";
import { usePaymentStore, type PaymentChannel } from "../store/usePaymentStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const TYPE_ICON: Record<string, React.ReactNode> = {
  qris: <QrCode size={15} />,
  transfer: <Building2 size={15} />,
  cash: <Wallet size={15} />,
};

const TYPE_LABEL: Record<string, string> = {
  qris: "QRIS",
  transfer: "Transfer Bank",
  cash: "Tunai",
};

export default function MembershipRegistrationForm() {
  const { id } = useParams();
  const location = useLocation() as { state?: { plan?: Membership } };
  const navigate = useNavigate();

  const { memberships, fetchMemberships } = useMembershipStore();
  const { channels, fetchChannels } = usePaymentStore();
  const { registerWithProof } = useMembershipRegistrationStore();
  const { user, login } = useAuthStore();
  const { updateOwnProfile } = useUserStore();

  const [plan, setPlan] = useState<Membership | undefined>(location.state?.plan);

  // Biodata (bisa di-edit meski sudah login)
  const [editingBiodata, setEditingBiodata] = useState(false);
  const [savingBiodata, setSavingBiodata] = useState(false);
  const [biodataError, setBiodataError] = useState<string | null>(null);
  const [biodataSaved, setBiodataSaved] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState(user?.name || "");
  const [noWhatsapp, setNoWhatsapp] = useState((user as any)?.phone || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    setNamaLengkap(user?.name || "");
    setNoWhatsapp((user as any)?.phone || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSaveBiodata = async () => {
    if (!user) return;
    setBiodataError(null);
    setBiodataSaved(false);
    setSavingBiodata(true);
    try {
      // ✅ pakai endpoint self-update (bukan updateUser yang admin-only)
      const updatedFromServer = await updateOwnProfile({
        name: namaLengkap,
        email,
        phone: noWhatsapp,
      });

      const updatedUser = { ...user, ...updatedFromServer };
      login(updatedUser as any);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setBiodataSaved(true);
      setEditingBiodata(false);
    } catch (err: any) {
      setBiodataError(err.message || "Gagal menyimpan perubahan data diri.");
    } finally {
      setSavingBiodata(false);
    }
  };

  // Payment channel (pakai data asli dari usePaymentStore, sama seperti BookingFlow)
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchChannels();
    if (!plan) fetchMemberships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!plan && memberships.length) {
      const found = memberships.find((m) => String(m.id) === id);
      if (found) setPlan(found);
    }
  }, [memberships, id, plan]);

  useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels.find((c) => c.isActive) ?? channels[0]);
    }
  }, [channels]);

  useEffect(() => {
    setFile(null);
    setPreviewUrl(null);
  }, [selectedChannel]);

  const isCash = selectedChannel?.type === "cash";
  const needsProof = !isCash;

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
      setError("Format file harus JPG, PNG, atau PDF.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB.");
      return;
    }
    setError(null);
    setFile(f);
    setPreviewUrl(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!plan) return;
    if (!agree) {
      setError("Setujui syarat & ketentuan dulu sebelum lanjut.");
      return;
    }
    if (!selectedChannel) {
      setError("Pilih metode pembayaran dulu.");
      return;
    }
    if (needsProof && !file) {
      setError("Upload bukti pembayaran dulu ya.");
      return;
    }
    try {
      setSubmitting(true);
      await registerWithProof(
        {
          membershipId: plan.id,
          paymentMethod: selectedChannel.type,
          paymentChannelId: selectedChannel.id,
          notes: notes || undefined,
        },
        file ?? undefined
      );
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim pendaftaran, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-sm">
        Memuat data paket...
      </div>
    );
  }

  return (
    <section className="bg-slate-50 min-h-screen relative">
      {/* MODAL: PENDAFTARAN TERKIRIM (menunggu approval admin) */}
      {success && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          {/* backdrop gelap — klik luar buat nutup & balik ke halaman membership */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => navigate("/membership")}
          />

          {/* modal card */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
              <Loader2 size={30} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Pendaftaran Terkirim</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Pendaftaran membership{" "}
              <span className="font-semibold text-slate-700">{plan.name}</span> kamu berhasil
              dikirim. Status kamu sekarang{" "}
              <span className="font-semibold text-amber-600">Menunggu Persetujuan Admin</span>,
              silakan menunggu untuk diaktivasi. Prosesnya biasanya kurang dari 1x24 jam.
            </p>
            <button
              onClick={() => navigate("/membership")}
              className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              Kembali ke Membership
            </button>
          </div>
        </div>
      )}
      {/* HERO */}
      <div className="bg-gradient-to-r from-[#001845] to-[#1741B6] pt-20 md:pt-24 pb-10 md:pb-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-blue-100 text-sm hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Pendaftaran Member {plan.name}
          </h1>
          <p className="mt-2 text-blue-100 text-sm md:text-base max-w-lg">
            Isi data, pilih paket & metode pembayaran untuk mendaftar membership Anda.
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6 md:-mt-8 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: FORM STEPS */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: DATA DIRI (editable) */}
          <StepCard
            step={1}
            title="Data Diri"
            desc="Data diambil dari akun kamu. Bisa diubah kalau ada yang perlu diperbarui."
            action={
              !editingBiodata ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingBiodata(true);
                    setBiodataSaved(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <Pencil size={12} />
                  Ubah Data
                </button>
              ) : null
            }
          >
            <div className="grid sm:grid-cols-3 gap-4">
              <EditableField
                label="Nama Lengkap"
                value={namaLengkap}
                onChange={setNamaLengkap}
                editing={editingBiodata}
              />
              <EditableField
                label="No WhatsApp"
                value={noWhatsapp}
                onChange={setNoWhatsapp}
                editing={editingBiodata}
              />
              <EditableField
                label="Email"
                value={email}
                onChange={setEmail}
                editing={editingBiodata}
                type="email"
              />
            </div>

            {biodataError && (
              <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {biodataError}
              </p>
            )}
            {biodataSaved && (
              <p className="mt-3 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Data diri berhasil diperbarui.
              </p>
            )}

            {editingBiodata && (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBiodata(false);
                    setNamaLengkap(user?.name || "");
                    setNoWhatsapp((user as any)?.phone || "");
                    setEmail(user?.email || "");
                    setBiodataError(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveBiodata}
                  disabled={savingBiodata}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold"
                >
                  {savingBiodata ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            )}
          </StepCard>

          {/* STEP 2: PAKET */}
          <StepCard step={2} title="Paket Dipilih" desc="Paket membership yang akan kamu daftarkan.">
            <div className="border-2 border-blue-500 bg-blue-50/40 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <Crown size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{plan.name}</p>
                  <p className="text-blue-700 font-bold text-lg leading-none mt-1">
                    {formatRupiah(plan.price)}{" "}
                    <span className="text-slate-400 text-xs font-medium">
                      / {plan.quotaLabel || `${plan.duration} hari`}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/membership")}
                className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
              >
                Ganti Paket
              </button>
            </div>
          </StepCard>

          {/* STEP 3: METODE & INSTRUKSI PEMBAYARAN — sama konsepnya kayak StepKonfirmasiPembayaran di Booking */}
          <StepCard
            step={3}
            title="Metode Pembayaran"
            desc="Pilih channel pembayaran, ikuti instruksinya, lalu unggah buktinya."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Daftar channel asli dari usePaymentStore */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Pilih Channel
                  </p>
                </div>
                <div className="px-4 pb-4 space-y-2">
                  {channels.length === 0 && (
                    <div className="flex items-center justify-center py-8 gap-2 text-slate-300">
                      <CreditCard size={20} />
                      <p className="text-sm">Memuat metode...</p>
                    </div>
                  )}
                  {channels
                    .filter((c) => c.isActive)
                    .map((c) => {
                      const isSelected = selectedChannel?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedChannel(c)}
                          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-blue-500 bg-white"
                              : "border-transparent bg-white/60 hover:border-blue-200"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {TYPE_ICON[c.type] ?? <Landmark size={15} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-bold leading-tight ${
                                isSelected ? "text-slate-900" : "text-slate-700"
                              }`}
                            >
                              {c.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {TYPE_LABEL[c.type] ?? c.type}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path
                                  d="M1 3L3 5L7 1"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Instruksi + Upload — persis konsep di Booking */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                <div className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {selectedChannel ? `Instruksi — ${selectedChannel.name}` : "Instruksi Pembayaran"}
                  </p>
                </div>

                <div className="px-4 pb-4 flex-1 flex flex-col gap-3">
                  {!selectedChannel ? (
                    <div className="flex-1 flex items-center justify-center text-slate-300 gap-2 py-6">
                      <CreditCard size={20} />
                      <p className="text-sm">Pilih channel dulu</p>
                    </div>
                  ) : selectedChannel.type === "qris" && selectedChannel.qrImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-2 border-blue-100 rounded-2xl p-3 bg-blue-50/30">
                        <img
                          src={selectedChannel.qrImage}
                          alt="QRIS"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                        Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking kamu.
                      </p>
                    </div>
                  ) : selectedChannel.type === "transfer" ? (
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-xl p-4 flex items-center gap-3 border border-slate-100">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">{selectedChannel.name}</p>
                        <p className="text-base font-black text-slate-900 tracking-wider">
                          {selectedChannel.accountNumber}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          a.n. {selectedChannel.accountName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Wallet size={26} className="text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-900">Bayar di Kasir</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Bayar langsung di kasir Puma Bharatangkas setelah pendaftaran dikonfirmasi.
                        </p>
                      </div>
                    </div>
                  )}

                  {needsProof && selectedChannel && (
                    <div className="border-t border-slate-50 pt-3 space-y-2">
                      <p className="text-xs font-semibold text-slate-500">Upload Bukti Pembayaran</p>

                      {!previewUrl && !file ? (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            const f = e.dataTransfer.files?.[0];
                            if (f) handleFile(f);
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                            dragOver
                              ? "border-blue-500 bg-blue-50/60"
                              : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/40"
                          }`}
                        >
                          <UploadCloud size={22} className="text-slate-400" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-slate-500">
                              Klik atau drag & drop file di sini
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              JPG, PNG, PDF — maks. 5MB
                            </p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            hidden
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFile(f);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="preview"
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <FileImage size={22} className="text-slate-400" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">
                              {file?.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {file ? (file.size / 1024 / 1024).toFixed(1) : 0} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              setPreviewUrl(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-600 leading-relaxed">
                        Upload bukti transfer setelah melakukan pembayaran. Pendaftaran akan dikonfirmasi
                        setelah admin memverifikasi.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-500">Catatan (Opsional)</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Ref. transaksi, catatan untuk admin, dll."
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </StepCard>

          {/* STEP 4: KONFIRMASI */}
          <StepCard step={4} title="Konfirmasi">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 accent-blue-600"
              />
              <span className="text-sm text-slate-600 leading-relaxed">
                Saya sudah membaca dan menyetujui syarat & ketentuan yang berlaku. Saya setuju dengan{" "}
                <span className="text-blue-600 font-semibold">Syarat & Ketentuan</span>.
              </span>
            </label>

            {error && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-5 w-full sm:w-auto sm:ml-auto flex px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  Konfirmasi Pendaftaran
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck size={12} />
              Data Anda aman dan hanya digunakan untuk pendaftaran member.
            </p>
          </StepCard>
        </div>

        {/* RIGHT: SUMMARY SIDEBAR */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:sticky lg:top-24">
            <div className="rounded-xl bg-gradient-to-r from-[#001845] to-[#1741B6] p-4 text-white">
              <p className="text-xs text-blue-200">Member {plan.name}</p>
              <p className="text-lg font-bold mt-0.5">
                {formatRupiah(plan.price)}{" "}
                <span className="text-blue-200 text-xs font-normal">/ bulan</span>
              </p>
            </div>

            <div className="mt-4 space-y-2.5 text-sm">
              <SummaryRow label="Paket" value={`Member ${plan.name}`} />
              <SummaryRow label="Durasi" value={`${plan.duration} Hari`} />
              {plan.quotaLabel && <SummaryRow label="Jam Bermain" value={plan.quotaLabel} />}
            </div>

            <div className="border-t border-slate-100 my-4" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-800">{formatRupiah(plan.price)}</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-sm font-bold text-slate-800">Total Pembayaran</span>
              <span className="font-bold text-blue-600">{formatRupiah(plan.price)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="font-bold text-slate-900 text-sm mb-4">Kenapa Jadi Member?</p>
            <div className="space-y-4">
              <BenefitRow icon={Zap} title="Lebih Hemat" desc="Harga lebih terjangkau dibanding non-member" />
              <BenefitRow
                icon={ClipboardCheck}
                title="Prioritas Booking"
                desc="Mendapatkan prioritas saat booking lapangan"
              />
              <BenefitRow
                icon={CalendarCheck}
                title={`Berlaku ${plan.duration} Hari`}
                desc="Masa berlaku sejak aktivasi paket"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="font-bold text-slate-900 text-sm mb-2">Butuh Bantuan?</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Hubungi admin kami jika ada pertanyaan.
            </p>
            <a
              href="https://wa.me/6281518578900"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-green-600 border border-green-200 bg-green-50 rounded-lg px-3 py-2.5 justify-center"
            >
              <Phone size={14} />
              0815-1857-890
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  title,
  desc,
  action,
  children,
}: {
  step: number;
  title: string;
  desc?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
      <div className="flex items-start gap-2.5 justify-between">
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {step}
          </span>
          <div className="flex-1">
            <p className="font-bold text-slate-900">{title}</p>
            {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  editing,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      ) : (
        <div className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {value || "-"}
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function BenefitRow({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Zap;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-blue-600" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{desc}</p>
      </div>
    </div>
  );
}