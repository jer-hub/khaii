"use client";

import { differenceInCalendarDays } from "date-fns";
import { motion, useInView } from "framer-motion";
import {
  Clapperboard,
  Coffee,
  Film,
  Gamepad2,
  HeartHandshake,
  Layers,
  MapPin,
} from "lucide-react";
import { useRef } from "react";
import type { PlayViewId } from "@/data/content";
import { SITE, STATS } from "@/data/content";
import { CountUp } from "@/components/CountUp";

const cards = [
  {
    key: "days",
    label: "Days together",
    icon: HeartHandshake,
    getValue: () =>
      Math.max(1, differenceInCalendarDays(new Date(), new Date(SITE.startDate))),
    tint: "bg-rose/35",
  },
  {
    key: "cities",
    label: "Cities visited",
    icon: MapPin,
    getValue: () => STATS.citiesVisited,
    tint: "bg-sage/35",
  },
  {
    key: "movies",
    label: "Movies watched",
    icon: Film,
    getValue: () => STATS.moviesWatched,
    tint: "bg-rose/25",
  },
  {
    key: "coffee",
    label: "Cups of coffee",
    icon: Coffee,
    getValue: () => STATS.cupsOfCoffee,
    tint: "bg-sage/25",
  },
] as const;

const playCards: {
  id: PlayViewId;
  title: string;
  detail: string;
  icon: typeof Gamepad2;
  tint: string;
}[] = [
  {
    id: "game",
    title: "Memory match",
    detail: "Find the pairs from our days.",
    icon: Gamepad2,
    tint: "bg-rose/40",
  },
  {
    id: "quiz",
    title: "Flashcard quiz",
    detail: "How well do you remember us?",
    icon: Layers,
    tint: "bg-sage/40",
  },
  {
    id: "story",
    title: "Our story",
    detail: "Sit back and watch it unfold.",
    icon: Clapperboard,
    tint: "bg-rose/30",
  },
];

export function HeroStats({ onOpen }: { onOpen: (view: PlayViewId) => void }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.35 });

  return (
    <section className="px-5 pb-6 pt-8">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-medium tracking-[0.26em] text-sage-deep uppercase"
      >
        {SITE.appName}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mt-2 font-serif text-[1.9rem] leading-tight text-charcoal"
      >
        Welcome to Our Story, {SITE.partnerName}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mt-3 max-w-[20rem] text-sm leading-relaxed text-ink"
      >
        A small collection of days, places, and reasons — made just for you.
      </motion.p>

      <div ref={gridRef} className="mt-8 grid grid-cols-2 gap-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.key}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 * index, duration: 0.45 }}
              className="glass rounded-2xl p-4 shadow-[0_10px_30px_rgba(44,44,44,0.05)]"
            >
              <div
                className={`mb-4 flex h-9 w-9 items-center justify-center rounded-full ${card.tint}`}
              >
                <Icon className="h-4 w-4 text-charcoal" />
              </div>
              <p className="font-serif text-3xl text-charcoal">
                <CountUp value={card.getValue()} inView={inView} />
              </p>
              <p className="mt-1 text-xs tracking-wide text-ink">{card.label}</p>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-8">
        <p className="text-xs font-medium tracking-[0.26em] text-sage-deep uppercase">
          Play with me
        </p>
        <div className="mt-3 space-y-2.5">
          {playCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpen(card.id)}
                className="glass flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left shadow-[0_10px_30px_rgba(44,44,44,0.05)]"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.tint}`}
                >
                  <Icon className="h-4 w-4 text-charcoal" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg leading-tight text-charcoal">
                    {card.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink">{card.detail}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
