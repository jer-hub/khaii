"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SONG, type TabId } from "@/data/content";
import { BottomNav } from "@/components/BottomNav";
import { CouponBook } from "@/components/CouponBook";
import { FlashcardQuiz } from "@/components/FlashcardQuiz";
import { HeroStats } from "@/components/HeroStats";
import { MemoryCards } from "@/components/MemoryCards";
import { MemoryGame } from "@/components/MemoryGame";
import { ReasonsDeck } from "@/components/ReasonsDeck";
import { StoryViewer } from "@/components/StoryViewer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export function AppShell() {
  const [tab, setTab] = useState<TabId>("home");
  const mainRef = useRef<HTMLElement>(null);
  const [songRef, song] = useAudioPlayer();
  const goHome = () => setTab("home");
  const { pause: pauseSong } = song;

  useEffect(() => {
    if (tab === "story") pauseSong();
  }, [tab, pauseSong]);

  return (
    <motion.div
      key="app"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-cream shadow-[0_0_80px_rgba(44,44,44,0.08)]"
    >
      <audio ref={songRef} src={SONG.src} preload="metadata" loop />

      {tab !== "story" && (
        <>
          <div className="pointer-events-none absolute -top-24 right-[-5rem] h-64 w-64 rounded-full bg-rose/40 blur-3xl" />
          <div className="pointer-events-none absolute top-48 left-[-6rem] h-56 w-56 rounded-full bg-sage/30 blur-3xl" />
        </>
      )}

      <main
        ref={mainRef}
        className={`relative min-h-0 flex-1 ${tab === "story" ? "overflow-hidden" : "overflow-y-auto"}`}
      >
        <div className={tab === "story" ? "absolute inset-0" : undefined}>
          <AnimatePresence mode="wait" onExitComplete={() => mainRef.current?.scrollTo({ top: 0 })}>
            <motion.div
              key={tab}
              initial={{ opacity: tab === "story" ? 1 : 0, y: tab === "story" ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: tab === "story" ? 0 : -8 }}
              transition={{ duration: 0.28 }}
              className={tab === "story" ? "h-full" : undefined}
            >
              {tab === "home" && <HeroStats song={song} onOpen={(view) => setTab(view)} />}
              {tab === "memories" && <MemoryCards />}
              {tab === "coupons" && <CouponBook />}
              {tab === "reasons" && <ReasonsDeck />}
              {tab === "game" && <MemoryGame onBack={goHome} />}
              {tab === "quiz" && <FlashcardQuiz onBack={goHome} />}
              {tab === "story" && <StoryViewer onBack={goHome} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {tab !== "story" && (
        <BottomNav
          tab={tab}
          onChange={(next) => setTab(next)}
          nowPlaying={song.playing && tab !== "home" ? { title: SONG.title, onPause: song.pause } : null}
        />
      )}
    </motion.div>
  );
}
