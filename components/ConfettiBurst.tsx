"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const COLORS = ["#F4C2C2", "#A9B8A9", "#E39A9A", "#FAF9F6", "#7E917E", "#D4B8A8"];

export function ConfettiBurst({ burstId }: { burstId: number }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const measure = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!burstId) return;
    setActive(true);
    const timer = window.setTimeout(() => setActive(false), 3800);
    return () => window.clearTimeout(timer);
  }, [burstId]);

  if (!active || size.width === 0) return null;

  return (
    <Confetti
      width={size.width}
      height={size.height}
      numberOfPieces={180}
      recycle={false}
      gravity={0.18}
      colors={COLORS}
      style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none" }}
    />
  );
}
