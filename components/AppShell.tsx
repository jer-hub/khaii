"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { TabId } from "@/data/content";
import { BottomNav } from "@/components/BottomNav";
import { CouponBook } from "@/components/CouponBook";
import { HeroStats } from "@/components/HeroStats";
import { MemoryCards } from "@/components/MemoryCards";
import { ReasonsDeck } from "@/components/ReasonsDeck";

export function AppShell() {
  const [tab, setTab] = useState<TabId>("home");

  return (
    <motion.div
      key="app"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-cream shadow-[0_0_80px_rgba(44,44,44,0.08)]"
    >
      <div className="pointer-events-none absolute -top-24 right-[-5rem] h-64 w-64 rounded-full bg-rose/40 blur-3xl" />
      <div className="pointer-events-none absolute top-48 left-[-6rem] h-56 w-56 rounded-full bg-sage/30 blur-3xl" />

      <main className="relative flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {tab === "home" && <HeroStats />}
            {tab === "memories" && <MemoryCards />}
            {tab === "coupons" && <CouponBook />}
            {tab === "reasons" && <ReasonsDeck />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav tab={tab} onChange={setTab} />
    </motion.div>
  );
}
