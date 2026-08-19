"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { QUIZ_CARDS, SITE } from "@/data/content";
import { PlayHeader } from "@/components/PlayHeader";

export function FlashcardQuiz({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const card = QUIZ_CARDS[index];
  const selected = picks[card.id] ?? null;
  const flipped = Boolean(selected);
  const score = QUIZ_CARDS.filter((item) => picks[item.id] === item.answer).length;

  function pick(choice: string) {
    if (selected) return;
    setPicks((current) => ({ ...current, [card.id]: choice }));
  }

  function go(dir: number) {
    const next = index + dir;
    if (next < 0) return;
    if (next >= QUIZ_CARDS.length) {
      if (selected) setDone(true);
      return;
    }
    setIndex(next);
  }

  function reset() {
    setIndex(0);
    setPicks({});
    setDone(false);
  }

  return (
    <section className="px-5 pb-8 pt-6">
      <PlayHeader
        eyebrow="A little quiz"
        title={`How well do you know us, ${SITE.partnerName}?`}
        onBack={onBack}
      />

      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl px-6 py-10 text-center shadow-[0_10px_30px_rgba(44,44,44,0.05)]"
        >
          <p className="font-serif text-3xl text-charcoal">
            {score} / {QUIZ_CARDS.length}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            {score === QUIZ_CARDS.length
              ? "Perfect. You were paying attention — I love that about you."
              : "Some of these are ours to keep retelling. Want another go?"}
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm text-cream"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </motion.button>
        </motion.div>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink">
            Card {index + 1} of {QUIZ_CARDS.length}
          </p>

          <div className="[perspective:1400px]">
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative min-h-[280px]"
            >
              <div
                className="glass absolute inset-0 rounded-3xl p-6 shadow-[0_12px_32px_rgba(44,44,44,0.06)]"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                <p className="text-[11px] tracking-[0.24em] text-sage-deep uppercase">
                  Question
                </p>
                <h3 className="mt-4 font-serif text-[1.45rem] leading-snug text-charcoal">
                  {card.prompt}
                </h3>
                <p className="mt-3 text-xs text-ink">Choose an answer — the card will flip.</p>
              </div>
              <div
                className="glass absolute inset-0 rounded-3xl p-6 shadow-[0_12px_32px_rgba(44,44,44,0.06)]"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <p className="text-[11px] tracking-[0.24em] text-sage-deep uppercase">
                  Answer
                </p>
                <h3 className="mt-4 font-serif text-[1.45rem] leading-snug text-charcoal">
                  {card.answer}
                </h3>
                {selected && (
                  <p
                    className={`mt-4 text-sm ${
                      selected === card.answer ? "text-sage-deep" : "text-rose-deep"
                    }`}
                  >
                    {selected === card.answer
                      ? "That's it."
                      : `You chose “${selected}.”`}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {card.choices.map((choice) => {
              const isPicked = selected === choice;
              const isCorrect = choice === card.answer;
              const show = Boolean(selected);
              return (
                <motion.button
                  key={choice}
                  type="button"
                  whileTap={selected ? undefined : { scale: 0.98 }}
                  disabled={Boolean(selected)}
                  onClick={() => pick(choice)}
                  className={`rounded-2xl px-4 py-3 text-left text-sm ring-1 transition-colors ${
                    show && isCorrect
                      ? "bg-sage/40 text-charcoal ring-sage"
                      : show && isPicked
                        ? "bg-rose/40 text-charcoal ring-rose"
                        : "bg-white/70 text-charcoal ring-white"
                  }`}
                >
                  {choice}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => go(-1)}
              disabled={index === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-sm ring-1 ring-white disabled:opacity-30"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <div className="flex gap-1">
              {QUIZ_CARDS.map((item, dot) => (
                <span
                  key={item.id}
                  className={`h-1.5 w-1.5 rounded-full ${
                    dot === index ? "bg-charcoal" : "bg-sage/50"
                  }`}
                />
              ))}
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => go(1)}
              disabled={!selected}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-cream shadow-sm disabled:opacity-30"
              aria-label={index === QUIZ_CARDS.length - 1 ? "See score" : "Next card"}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </>
      )}
    </section>
  );
}
