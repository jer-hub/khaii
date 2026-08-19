"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin, Shuffle } from "lucide-react";
import { MEMORIES, type Memory } from "@/data/content";
import { MemoryArt } from "@/components/MemoryArt";

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function MemoryCards() {
  const [order, setOrder] = useState<Memory[]>(MEMORIES);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const tilts = useMemo(
    () => Object.fromEntries(order.map((memory) => [memory.id, memory.tilt])),
    [order],
  );

  function handleShuffle() {
    setFlipped({});
    setOrder((current) => shuffle(current));
  }

  return (
    <section className="px-5 pb-8 pt-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.26em] text-sage-deep uppercase">
            Scrapbook
          </p>
          <h2 className="mt-1 font-serif text-2xl text-charcoal">Our memories</h2>
          <p className="mt-1 text-sm text-ink">Tap a polaroid to flip it over.</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.94, rotate: -18 }}
          whileHover={{ scale: 1.04 }}
          onClick={handleShuffle}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-charcoal px-3 py-2 text-xs font-medium text-cream shadow-[0_8px_20px_rgba(44,44,44,0.16)]"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Shuffle
        </motion.button>
      </div>

      <motion.div layout className="grid grid-cols-2 gap-3">
        <AnimatePresence initial={false}>
          {order.map((memory, index) => (
            <motion.div
              layout
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
        </AnimatePresence>
      </motion.div>
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
            <MemoryArt motif={memory.motif} />
          </div>
          <p className="mt-3 px-1 text-center font-serif text-sm text-charcoal">
            {memory.title}
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
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="font-serif text-base leading-snug text-charcoal">{memory.title}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-ink">{memory.story}</p>
            </div>
            <div className="mt-3 space-y-1 text-[11px] text-ink/80">
              <p className="flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3" />
                {memory.date}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                {memory.location}
              </p>
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
