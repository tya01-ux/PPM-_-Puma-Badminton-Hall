import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Save,
  Loader2,
  CheckCircle2,
  KeyRound,
  LogOut,
  Crown,
  CalendarCheck,
  ClipboardList,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useBookingStore } from "../../store/useBookingStore";
import {
  useUserMembershipStore,
  type UserMembership,
} from "../../store/useUserMembershipStore";
import { useUserStore } from "../../store/useUserStore";

const formatDate = (d?: string | null) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600 border-emerald-100",
  expired: "bg-slate-100 text-slate-500 border-slate-200",
  cancelled: "bg-red-50 text-red-500 border-red-100",
  selesai: "bg-emerald-50 text-emerald-600 border-emerald-100",
  pending: "bg-amber-50 text-amber-600 border-amber-100",
};

const badgeClass = (status?: string) =>
  STATUS_BADGE[status?.toLowerCase() ?? ""] ??
  "bg-slate-100 text-slate-500 border-slate-200";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout, login } = useAuthStore();
  const { bookings, fetchBookings } = useBookingStore();
  const { fetchUserMembershipsByUser } = useUserMembershipStore();
  const { updateOwnProfile } = useUserStore();

  // ── Riwayat membership (per user) ──
  const [myMemberships, setMyMemberships] = useState<UserMembership[]>([]);
  const [loadingMemberships, setLoadingMemberships] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (!user?.id) return;
    setLoadingMemberships(true);
    fetchUserMembershipsByUser(user.id)
      .then((data) => setMyMemberships(data))
      .finally(() => setLoadingMemberships(false));
  }, [user?.id, fetchUserMembershipsByUser]);

  // ── Edit Profil (inline) ──
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState((user as any)?.phone || "");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone((user as any)?.phone || "");
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileError(null);
    setProfileSaved(false);
    setSavingProfile(true);
    try {
      const updated = await updateOwnProfile({ name, email, phone });
      const updatedUser = { ...user, ...updated };
      login(updatedUser as any);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileSaved(true);
      setEditingProfile(false);
    } catch (err: any) {
      setProfileError(err.message || "Gagal menyimpan perubahan profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Data turunan ──
  const myBookings = useMemo(
    () => (bookings ?? []).filter((b: any) => b.userId === user?.id),
    [bookings, user?.id]
  );

  const recentBookings = useMemo(() => {
    return [...myBookings]
      .sort((a: any, b: any) => {
        const da = new Date(a.date ?? a.startAt ?? a.createdAt ?? 0).getTime();
        const db = new Date(b.date ?? b.startAt ?? b.createdAt ?? 0).getTime();
        return db - da;
      })
      .slice(0, 3);
  }, [myBookings]);

  const activeMembership = useMemo(
    () => myMemberships.find((m) => m.status === "active"),
    [myMemberships]
  );

  const sortedMemberships = useMemo(
    () =>
      [...myMemberships].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ),
    [myMemberships]
  );

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const joinedDate = formatDate((user as any)?.createdAt);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-10">
        <h1 className="text-2xl font-black text-slate-900 mb-6">Profil Saya</h1>

        {/* ── HEADER PROFILE ── */}
        <div className="bg-gradient-to-r from-[#001845] to-[#1741B6] rounded-3xl p-6 md:p-8 text-white text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mx-auto text-2xl font-bold mb-3">
            {initials}
          </div>
          <p className="text-lg font-bold">{user?.name}</p>
          <p className="text-blue-200 text-sm mt-0.5">{user?.email}</p>

          <div className="mt-4 inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold">
            <Crown size={13} className="text-amber-300" />
            {activeMembership
              ? `${activeMembership.membership?.name ?? "Member"} (Aktif)`
              : "Belum Ada Membership"}
          </div>
        </div>

        {/* ── INFORMASI AKUN ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Informasi Akun</h2>
            {!editingProfile && (
              <button
                type="button"
                onClick={() => {
                  setEditingProfile(true);
                  setProfileSaved(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                <Pencil size={12} />
                Edit Profil
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama Lengkap" value={name} onChange={setName} editing={editingProfile} />
            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              editing={editingProfile}
              type="email"
            />
            <Field label="Nomor HP" value={phone} onChange={setPhone} editing={editingProfile} />
            <div>
              <label className="text-xs font-semibold text-slate-500">Tanggal Bergabung</label>
              <div className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                {joinedDate}
              </div>
            </div>
          </div>

          {profileError && (
            <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {profileError}
            </p>
          )}
          {profileSaved && (
            <p className="mt-3 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              Profil berhasil diperbarui.
            </p>
          )}

          {editingProfile ? (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingProfile(false);
                  setName(user?.name || "");
                  setEmail(user?.email || "");
                  setPhone((user as any)?.phone || "");
                  setProfileError(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold"
              >
                {savingProfile ? (
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
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/profile/ubah-password")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                <KeyRound size={13} />
                Ubah Password
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100"
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ── MEMBERSHIP AKTIF ── */}
        <div className="mb-6">
          <h2 className="font-bold text-slate-900 mb-3">Membership Saya</h2>

          {activeMembership ? (
            <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-sm overflow-hidden">
              <div className="bg-blue-50/60 px-5 py-3 border-b border-blue-100 flex items-center gap-2">
                <Crown size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-blue-700">Membership Aktif</span>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-3 text-sm">
                <Row label="Paket" value={activeMembership.membership?.name ?? "-"} />
                <Row
                  label="Status"
                  value={
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass(
                        activeMembership.status
                      )}`}
                    >
                      Aktif
                    </span>
                  }
                />
                <Row label="Mulai" value={formatDate(activeMembership.startDate)} />
                <Row label="Berakhir" value={formatDate(activeMembership.endDate)} />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
              <p className="text-sm text-slate-500 mb-4">
                {loadingMemberships
                  ? "Memuat data membership..."
                  : "Belum memiliki membership aktif."}
              </p>
              <button
                onClick={() => navigate("/membership")}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
              >
                Daftar Membership
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* ── STATISTIK SINGKAT ── */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          <StatCard icon={ClipboardList} label="Total Booking" value={myBookings.length} />
          <StatCard
            icon={Crown}
            label="Status Member"
            value={activeMembership ? "Aktif" : "Tidak Aktif"}
          />
          <StatCard icon={Wallet} label="Transaksi" value={myMemberships.length} />
        </div>

        {/* ── RIWAYAT BOOKING TERAKHIR ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Riwayat Booking Terakhir</h2>
          </div>

          {recentBookings.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="p-4 text-left">Lapangan</th>
                  <th className="p-4 text-left">Tanggal</th>
                  <th className="p-4 text-left">Jam</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b: any) => (
                  <tr key={b.id}>
                    <td className="p-4 font-semibold text-slate-800">
                      {b.court?.name ?? "-"}
                    </td>
                    <td className="p-4 text-slate-500">{formatDate(b.date)}</td>
                    <td className="p-4 text-slate-500">
                      {b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border uppercase ${badgeClass(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 pb-6 text-sm text-slate-400">Belum ada riwayat booking.</p>
          )}

          <div className="px-5 py-4 border-t border-slate-100">
            <button
              onClick={() => navigate("/profile/riwayat-booking")}
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Lihat Semua Riwayat
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* ── RIWAYAT MEMBERSHIP ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h2 className="font-bold text-slate-900">Riwayat Membership</h2>
          </div>

          {sortedMemberships.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="p-4 text-left">Paket</th>
                  <th className="p-4 text-left">Mulai</th>
                  <th className="p-4 text-left">Berakhir</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedMemberships.map((m) => (
                  <tr key={m.id}>
                    <td className="p-4 font-semibold text-slate-800 flex items-center gap-2">
                      <CalendarCheck size={14} className="text-slate-300" />
                      {m.membership?.name ?? "-"}
                    </td>
                    <td className="p-4 text-slate-500">{formatDate(m.startDate)}</td>
                    <td className="p-4 text-slate-500">{formatDate(m.endDate)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${badgeClass(
                          m.status
                        )}`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 pb-6 text-sm text-slate-400">
              {loadingMemberships ? "Memuat riwayat..." : "Belum ada riwayat membership."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Crown;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
        <Icon size={16} className="text-blue-600" />
      </div>
      <p className="text-lg font-black text-slate-900 leading-none">{value}</p>
      <p className="text-[11px] text-slate-400 mt-1">{label}</p>
    </div>
  );
}