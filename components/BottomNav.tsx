"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookHeart, Heart, House, Music, Pause, Ticket } from "lucide-react";
import type { NavTabId, TabId } from "@/data/content";

const items: { id: NavTabId; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "memories", label: "Scrapbook", icon: BookHeart },
  { id: "coupons", label: "Coupons", icon: Ticket },
  { id: "reasons", label: "Reasons", icon: Heart },
];

export function BottomNav({
  tab,
  onChange,
  nowPlaying,
}: {
  tab: TabId;
  onChange: (tab: NavTabId) => void;
  nowPlaying: { title: string; onPause: () => void } | null;
}) {
  return (
    <nav aria-label="Main" className="safe-bottom glass sticky bottom-0 z-30 border-t border-white/70 px-3 pt-2">
      <AnimatePresence>
        {nowPlaying && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            whileTap={{ scale: 0.95 }}
            onClick={nowPlaying.onPause}
            aria-label={`Pause ${nowPlaying.title}`}
            className="glass absolute right-3 bottom-full mb-2 flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3 text-xs text-charcoal shadow-[0_8px_24px_rgba(44,44,44,0.1)]"
          >
            <Music className="h-3.5 w-3.5 animate-pulse text-rose-deep" />
            <span className="max-w-32 truncate">{nowPlaying.title}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-cream">
              <Pause className="h-3.5 w-3.5" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <li key={item.id}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => onChange(item.id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex w-full flex-col items-center gap-1 rounded-2xl py-2 text-[11px] ${
                  active ? "text-charcoal" : "text-ink/70"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-rose/40"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative h-5 w-5 ${active ? "fill-rose text-charcoal" : ""}`}
                />
                <span className="relative font-medium">{item.label}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
