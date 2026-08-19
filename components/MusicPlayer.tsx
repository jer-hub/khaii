"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  src: string;
  title?: string;
}

export function MusicPlayer({ src, title = "Our Song" }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  }, [muted]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  }, []);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="metadata" loop />

      <motion.div
        layout
        className="glass mt-5 overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(44,44,44,0.05)]"
      >
        <motion.div
          layout="position"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose/40">
            <Music className={`h-4 w-4 text-charcoal ${playing ? "animate-pulse" : ""}`} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-lg leading-tight text-charcoal">
              {title}
            </span>
            <span className="mt-0.5 block text-xs text-ink">
              {playing ? "Now playing" : "Tap to expand"}
            </span>
          </span>

          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-cream"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                {/* Progress bar */}
                <div
                  className="group cursor-pointer rounded-full bg-charcoal/10 h-1.5"
                  onClick={seek}
                >
                  <motion.div
                    className="h-full rounded-full bg-charcoal/60"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink">
                  <span>{fmt(progress * duration)}</span>
                  <span>{duration ? fmt(duration) : "--:--"}</span>
                </div>

                <div className="mt-1 flex justify-center">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={toggleMute}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink hover:text-charcoal"
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
