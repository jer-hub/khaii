"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { MEMORIES, type Memory } from "@/data/content";
import { MemoryArt } from "@/components/MemoryArt";

export function MemoryCards() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const tilts = useMemo(
    () => Object.fromEntries(MEMORIES.map((memory) => [memory.id, memory.tilt])),
    [],
  );

  return (
    <section className="px-5 pb-8 pt-6">
      <div className="mb-5">
        <p className="text-xs font-medium tracking-[0.26em] text-sage-deep uppercase">
          Scrapbook
        </p>
        <h2 className="mt-1 font-serif text-2xl text-charcoal">Our memories</h2>
        <p className="mt-1 text-sm text-ink">Tap a polaroid to flip it over.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MEMORIES.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: index * 0.04 }}
          >
            <PolaroidCard
              memory={memory}
              tilt={tilts[memory.id] ?? 0}
              flipped={Boolean(flipped[memory.id])}
              onToggle={() =>
                setFlipped((current) => ({
                  ...current,
                  [memory.id]: !current[memory.id],
                }))
              }
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PolaroidCard({
  memory,
  tilt,
  flipped,
  onToggle,
}: {
  memory: Memory;
  tilt: number;
  flipped: boolean;
  onToggle: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const src = memory.photo && !failed ? memory.photo : undefined;

  return (
    <div className="[perspective:1400px]">
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
        animate={{ rotateY: flipped ? 180 : 0, rotateZ: flipped ? 0 : tilt }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative block w-full origin-center text-left"
        aria-pressed={flipped}
        aria-label={`${memory.title}. ${flipped ? "Showing story" : "Tap to flip"}`}
      >
        <div
          className="polaroid-shadow rounded-md bg-white p-2 pb-8"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="aspect-[4/5] overflow-hidden bg-cream">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setFailed(true)}
              />
            ) : (
              <MemoryArt motif={memory.motif} />
            )}
          </div>
          <p className="mt-3 px-1 text-center font-serif text-sm text-charcoal">
            {memory.title || "Caption"}
          </p>
        </div>

        <div
          className="polaroid-shadow absolute inset-0 rounded-md bg-white p-3"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="min-h-0 overflow-y-auto">
              <p className="font-serif text-base leading-snug text-charcoal">
                {memory.title || "Caption"}
              </p>
              {memory.story ? (
                <p className="mt-2 text-[12px] leading-relaxed text-ink">{memory.story}</p>
              ) : null}
            </div>
            <div className="mt-3 space-y-1 text-[11px] text-ink/80">
              {memory.date ? (
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="h-3 w-3" />
                  {memory.date}
                </p>
              ) : null}
              {memory.location ? (
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  {memory.location}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
