"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

export function PlayHeader({
  title,
  eyebrow,
  onBack,
}: {
  title: string;
  eyebrow: string;
  onBack: () => void;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onBack}
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-sm ring-1 ring-white"
        aria-label="Back to home"
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>
      <div>
        <p className="text-xs font-medium tracking-[0.26em] text-sage-deep uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-serif text-2xl text-charcoal">{title}</h2>
      </div>
    </div>
  );
}
