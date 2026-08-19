"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";

export function CountUp({
  value,
  inView,
}: {
  value: number;
  inView: boolean;
}) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

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
