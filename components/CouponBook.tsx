"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Film,
  Gift,
  Heart,
  MapPin,
  Sparkles,
  Sunrise,
} from "lucide-react";
import { COUPONS, type Coupon, type CouponIcon } from "@/data/content";
import { useRedeemedCoupons } from "@/hooks/useRedeemedCoupons";
import { ConfettiBurst } from "@/components/ConfettiBurst";

const ICONS: Record<CouponIcon, typeof Sparkles> = {
  sparkles: Sparkles,
  film: Film,
  sunrise: Sunrise,
  heart: Heart,
  map: MapPin,
  gift: Gift,
};

export function CouponBook() {
  const { isRedeemed, redeem } = useRedeemedCoupons();
  const [burstId, setBurstId] = useState(0);

  function handleRedeem(id: string) {
    if (isRedeemed(id)) return;
    redeem(id);
    setBurstId((n) => n + 1);
  }

  return (
    <section className="px-5 pb-8 pt-6">
      <ConfettiBurst burstId={burstId} />
      <p className="text-xs font-medium tracking-[0.26em] text-sage-deep uppercase">
        Coupon book
      </p>
      <h2 className="mt-1 font-serif text-2xl text-charcoal">Little promises</h2>
      <p className="mt-1 text-sm text-ink">
        Redeem one whenever you like. They stay redeemed, even if you refresh.
      </p>

      <div className="mt-6 space-y-3">
        {COUPONS.map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <CouponCard
              coupon={coupon}
              redeemed={isRedeemed(coupon.id)}
              onRedeem={() => handleRedeem(coupon.id)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CouponCard({
  coupon,
  redeemed,
  onRedeem,
}: {
  coupon: Coupon;
  redeemed: boolean;
  onRedeem: () => void;
}) {
  const Icon = ICONS[coupon.icon];

  return (
    <article className="ticket-notch relative overflow-hidden rounded-2xl px-5 py-4 shadow-[0_10px_28px_rgba(44,44,44,0.06)] ring-1 ring-rose/40">
      <div className="pointer-events-none absolute inset-x-6 top-[52%] border-t border-dashed border-sage/50" />
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose/40">
          <Icon className="h-4 w-4 text-charcoal" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg leading-tight text-charcoal">{coupon.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{coupon.description}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.22em] text-sage-deep uppercase">
          Good for one use
        </span>
        <motion.button
          type="button"
          disabled={redeemed}
          whileTap={redeemed ? undefined : { scale: 0.96 }}
          whileHover={redeemed ? undefined : { scale: 1.03 }}
          onClick={onRedeem}
          className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
            redeemed
              ? "cursor-not-allowed bg-sage/40 text-ink"
              : "bg-charcoal text-cream"
          }`}
        >
          {redeemed ? (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              Redeemed!
            </span>
          ) : (
            "Redeem"
          )}
        </motion.button>
      </div>
    </article>
  );
}
