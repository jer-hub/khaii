"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ImagePlus, MapPin, Shuffle } from "lucide-react";
import { MEMORIES, type Memory } from "@/data/content";
import { MemoryArt } from "@/components/MemoryArt";
import { readImageFile } from "@/hooks/useAvatars";
import { useMemoryPhotos } from "@/hooks/useMemoryPhotos";

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
  const { photos, setPhoto } = useMemoryPhotos();

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
                photo={photos[memory.id] || memory.photo}
                tilt={tilts[memory.id] ?? 0}
                flipped={Boolean(flipped[memory.id])}
                onToggle={() =>
                  setFlipped((current) => ({
                    ...current,
                    [memory.id]: !current[memory.id],
                  }))
                }
                onPhoto={async (file) => {
                  if (!file?.type.startsWith("image/")) return;
                  setPhoto(memory.id, await readImageFile(file));
                }}
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
  photo,
  tilt,
  flipped,
  onToggle,
  onPhoto,
}: {
  memory: Memory;
  photo?: string;
  tilt: number;
  flipped: boolean;
  onToggle: () => void;
  onPhoto: (file: File | undefined) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = photo && failedSrc !== photo ? photo : undefined;

  return (
    <div className="relative [perspective:1400px]">
      <motion.button
        type="button"
        onClick={onToggle}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setFailedSrc(null);
          onPhoto(event.dataTransfer.files[0]);
        }}
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
          <div className="relative aspect-[4/5] overflow-hidden bg-cream">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setFailedSrc(photo ?? null)}
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
              ) : (
                <p className="mt-2 text-[12px] leading-relaxed text-ink/60">
                  Add a caption in data/content.ts.
                </p>
              )}
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
      {!flipped ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute right-3 bottom-10 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm"
          aria-label={`Set photo for ${memory.title}`}
        >
          <ImagePlus className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          setFailedSrc(null);
          onPhoto(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}
