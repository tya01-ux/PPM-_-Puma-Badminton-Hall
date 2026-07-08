"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

type GalleryItem = {
  image: string;
  title: string;
  desc: string;
  category: "Olahraga" | "Kantin" | "Kantor" | "Fasilitas Lainnya";
};

const galleryItems: GalleryItem[] = [
  {
    image: "/lapangan.jpeg",
    title: "Lapangan Badminton",
    desc: "Fasilitas lapangan badminton di Puma Bharatangkas.",
    category: "Olahraga",
  },
  {
    image: "/kantin.jpeg",
    title: "Kantin",
    desc: "Fasilitas kantin di Puma Bharatangkas.",
    category: "Kantin",
  },
  {
    image: "/kantor.jpeg",
    title: "Kantor",
    desc: "Fasilitas kantor di Puma Bharatangkas.",
    category: "Kantor",
  },
  {
    image: "/mushola.jpeg",
    title: "Mushola",
    desc: "Fasilitas mushola di Puma Bharatangkas.",
    category: "Fasilitas Lainnya",
  },
  {
    image: "/toilet.jpeg",
    title: "Toilet",
    desc: "Fasilitas toilet di Puma Bharatangkas.",
    category: "Fasilitas Lainnya",
  },
  {
    image: "/namamitra.jpeg",
    title: "Mitra Puma",
    desc: "Fasilitas mitra puma di Puma Bharatangkas.",
    category: "Fasilitas Lainnya",
  },
];

const FILTERS = ["Semua", "Olahraga", "Kantin", "Kantor", "Fasilitas Lainnya"] as const;

export const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("Semua");

  const filteredItems =
    activeFilter === "Semua"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section className="py-16 md:py-20 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── HEADER ── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-5">
            Galeri
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Galeri Fasilitas <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Puma Bharatangkas
            </span>
          </h2>

          <p className="text-slate-500 mt-4 text-[15px] max-w-xl mx-auto">
            Berbagai fasilitas terbaik yang tersedia untuk mendukung kebutuhan dan kenyamanan Anda.
          </p>
        </div>

        {/* ── FILTER TABS ── */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* ── GRID GALERI ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={index * 0.08}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group overflow-hidden rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-blue-600 shrink-0 group-hover:translate-x-1 transition-transform duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── BANNER PENUTUP ── */}
        <div className="mt-8 rounded-2xl bg-blue-50/70 border border-blue-100 py-6 px-6 text-center">
          <p className="text-blue-700 font-semibold text-[15px]">
            Fasilitas lengkap untuk mendukung kegiatan dan kenyamanan seluruh anggota.
          </p>
        </div>

      </div>
    </section>
  );
};