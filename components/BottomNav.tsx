"use client";

import { motion } from "framer-motion";
import { BookHeart, Heart, House, Ticket } from "lucide-react";
import type { TabId } from "@/data/content";

const items: { id: TabId; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "memories", label: "Scrapbook", icon: BookHeart },
  { id: "coupons", label: "Coupons", icon: Ticket },
  { id: "reasons", label: "Reasons", icon: Heart },
];

export function BottomNav({
  tab,
  onChange,
}: {
  tab: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav className="safe-bottom glass sticky bottom-0 z-30 border-t border-white/70 px-3 pt-2">
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
