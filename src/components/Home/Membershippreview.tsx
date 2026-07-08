import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, Crown, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

const silverOptions = [
  { key: "1", label: "1 Jam", price: 40000 },
  { key: "2", label: "2 Jam", price: 70000 },
];

const plans = [
  {
    id: 1,
    name: "Silver",
    desc: "Cocok untuk pemain casual",
    popular: false,
    isDurationBased: true,
    crownColor: "text-slate-400",
    ribbonColor: "#94a3b8",
    benefits: ["Harga normal tanpa benefit", "Tidak mendapatkan diskon"],
  },
  {
    id: 2,
    name: "Gold",
    desc: "Pilihan paling populer",
    price: 350000,
    duration: 30,
    quotaLabel: "4 Jam / Bulan",
    popular: true,
    crownColor: "text-amber-500",
    benefits: [
      "Harga lebih hemat",
      "Booking prioritas",
      "Promo & event khusus member",
      "Slot bermain lebih fleksibel",
    ],
  },
  {
    id: 3,
    name: "Platinum",
    desc: "Benefit dan akses penuh",
    price: 300000,
    duration: 30,
    quotaLabel: "3 Jam / Bulan",
    popular: false,
    crownColor: "text-violet-600",
    ribbonColor: "#8b5cf6",
    benefits: [
      "Harga lebih hemat",
      "Booking prioritas",
      "Promo & event khusus member",
      "Slot bermain lebih fleksibel",
    ],
  },
];

export function MembershipPreview() {
  const navigate = useNavigate();
  const [silverDuration, setSilverDuration] = useState<"1" | "2">("1");
  const selectedSilver = silverOptions.find((o) => o.key === silverDuration)!;

  const handlePilihPaket = (plan: (typeof plans)[number]) => {
    if (plan.name === "Silver") {
      const chosenPlan = {
        ...plan,
        price: selectedSilver.price,
        duration: silverDuration === "1" ? 1 : 2,
        quotaLabel: selectedSilver.label,
      };
      navigate(`/membership/register/${plan.id}`, { state: { plan: chosenPlan } });
      return;
    }
    navigate(`/membership/register/${plan.id}`, { state: { plan } });
  };

  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <span
            className="
              inline-flex items-center gap-2
              px-3 py-1.5
              rounded-full
              bg-blue-50
              border border-blue-100
              text-blue-700
              text-[10px] md:text-xs
              font-semibold
            "
          >
            <Star size={12} className="fill-blue-700" />
            Membership Puma
          </span>

          <h2 className="mt-4 text-xl sm:text-2xl md:text-4xl font-bold leading-tight text-slate-900">
            Main Lebih Hemat,
            <br />
            <span className="text-[#0050FF]">Nikmati Lebih Banyak.</span>
          </h2>

          <p className="mt-3 text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Temukan paket membership yang paling sesuai dengan kebutuhan bermain Anda.
          </p>
        </motion.div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-10 md:mt-14 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`
                relative bg-white rounded-[28px] border flex flex-col justify-between
                transition-all duration-300 w-full mx-auto
                ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}
                px-5 sm:px-6 md:px-7 pt-6 sm:pt-7 md:pt-8 pb-5 md:pb-7
                ${
                  plan.popular
                    ? "border-2 border-blue-500 shadow-2xl shadow-blue-500/20 lg:scale-[1.04]"
                    : "border-slate-200 shadow-md hover:shadow-xl"
                }
              `}
            >
              <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
                <div
                  className={`
                    absolute top-0 left-0 w-full h-2
                    ${
                      plan.name === "Silver"
                        ? "bg-gradient-to-r from-slate-300 to-slate-500"
                        : plan.name === "Gold"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gradient-to-r from-violet-500 to-blue-700"
                    }
                  `}
                />
                {!plan.popular && (
                  <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
                    <div
                      className="absolute top-0 right-0 w-0 h-0"
                      style={{
                        borderStyle: "solid",
                        borderWidth: "0 80px 80px 0",
                        borderColor: `transparent ${plan.ribbonColor} transparent transparent`,
                      }}
                    />
                    <Star size={14} className="absolute top-3 right-3 text-white" fill="white" />
                  </div>
                )}
              </div>

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold shadow-lg whitespace-nowrap">
                    ⭐ Paling Hemat
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <Crown size={16} className={plan.crownColor} />
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                </div>
                <p className="text-slate-500 text-sm mt-1">{plan.desc}</p>

                {plan.isDurationBased ? (
                  <>
                    <p className="text-xs font-semibold text-slate-500 mt-6 mb-2.5">Pilih Durasi</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {silverOptions.map((opt) => {
                        const active = opt.key === silverDuration;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setSilverDuration(opt.key as "1" | "2")}
                            className={`
                              flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border
                              transition-colors duration-200 whitespace-nowrap
                              ${
                                active
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                              }
                            `}
                          >
                            <Clock size={12} />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs font-semibold text-slate-400 mb-1.5">Harga</p>
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                      <span className="text-2xl md:text-[28px] font-extrabold text-slate-900 leading-none">
                        Rp{selectedSilver.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-slate-400 text-sm whitespace-nowrap">/ {selectedSilver.label}</span>
                    </div>
                  </>
                ) : (
                  <div className="mt-6">
                    <p className="text-xs font-semibold text-slate-400 mb-1.5">Harga</p>
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                      <span className="text-2xl md:text-[28px] font-extrabold text-slate-900 leading-none">
                        Rp{plan.price!.toLocaleString("id-ID")}
                      </span>
                      <span className="text-slate-400 text-sm whitespace-nowrap">/ {plan.quotaLabel}</span>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 mt-5 mb-5" />

                <div
                  className={`
                    rounded-xl p-3 space-y-2.5
                    ${plan.name === "Silver" ? "bg-slate-50" : plan.name === "Gold" ? "bg-blue-50" : "bg-violet-50"}
                  `}
                >
                  {plan.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center shrink-0
                          ${
                            plan.name === "Silver"
                              ? "bg-slate-200"
                              : plan.name === "Gold"
                              ? "bg-blue-100"
                              : "bg-violet-100"
                          }
                        `}
                      >
                        <Check
                          size={11}
                          className={
                            plan.name === "Platinum"
                              ? "text-violet-600"
                              : plan.name === "Silver"
                              ? "text-slate-400"
                              : "text-blue-600"
                          }
                        />
                      </div>
                      <span className={`text-xs md:text-sm ${plan.name === "Silver" ? "text-slate-500" : "text-slate-700"}`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handlePilihPaket(plan)}
                className={`
                  w-full mt-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                  ${
                    plan.name === "Silver"
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      : plan.name === "Gold"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      : "bg-gradient-to-r from-violet-600 to-blue-700 hover:from-violet-700 hover:to-blue-800 text-white"
                  }
                `}
              >
                Pilih Paket
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/membership"
            className="text-sm font-semibold text-[#0050FF] hover:text-[#001845] transition-colors"
          >
            Lihat Semua Paket →
          </Link>
        </div>
      </div>
    </section>
  );
}