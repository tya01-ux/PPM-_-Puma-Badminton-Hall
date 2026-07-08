import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Crown,
  Star,
  Clock,
  ShieldCheck,
  Zap,
  CalendarCheck,
  Headphones,
} from "lucide-react";
import { Collapse } from "../components/ui/Collapse";
import { motion } from "framer-motion";
import kokk from "../assets/kokk.png";

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

const features = [
  {
    icon: ShieldCheck,
    title: "Pembayaran Aman",
    desc: "Transaksi aman & terpercaya",
  },
  {
    icon: Zap,
    title: "Proses Instan",
    desc: "Aktivasi member cepat",
  },
  {
    icon: CalendarCheck,
    title: "Berlaku Fleksibel",
    desc: "Sesuai durasi paket",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    desc: "Siap membantu Anda",
  },
];

export default function MembershipSection() {
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
      navigate(`/membership/register/${plan.id}`, {
        state: { plan: chosenPlan },
      });
      return;
    }

    navigate(`/membership/register/${plan.id}`, { state: { plan } });
  };

  return (
    <section className="bg-slate-50 overflow-hidden">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#001845] to-[#1741B6] mt-14 md:mt-20">
        <img
          src={kokk}
          alt=""
          className="
            absolute right-0 top-1/2
            -translate-y-1/2 translate-x-1/4
            w-40 md:w-[420px]
            opacity-[0.05]
            pointer-events-none
            select-none
          "
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-14">
          <div className="w-10 h-1 rounded-full bg-blue-300 mb-4" />

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
            <span className="text-white">Membership </span>
            <span className="text-[#AFC8FF]">Puma</span>
          </h1>

          <p className="mt-3 text-blue-100 text-sm md:text-base leading-relaxed max-w-lg">
            Lebih hemat dan nikmati berbagai keuntungan eksklusif
            untuk pengalaman bermain yang lebih nyaman.
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-16 md:pb-28">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
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

          <h2
            className="
              mt-4 md:mt-5
              text-xl sm:text-2xl md:text-4xl
              font-bold
              leading-tight
              text-slate-900
            "
          >
            Main Lebih Hemat,
            <br />
            <span className="text-[#0050FF]">Nikmati Lebih Banyak.</span>
          </h2>

          <p
            className="
              mt-3 md:mt-4
              text-slate-600
              text-sm md:text-base
              max-w-2xl
              mx-auto
              leading-relaxed
            "
          >
            Temukan paket membership yang paling sesuai
            dengan kebutuhan bermain Anda.
          </p>
        </motion.div>

        {/* CARD GRID */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6 md:gap-8
            mt-10 md:mt-16
            items-stretch
          "
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`
                relative
                bg-white
                rounded-[28px]
                border
                flex flex-col justify-between
                transition-all duration-300

                w-full
                mx-auto
                ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}

                px-7 sm:px-8 md:px-9
                pt-8 sm:pt-9 md:pt-10
                pb-7 md:pb-9

                ${
                  plan.popular
                    ? "border-2 border-blue-500 shadow-2xl shadow-blue-500/20 lg:scale-[1.04]"
                    : "border-slate-200 shadow-md hover:shadow-xl"
                }
              `}
            >
              {/* CLIPPED DECOR LAYER — keeps top line & ribbon inside the rounded corners */}
              <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
                {/* TOP LINE */}
                <div
                  className={`
                    absolute top-0 left-0
                    w-full h-2

                    ${
                      plan.name === "Silver"
                        ? "bg-gradient-to-r from-slate-300 to-slate-500"
                        : plan.name === "Gold"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gradient-to-r from-violet-500 to-blue-700"
                    }
                  `}
                />

                {/* CORNER RIBBON (non-popular cards only) */}
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
                    <Star
                      size={14}
                      className="absolute top-3 right-3 text-white"
                      fill="white"
                    />
                  </div>
                )}
              </div>

              {/* POPULAR BADGE — stays outside the clip layer so it can poke above the card */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span
                    className="
                      inline-flex items-center gap-1
                      bg-gradient-to-r from-blue-600 to-indigo-600
                      text-white
                      px-3 py-1.5
                      rounded-full
                      text-[10px] md:text-xs
                      font-bold
                      shadow-lg
                      whitespace-nowrap
                    "
                  >
                    ⭐ Paling Hemat
                  </span>
                </div>
              )}

              {/* CONTENT */}
              <div>
                {/* TITLE + CROWN */}
                <div className="flex items-center gap-2">
                  <Crown size={20} className={plan.crownColor} />
                  <h3 className="text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                </div>

                {/* DESC */}
                <p className="text-slate-500 text-sm mt-1">{plan.desc}</p>

                {/* PRICE / DURATION TOGGLE */}
                {plan.isDurationBased ? (
                  <>
                    <p className="text-xs font-semibold text-slate-500 mt-6 mb-2.5">
                      Pilih Durasi
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {silverOptions.map((opt) => {
                        const active = opt.key === silverDuration;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() =>
                              setSilverDuration(opt.key as "1" | "2")
                            }
                            className={`
                              flex items-center gap-1.5
                              px-4 py-2
                              rounded-full
                              text-xs font-semibold
                              border
                              transition-colors duration-200
                              whitespace-nowrap

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

                    <p className="text-xs font-semibold text-slate-400 mb-1.5">
                      Harga
                    </p>
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                      <span className="text-4xl md:text-[42px] font-extrabold text-slate-900 leading-none">
                        Rp{selectedSilver.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-slate-400 text-sm whitespace-nowrap">
                        / {selectedSilver.label}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mt-6">
                    <p className="text-xs font-semibold text-slate-400 mb-1.5">
                      Harga
                    </p>
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                      <span className="text-4xl md:text-[42px] font-extrabold text-slate-900 leading-none">
                        Rp{plan.price!.toLocaleString("id-ID")}
                      </span>
                      <span className="text-slate-400 text-sm whitespace-nowrap">
                        / {plan.quotaLabel}
                      </span>
                    </div>
                  </div>
                )}

                {/* DIVIDER */}
                <div className="border-t border-slate-100 mt-5 mb-5" />

                {/* BENEFITS (tinted box) */}
                <div
                  className={`
                    rounded-xl p-4 space-y-3.5

                    ${
                      plan.name === "Silver"
                        ? "bg-slate-50"
                        : plan.name === "Gold"
                        ? "bg-blue-50"
                        : "bg-violet-50"
                    }
                  `}
                >
                  {plan.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div
                        className={`
                          w-6 h-6
                          rounded-full
                          flex items-center justify-center
                          shrink-0

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
                          size={12}
                          className={
                            plan.name === "Platinum"
                              ? "text-violet-600"
                              : plan.name === "Silver"
                              ? "text-slate-400"
                              : "text-blue-600"
                          }
                        />
                      </div>

                      <span
                        className={`text-sm ${
                          plan.name === "Silver"
                            ? "text-slate-500"
                            : "text-slate-700"
                        }`}
                      >
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => handlePilihPaket(plan)}
                className={`
                  w-full
                  mt-8
                  py-3
                  rounded-xl
                  font-semibold
                  text-sm
                  transition-all duration-300

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

        {/* FEATURES ROW */}
        <div className="mt-10 md:mt-14 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 justify-center px-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#001845] leading-tight">
                    {f.title}
                  </p>
                  <p className="text-xs text-slate-500 leading-tight">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-8 text-xs text-slate-400">
            <ShieldCheck size={14} />
            Pembayaran aman dan proses instan.
          </div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-28 max-w-5xl mx-auto"
        >
          <div className="text-center mb-8 md:mb-12">
            <h2
              className="
                text-lg sm:text-2xl md:text-4xl
                font-black
                text-[#001845]
                leading-tight
              "
            >
              Punya Pertanyaan?{" "}
              <span className="text-[#0050FF]">Cek Disini</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div className="flex flex-col gap-3 md:gap-6">
              <Collapse
                title="Apa keuntungan jadi member?"
                description="Member mendapatkan harga lebih hemat, prioritas booking, promo & event khusus, serta slot bermain yang lebih fleksibel."
              />

              <Collapse
                title="Berapa masa aktif membership?"
                description="Membership berlaku selama 30 hari dari aktivasi."
              />

              <Collapse
                title="Apakah bisa dipindah tangankan?"
                description="Tidak, membership bersifat personal untuk satu akun."
              />
            </div>

            <div className="flex flex-col gap-3 md:gap-6">
              <Collapse
                title="Bagaimana cara booking?"
                description="Booking dapat dilakukan melalui website maupun admin Puma."
              />

              <Collapse
                title="Apakah ada prioritas reservasi?"
                description="Ya, member mendapatkan prioritas reservasi pada jam-jam ramai."
              />

              <Collapse
                title="Bagaimana cara daftar?"
                description="Klik tombol Pilih Paket lalu lengkapi data diri sesuai paket yang sesuai kebutuhan Anda."
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}