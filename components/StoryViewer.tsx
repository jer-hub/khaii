"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, X } from "lucide-react";
import { SEASON_SECONDS, SEASON_STORY } from "@/data/content";
import { seasonBlend } from "@/components/story/storyClock";

const SeasonWorld = dynamic(
  () => import("@/components/story/SeasonWorld").then((mod) => mod.SeasonWorld),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-[#f3dce6]" />,
  },
);

export function StoryViewer({ onBack }: { onBack: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0.01);
  const [muted, setMuted] = useState(false);
  const mix = useMemo(() => seasonBlend(time), [time]);
  const caption = mix.blend > 0.55 ? mix.upcoming : mix.current;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
    if (!audio.muted && audio.paused) audio.play().catch(() => {});
  }

  return (
    <section className="relative h-full w-full overflow-hidden bg-[#f3dce6]">
      <audio ref={audioRef} src="/story.mp3" loop />
      <SeasonWorld onTime={setTime} />

      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-cream backdrop-blur-sm"
        aria-label="Close story"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-cream backdrop-blur-sm"
        aria-label={muted ? "Unmute story music" : "Mute story music"}
        aria-pressed={muted}
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      <div className="absolute top-[1.4rem] right-16 left-16 z-20 flex gap-1" aria-hidden>
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-charcoal/55 to-transparent px-6 pb-7 pt-10">
        <motion.div
          key={caption.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          aria-live="polite"
        >
          <p className="text-[11px] tracking-[0.22em] text-rose uppercase">{caption.id}</p>
          <h2 className="mt-1 font-serif text-2xl leading-tight text-cream">{caption.title}</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/85">{caption.line}</p>
        </motion.div>
      </div>
    </section>
  );
}
