import { Check, Crown, Star } from "lucide-react";
import { Collapse } from "../components/ui/Collapse";
import { motion } from "framer-motion";
import kokk from "../assets/kokk.png";

const plans = [
  {
    name: "Silver",
    price: "99K",
    desc: "Cocok untuk pemain casual",
    sessions: "4 Priority Booking",
    popular: false,
    benefits: ["Diskon booking 10%", "Prioritas reservasi"],
  },
  {
    name: "Gold",
    price: "199K",
    desc: "Pilihan paling populer",
    sessions: "Unlimited Priority",
    popular: true,
    benefits: [
      "Diskon booking 20%",
      "Prioritas reservasi",
      "Free shuttlecock",
    ],
  },
  {
    name: "Platinum",
    price: "299K",
    desc: "Benefit dan akses penuh",
    sessions: "VIP Access",
    popular: false,
    benefits: [
      "Diskon booking 30%",
      "Prioritas reservasi",
      "Free shuttlecock",
      "Akses event",
    ],
  },
];

export default function MembershipSection() {
  return (
    <section className="bg-slate-50 overflow-hidden">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#001845] to-[#1741B6] mt-14 md:mt-20">
        
        {/* Decoration */}
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

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-14">
          
          {/* Accent */}
          <div className="w-10 h-1 rounded-full bg-blue-300 mb-4" />

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
            <span className="text-white">Membership </span>
            <span className="text-[#AFC8FF]">Puma</span>
          </h1>

          {/* Desc */}
          <p className="mt-3 text-blue-100 text-sm md:text-base leading-relaxed max-w-lg">
            Lebih hemat dan nikmati berbagai keuntungan eksklusif
            untuk pengalaman bermain yang lebih nyaman.
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-14 md:pb-24">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          
          {/* Badge */}
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

          {/* Title */}
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
            <span className="text-[#0050FF]">
              Nikmati Lebih Banyak.
            </span>
          </h2>

          {/* Desc */}
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
            sm:grid-cols-2
            xl:grid-cols-3
            gap-5 md:gap-7
            mt-10 md:mt-16
            items-stretch
            justify-items-center
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
                rounded-[22px]
                border
                flex flex-col justify-between
                transition-all duration-300

                w-full
                max-w-[320px]
                min-h-[500px]

                px-5 md:px-7
                pt-5 md:pt-8
                pb-5 md:pb-7

                ${
                  plan.popular
                    ? "border-blue-500 shadow-xl shadow-blue-500/10"
                    : "border-slate-200 shadow-sm hover:shadow-lg"
                }
              `}
            >
              
              {/* TOP LINE */}
              <div
                className={`
                  absolute top-0 left-0
                  w-full h-1.5
                  rounded-t-[22px]

                  ${
                    plan.name === "Silver"
                      ? "bg-gradient-to-r from-slate-300 to-slate-500"
                      : plan.name === "Gold"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-violet-500 to-blue-700"
                  }
                `}
              />

              {/* BADGE */}
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
                    ⭐ Paling Diminati
                  </span>
                </div>
              )}

              {/* CONTENT */}
              <div>
                
                {/* SESSION */}
                <div
                  className={`
                    inline-flex items-center gap-2
                    px-3 py-1.5
                    rounded-full
                    text-[10px] md:text-xs
                    font-medium
                    w-fit

                    ${
                      plan.name === "Silver"
                        ? "bg-slate-100 text-slate-700"
                        : plan.name === "Gold"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-violet-100 text-violet-700"
                    }
                  `}
                >
                  <Crown size={12} />
                  {plan.sessions}
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-bold mt-4 text-slate-900">
                  {plan.name}
                </h3>

                {/* DESC */}
                <p className="text-slate-500 text-sm mt-1">
                  {plan.desc}
                </p>

                {/* PRICE */}
                <div className="mt-5">
                  <span className="text-[40px] md:text-5xl font-extrabold text-slate-900">
                    {plan.price}
                  </span>

                  <span className="text-slate-400 ml-1 text-base">
                    /bulan
                  </span>
                </div>

                {/* BENEFITS */}
                <div className="space-y-3 mt-6">
                  {plan.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3"
                    >
                      
                      {/* ICON */}
                      <div
                        className={`
                          w-7 h-7
                          rounded-full
                          flex items-center justify-center
                          shrink-0

                          ${
                            plan.name === "Silver"
                              ? "bg-slate-100"
                              : plan.name === "Gold"
                              ? "bg-blue-100"
                              : "bg-violet-100"
                          }
                        `}
                      >
                        <Check
                          size={13}
                          className={
                            plan.name === "Platinum"
                              ? "text-violet-600"
                              : "text-blue-600"
                          }
                        />
                      </div>

                      {/* TEXT */}
                      <span className="text-sm text-slate-700">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BUTTON */}
              <button
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

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-28 max-w-5xl mx-auto"
        >
          
          {/* FAQ TITLE */}
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
              <span className="text-[#0050FF]">
                Cek Disini
              </span>
            </h2>
          </div>

          {/* FAQ GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            
            {/* LEFT */}
            <div className="flex flex-col gap-3 md:gap-6">
              <Collapse
                title="Apa keuntungan jadi member?"
                description="Member mendapatkan diskon booking, prioritas reservasi, reward points, dan akses event eksklusif."
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

            {/* RIGHT */}
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
                description="Klik tombol Join Membership lalu pilih paket yang sesuai kebutuhan Anda."
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}