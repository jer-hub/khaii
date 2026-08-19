"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, RotateCcw } from "lucide-react";
import { REASONS, SITE } from "@/data/content";

const SWIPE = 90;

export function ReasonsDeck() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const remaining = REASONS.slice(index);
  const visible = remaining.slice(0, 3);
  const done = index >= REASONS.length;

  function go(dir: number) {
    if (done && dir > 0) return;
    setDirection(dir);
    setIndex((current) => Math.min(REASONS.length, Math.max(0, current + dir)));
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE || info.velocity.x > 650) go(1);
    else if (info.offset.x < -SWIPE || info.velocity.x < -650) go(-1);
  }

  return (
    <section className="px-5 pb-8 pt-6">
      <p className="text-xs font-medium tracking-[0.26em] text-sage-deep uppercase">
        Reasons I love you
      </p>
      <h2 className="mt-1 font-serif text-2xl text-charcoal">A little deck, {SITE.partnerName}</h2>
      <p className="mt-1 text-sm text-ink">Swipe the card, or use the arrows.</p>

      <div className="relative mx-auto mt-8 h-[380px] w-full max-w-sm">
        <AnimatePresence initial={false} custom={direction}>
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-x-4 top-8 flex h-[300px] flex-col items-center justify-center rounded-3xl bg-white px-8 text-center shadow-[0_16px_40px_rgba(44,44,44,0.08)] ring-1 ring-black/5"
            >
              <Heart className="mb-4 h-8 w-8 fill-rose text-rose-deep" />
              <p className="font-serif text-2xl text-charcoal">That&apos;s all — for now</p>
              <p className="mt-2 text-sm text-ink">
                There will always be more. Want to read them again?
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setDirection(-1);
                  setIndex(0);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm text-cream"
              >
                <RotateCcw className="h-4 w-4" />
                Start over
              </motion.button>
            </motion.div>
          ) : (
            visible
              .map((reason, stackIndex) => {
                const isTop = stackIndex === 0;
                return (
                  <motion.article
                    key={reason.id}
                    custom={direction}
                    initial={{ scale: 0.94, y: 24, opacity: 0 }}
                    animate={{
                      scale: 1 - stackIndex * 0.05,
                      y: stackIndex * 14,
                      opacity: 1,
                      x: 0,
                      rotate: 0,
                    }}
                    exit={{
                      x: direction * 280,
                      opacity: 0,
                      rotate: direction * 12,
                      transition: { duration: 0.32 },
                    }}
                    drag={isTop ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.86}
                    onDragEnd={isTop ? handleDragEnd : undefined}
                    whileDrag={{ cursor: "grabbing" }}
                    style={{ zIndex: 10 - stackIndex }}
                    className="absolute inset-x-2 top-0 h-[320px] cursor-grab rounded-3xl bg-white p-7 shadow-[0_18px_40px_rgba(44,44,44,0.1)] ring-1 ring-black/5"
                  >
                    <p className="text-[11px] tracking-[0.24em] text-sage-deep uppercase">
                      Reason {index + stackIndex + 1} of {REASONS.length}
                    </p>
                    <h3 className="mt-5 font-serif text-[1.7rem] leading-tight text-charcoal">
                      {reason.title}
                    </h3>
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-ink">{reason.body}</p>
                    {isTop && (
                      <div className="absolute right-6 bottom-6">
                        <Heart className="h-5 w-5 fill-rose text-rose" />
                      </div>
                    )}
                  </motion.article>
                );
              })
              .reverse()
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2 flex items-center justify-center gap-5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-md ring-1 ring-white disabled:opacity-30"
          aria-label="Previous reason"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <p className="min-w-16 text-center text-sm text-ink">
          {Math.min(index + 1, REASONS.length)} / {REASONS.length}
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => go(1)}
          disabled={done}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-cream shadow-md disabled:opacity-30"
          aria-label="Next reason"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </section>
  );
}
