"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValue, useTransform } from "framer-motion";

export function CountUp({
  value,
  inView,
}: {
  value: number;
  inView: boolean;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const controls = animate(motionValue, value, {
      duration: 1.45,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, motionValue, value]);

  return <>{display.toLocaleString()}</>;
}

export function InViewCount({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <span ref={ref} className={className}>
      <CountUp value={value} inView={inView} />
    </span>
  );
}
