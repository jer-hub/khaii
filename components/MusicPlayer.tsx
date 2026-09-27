"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useId, useState } from "react";
import type { AudioPlayer } from "@/hooks/useAudioPlayer";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer({ player, title }: { player: AudioPlayer; title: string }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const { playing, muted, currentTime, duration } = player;

  return (
    <motion.div
      layout
      className="glass mt-5 overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(44,44,44,0.05)]"
    >
      <motion.div layout="position" className="flex items-center gap-3 px-4 py-3.5">
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose/40">
            <Music className={`h-4 w-4 text-charcoal ${playing ? "animate-pulse" : ""}`} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-lg leading-tight text-charcoal">{title}</span>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-ink">
              {playing ? "Now playing" : expanded ? "Hide controls" : "Show controls"}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </span>
          </span>
        </button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={player.toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-cream"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </motion.button>
      </motion.div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                disabled={!duration}
                onChange={(event) => player.seek(Number(event.target.value))}
                aria-label="Seek"
                aria-valuetext={`${formatTime(currentTime)} of ${duration ? formatTime(duration) : "unknown"}`}
                className="block h-1.5 w-full cursor-pointer accent-charcoal disabled:cursor-default"
              />

              <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink">
                <span>{formatTime(currentTime)}</span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={player.toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-pressed={muted}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:text-charcoal"
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </motion.button>
                <span>{duration ? formatTime(duration) : "--:--"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
