"use client";

import dynamic from "next/dynamic";
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
import { MusicPlayer } from "@/components/MusicPlayer";

function startOfTogether() {
  const [year, month, day] = SITE.startDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const HomeStage = dynamic(
  () => import("@/components/stage/HomeStage").then((mod) => mod.HomeStage),
  {
    ssr: false,
    loading: () => (
      <div className="h-[340px] animate-pulse rounded-[1.6rem] bg-[#f3ebe2]" />
    ),
  },
);

const cards = [
  {
    key: "days",
    label: "Days together",
    icon: HeartHandshake,
    getValue: () => Math.max(1, differenceInCalendarDays(new Date(), startOfTogether())),
  },
  {
    key: "cities",
    label: "Cities",
    icon: MapPin,
    getValue: () => STATS.citiesVisited,
  },
  {
    key: "movies",
    label: "Movies",
    icon: Film,
    getValue: () => STATS.moviesWatched,
  },
  {
    key: "coffee",
    label: "Coffees",
    icon: Coffee,
    getValue: () => STATS.cupsOfCoffee,
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
    detail: "A year with you, in thirty seconds.",
    icon: Clapperboard,
    tint: "bg-rose/30",
  },
];

export function HeroStats({ onOpen }: { onOpen: (view: PlayViewId) => void }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.4 });

  return (
    <section className="px-5 pb-6 pt-7">
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
        className="mt-1.5 font-serif text-[1.75rem] leading-tight text-charcoal"
      >
        Welcome to our story, {SITE.yourName} x {SITE.partnerName}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mt-2 text-sm leading-relaxed text-ink"
      >
        Drag us, drop our photos, then play.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-5"
      >
        <HomeStage />
      </motion.div>

      <div ref={gridRef} className="mt-5 grid grid-cols-4 gap-2">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
              className="glass rounded-2xl px-2 py-3 text-center shadow-[0_8px_24px_rgba(44,44,44,0.04)]"
            >
              <Icon className="mx-auto h-3.5 w-3.5 text-sage-deep" />
              <p className="mt-1 font-serif text-xl text-charcoal">
                <CountUp value={card.getValue()} inView={inView} />
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-ink">{card.label}</p>
            </motion.article>
          );
        })}
      </div>

      <MusicPlayer src="/song.mp3" title="Our Song" />

      <div className="mt-7">
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
