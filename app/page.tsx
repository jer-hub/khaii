"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { PasswordGate } from "@/components/PasswordGate";
import { PwaRegister } from "@/components/PwaRegister";
import { unlockSite, useIsClient, useUnlocked } from "@/hooks/useClientStore";

export default function Home() {
  const isClient = useIsClient();
  const unlocked = useUnlocked();

  return (
    <MotionConfig reducedMotion="user">
      <PwaRegister />
      <div className="min-h-dvh bg-[#efece6]">
        {!isClient ? (
          <div className="min-h-dvh bg-cream" />
        ) : (
          <AnimatePresence mode="wait">
            {unlocked ? (
              <AppShell key="app" />
            ) : (
              <PasswordGate key="gate" onUnlock={unlockSite} />
            )}
          </AnimatePresence>
        )}
      </div>
    </MotionConfig>
  );
}
