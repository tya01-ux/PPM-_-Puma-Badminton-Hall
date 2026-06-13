import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapseProps {
  title: string;
  description: string;
}

export const Collapse: React.FC<CollapseProps> = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      className="bg-white border border-blue-100 border-r-[3px] border-r-blue-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4 text-left hover:bg-blue-50/40 transition-colors"
      >
        {/* ICON */}
        <div
          className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl shrink-0 transition-all duration-300 ${
            isOpen ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600"
          }`}
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* TITLE */}
        <span className="text-sm md:text-base font-bold leading-snug text-[#001845]">
          {title}
        </span>
      </button>

      {/* CONTENT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
          >
            <div className="px-4 md:px-6 pb-4 md:pb-6 pl-[68px] md:pl-[84px] bg-gradient-to-b from-blue-50/40 to-white">
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                {description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};