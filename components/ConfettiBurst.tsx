"use client";

import { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useClientStore";

const COLORS = ["#F4C2C2", "#A9B8A9", "#E39A9A", "#FAF9F6", "#7E917E", "#D4B8A8"];

export function ConfettiBurst({ burstId }: { burstId: number }) {
  const size = useWindowSize();
  const [finishedId, setFinishedId] = useState(0);

  if (!burstId || finishedId === burstId || size.width === 0) return null;

  return (
    <Confetti
      key={burstId}
      width={size.width}
      height={size.height}
      numberOfPieces={180}
      recycle={false}
      gravity={0.18}
      colors={COLORS}
      onConfettiComplete={() => setFinishedId(burstId)}
      style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none" }}
    />
  );
}
