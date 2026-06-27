import { useRef } from "react";
import { X, Printer } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  booking: any;
  onClose: () => void;
}

const BASE_URL = (import.meta as any).env?.VITE_URL_BACKEND || "http://localhost:3000";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const TYPE_LABEL: Record<string, string> = {
  qris:     "QRIS / E-Wallet",
  transfer: "Transfer Bank",
  cash:     "Tunai / Cash",
};

export default function CetakInvoice({ booking, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const subtotal  = booking.courtPrice ?? 0;
  const adminFee  = booking.payment?.adminFee ?? 2500;
  const discount  = booking.payment?.discount ?? 0;
  const total     = booking.payment?.totalAmount ?? subtotal + adminFee - discount;
  const payStatus = booking.payment?.status;
  const isLunas   = payStatus === "confirmed" || payStatus === "cash";
  const printedAt = new Date().toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html lang="id">
      <head>
        <meta charset="UTF-8"/>
        <title>Invoice ${booking.bookingCode}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;background:#fff}
          .wrap{max-width:680px;margin:0 auto;padding:40px 48px}
          .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e2e8f0}
          .logo-box{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#0050FF,#4F46E5);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:900}
          .brand{display:flex;align-items:center;gap:12px}
          .brand-name{font-size:18px;font-weight:900;color:#001845}
          .brand-sub{font-size:11px;color:#64748b;margin-top:2px}
          .inv-title{font-size:24px;font-weight:900;color:#001845;text-align:right}
          .inv-code{font-size:13px;color:#0050FF;font-weight:700;text-align:right;margin-top:3px}
          .inv-date{font-size:11px;color:#94a3b8;text-align:right;margin-top:2px}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
          .box{background:#f8fafc;border-radius:12px;padding:16px 18px}
          .box-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;margin-bottom:10px}
          .row{display:flex;justify-content:space-between;margin-bottom:5px;font-size:12px}
          .label{color:#64748b}.value{font-weight:600;color:#1e293b;text-align:right;max-width:55%}
          table{width:100%;border-collapse:collapse;margin-bottom:18px}
          th{background:#f1f5f9;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#64748b;padding:10px 14px;text-align:left}
          td{font-size:12px;padding:11px 14px;border-bottom:1px solid #f1f5f9;color:#334155}
          .tr{text-align:right}.fw{font-weight:700}
          .total-bar{background:linear-gradient(135deg,#001845,#0050FF);border-radius:14px;padding:18px 20px;margin-bottom:24px}
          .trow{display:flex;justify-content:space-between;margin-bottom:6px}
          .tlabel{font-size:12px;color:rgba(255,255,255,.7)}.tval{font-size:12px;font-weight:600;color:rgba(255,255,255,.9)}
          .tmain{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid rgba(255,255,255,.2);margin-top:8px}
          .tname{font-size:14px;font-weight:700;color:#fff}.tamt{font-size:20px;font-weight:900;color:#fff}
          .badge{font-size:10px;font-weight:700;padding:2px 10px;border-radius:99px}
          .lunas{background:rgba(52,211,153,.25);color:#6ee7b7}.belum{background:rgba(251,191,36,.25);color:#fcd34d}
          .footer{border-top:1px dashed #e2e8f0;padding-top:20px;display:flex;justify-content:space-between;align-items:flex-end}
          .note{font-size:11px;color:#94a3b8;line-height:1.6;max-width:58%}
          .sig{text-align:right}.sig p{font-size:11px;color:#94a3b8;margin-bottom:28px}
          .sig-line{border-top:1px solid #334155;font-size:11px;font-weight:700;color:#334155;padding-top:4px}
          @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
        </style>
      </head>
      <body><div class="wrap">${content}</div></body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        {/* ── HEADER MODAL ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-600 flex items-center justify-center shadow-md shadow-blue-400/25">
              <Printer size={15} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Cetak Invoice</h3>
              <p className="text-[11px] text-slate-400">{booking.bookingCode}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition">
            <X size={14} />
          </button>
        </div>

        {/* ── PREVIEW INVOICE ── */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div ref={printRef}
            className="bg-white rounded-xl border border-slate-100 p-8 font-sans text-slate-800">

            {/* INVOICE HEADER */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0050FF] to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-400/20">
                  P
                </div>
                <div>
                  <p className="font-black text-[#001845] text-lg leading-none">PUMA</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Badminton Hall</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#001845] tracking-tight">INVOICE</p>
                <p className="text-sm font-bold text-[#0050FF] mt-0.5">{booking.bookingCode}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Dicetak: {printedAt}</p>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Pelanggan */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Informasi Pelanggan
                </p>
                <div className="space-y-1.5">
                  {[
                    { label: "Nama",  value: booking.user?.name  ?? "—" },
                    { label: "Email", value: booking.user?.email ?? "—" },
                    { label: "No. HP",value: booking.user?.phone ?? "—" },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-xs text-slate-500">{r.label}</span>
                      <span className="text-xs font-semibold text-slate-700 text-right max-w-[55%] break-all">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Booking */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Detail Booking
                </p>
                <div className="space-y-1.5">
                  {[
                    { label: "Lapangan", value: booking.court?.name ?? "—" },
                    { label: "Tanggal",  value: formatDate(booking.startAt) },
                    { label: "Waktu",    value: `${formatTime(booking.startAt)} – ${formatTime(booking.endAt)}` },
                    { label: "Durasi",   value: `${booking.duration} Jam` },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-xs text-slate-500">{r.label}</span>
                      <span className="text-xs font-semibold text-slate-700 text-right max-w-[55%]">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ITEM TABLE */}
            <div className="rounded-xl overflow-hidden border border-slate-100 mb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Deskripsi</th>
                    <th className="py-3 px-4 text-center">Durasi</th>
                    <th className="py-3 px-4 text-right">Harga/Jam</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  <tr>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">Sewa {booking.court?.name ?? "Lapangan"}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">{booking.court?.type ?? "Badminton"}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{booking.duration} Jam</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {formatRupiah(booking.court?.price ?? Math.round(subtotal / (booking.duration || 1)))}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">{formatRupiah(subtotal)}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-500" colSpan={3}>Biaya Administrasi</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatRupiah(adminFee)}</td>
                  </tr>
                  {discount > 0 && (
                    <tr className="bg-emerald-50/50">
                      <td className="py-3 px-4 text-emerald-600" colSpan={3}>
                        Diskon {booking.payment?.promo?.code ? `(${booking.payment.promo.code})` : ""}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-semibold">-{formatRupiah(discount)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTAL BAR */}
            <div className="bg-gradient-to-r from-[#001845] to-[#0050FF] rounded-xl px-5 py-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-blue-200">Metode Pembayaran</span>
                <span className="text-xs font-semibold text-white">
                  {TYPE_LABEL[booking.payment?.channel?.type ?? ""] || booking.payment?.channel?.name || "—"}
                </span>
              </div>
              {booking.payment?.channel?.accountNumber && (
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-blue-200">No. Rekening / HP</span>
                  <span className="text-xs font-semibold text-white">{booking.payment.channel.accountNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-white/20 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Total Pembayaran</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isLunas ? "bg-emerald-400/30 text-emerald-200" : "bg-amber-400/30 text-amber-200"
                  }`}>
                    {isLunas ? "✓ LUNAS" : "BELUM LUNAS"}
                  </span>
                </div>
                <span className="text-xl font-black text-white">{formatRupiah(total)}</span>
              </div>
            </div>

            {/* BUKTI PEMBAYARAN (jika ada) */}
            {booking.payment?.proofs?.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Bukti Pembayaran
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {booking.payment.proofs.map((p: any) => (
                    <img
                      key={p.id}
                      src={p.image.startsWith("http") ? p.image : `${BASE_URL}${p.image}`}
                      alt="Bukti"
                      className="w-full h-20 object-cover rounded-xl border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* FOOTER INVOICE */}
            <div className="flex items-end justify-between pt-5 border-t border-dashed border-slate-200">
              <div>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                  Terima kasih telah menggunakan layanan PUMA Badminton Hall.<br />
                  Simpan invoice ini sebagai bukti pembayaran yang sah.
                </p>
                {booking.notes && (
                  <p className="text-[11px] text-slate-500 mt-2">
                    <span className="font-semibold">Catatan:</span> {booking.notes}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[11px] text-slate-400 mb-8">Admin PUMA Badminton Hall</p>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-[11px] font-bold text-slate-600">( ________________ )</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER MODAL ── */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition">
            Tutup
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0050FF] to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-400/25 transition flex items-center justify-center gap-2"
          >
            <Printer size={14} /> Print Invoice
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}