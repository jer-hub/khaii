"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { PasswordGate } from "@/components/PasswordGate";
import { PwaRegister } from "@/components/PwaRegister";

const UNLOCK_KEY = "our-journey:unlocked";

export default function Home() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setUnlocked(window.localStorage.getItem(UNLOCK_KEY) === "true");
  }, []);

  function handleUnlock() {
    window.localStorage.setItem(UNLOCK_KEY, "true");
    setUnlocked(true);
  }

  return (
    <MotionConfig reducedMotion="user">
      <PwaRegister />
      <div className="min-h-dvh bg-[#efece6]">
        {unlocked === null ? (
          <div className="min-h-dvh bg-cream" />
        ) : (
          <AnimatePresence mode="wait">
            {unlocked ? (
              <AppShell key="app" />
            ) : (
              <PasswordGate key="gate" onUnlock={handleUnlock} />
            )}
          </AnimatePresence>
        )}
      </div>
    </MotionConfig>
  );
}
