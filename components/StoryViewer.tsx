"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { SITE, STORY_SCENES } from "@/data/content";
import { MemoryArt } from "@/components/MemoryArt";

const SCENE_MS = 5000;

export function StoryViewer({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);

  const scene = STORY_SCENES[index];
  const total = STORY_SCENES.length;

  useEffect(() => {
    if (!playing || ended) return;
    const id = window.setTimeout(() => {
      if (index >= total - 1) {
        setEnded(true);
        setPlaying(false);
        return;
      }
      setIndex((value) => value + 1);
    }, SCENE_MS);
    return () => window.clearTimeout(id);
  }, [playing, ended, index, total]);

  function go(dir: number) {
    if (ended && dir < 0) {
      setEnded(false);
      setIndex(total - 1);
      setPlaying(false);
      return;
    }
    const next = index + dir;
    if (next < 0) return;
    if (next >= total) {
      setEnded(true);
      setPlaying(false);
      return;
    }
    setIndex(next);
    setEnded(false);
  }

  return (
    <section className="relative flex h-full min-h-0 flex-col bg-charcoal text-cream">
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-cream backdrop-blur-sm"
        aria-label="Close story"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute top-5 right-4 left-14 z-20 flex gap-1">
        {STORY_SCENES.map((item, sceneIndex) => {
          const filled = ended || sceneIndex < index;
          const isCurrent = !ended && sceneIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setIndex(sceneIndex);
                setEnded(false);
              }}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
              aria-label={`Go to ${item.title}`}
            >
              {isCurrent && playing ? (
                <motion.span
                  key={`${item.id}-run`}
                  className="block h-full bg-cream"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: SCENE_MS / 1000, ease: "linear" }}
                />
              ) : (
                <span
                  className="block h-full bg-cream"
                  style={{ width: filled || isCurrent ? "100%" : "0%" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-0 flex-1">
        <button
          type="button"
          className="absolute inset-y-0 left-0 z-10 w-1/3"
          aria-label="Previous scene"
          onClick={() => go(-1)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 z-10 w-1/3"
          aria-label="Next scene"
          onClick={() => go(1)}
        />

        <AnimatePresence mode="wait">
          {ended ? (
            <motion.div
              key="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[70dvh] flex-col items-center justify-center px-8 text-center"
            >
              <p className="font-serif text-3xl leading-tight">That’s our story so far</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/80">
                The rest we get to write together, {SITE.partnerName}.
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={onBack}
                className="mt-8 rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-charcoal"
              >
                Back to home
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 origin-center"
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: SCENE_MS / 1000, ease: "linear" }}
              >
                <MemoryArt motif={scene.motif} />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-charcoal/25" />
              <div className="absolute inset-x-0 bottom-24 z-10 px-6">
                <motion.p
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-[11px] tracking-[0.22em] text-rose uppercase"
                >
                  {scene.date}
                </motion.p>
                <motion.h2
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.22 }}
                  className="mt-2 font-serif text-3xl leading-tight"
                >
                  {scene.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 max-w-sm text-sm leading-relaxed text-cream/85"
                >
                  {scene.body}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!ended && (
        <div className="safe-bottom absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-5 pb-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-cream backdrop-blur-sm"
            aria-label="Previous scene"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setPlaying((value) => !value)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-charcoal"
            aria-label={playing ? "Pause story" : "Play story"}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-cream backdrop-blur-sm"
            aria-label="Next scene"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      )}
    </section>
  );
}
