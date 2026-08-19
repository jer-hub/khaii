"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { SEASON_SECONDS, SEASON_STORY } from "@/data/content";
import { seasonBlend } from "@/components/story/storyClock";

const SeasonWorld = dynamic(
  () => import("@/components/story/SeasonWorld").then((mod) => mod.SeasonWorld),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 h-full w-full animate-pulse bg-[#f3dce6]" />,
  },
);

export function StoryViewer({ onBack }: { onBack: () => void }) {
  const [time, setTime] = useState(0);
  const mix = useMemo(() => seasonBlend(time), [time]);
  const caption = mix.blend > 0.55 ? mix.upcoming : mix.current;

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#f3dce6]">
      <SeasonWorld onTime={setTime} />

      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-cream backdrop-blur-sm"
        aria-label="Close story"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute top-5 right-4 left-14 z-20 flex gap-1">
        {SEASON_STORY.map((season, index) => (
          <div key={season.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
            <motion.span
              className="block h-full bg-cream"
              animate={{
                width:
                  mix.index > index
                    ? "100%"
                    : mix.index === index
                      ? `${Math.min(100, (mix.local / SEASON_SECONDS) * 100)}%`
                      : "0%",
              }}
              transition={{ duration: 0.12, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-charcoal/55 to-transparent px-6 pb-8 pt-16">
        <motion.div
          key={caption.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1 - mix.loopFade, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] tracking-[0.22em] text-rose uppercase">{caption.id}</p>
          <h2 className="mt-1 font-serif text-2xl leading-tight text-cream">{caption.title}</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/85">{caption.line}</p>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[#f3dce6]"
        style={{ opacity: mix.loopFade }}
      />
    </section>
  );
}