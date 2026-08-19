"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { GAME_PAIRS, type ArtMotif } from "@/data/content";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { MemoryArt } from "@/components/MemoryArt";
import { PlayHeader } from "@/components/PlayHeader";

type Tile = {
  uid: string;
  pairId: string;
  motif: ArtMotif;
  label: string;
};

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function deal(): Tile[] {
  return shuffle(
    GAME_PAIRS.flatMap((pair) => [
      { uid: `${pair.id}-a`, pairId: pair.id, motif: pair.motif, label: pair.label },
      { uid: `${pair.id}-b`, pairId: pair.id, motif: pair.motif, label: pair.label },
    ]),
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function winMessage(seconds: number) {
  if (seconds <= 25) return "ikaw na naay photographic eh";
  if (seconds <= 50) return "weakshit malala";
  return "wa jud, bugo jud ka!";
}

export function MemoryGame({ onBack }: { onBack: () => void }) {
  const [tiles, setTiles] = useState<Tile[]>(deal);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const won = matched.length === GAME_PAIRS.length;

  useEffect(() => {
    if (!running || won) return;
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [running, won]);

  function reset() {
    setTiles(deal());
    setFlipped([]);
    setMatched([]);
    setLocked(false);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
  }

  function handleFlip(uid: string, pairId: string) {
    if (locked || won || flipped.includes(uid) || matched.includes(pairId)) return;
    setRunning(true);

    if (flipped.length === 0) {
      setFlipped([uid]);
      return;
    }

    const first = tiles.find((tile) => tile.uid === flipped[0]);
    if (!first) return;

    const nextFlipped = [flipped[0], uid];
    setFlipped(nextFlipped);
    setMoves((value) => value + 1);
    setLocked(true);

    if (first.pairId === pairId) {
      const nextMatched = [...matched, pairId];
      window.setTimeout(() => {
        setMatched(nextMatched);
        setFlipped([]);
        setLocked(false);
        if (nextMatched.length === GAME_PAIRS.length) {
          setBurstId((value) => value + 1);
        }
      }, 420);
      return;
    }

    window.setTimeout(() => {
      setFlipped([]);
      setLocked(false);
    }, 850);
  }

  return (
    <section className="px-5 pb-8 pt-6">
      <ConfettiBurst burstId={burstId} />
      <PlayHeader eyebrow="A little game" title="Find our pairs" onBack={onBack} />

      <div className="mb-4 flex items-center justify-between text-sm text-ink">
        <p>Moves · {moves}</p>
        <p>Time · {formatTime(seconds)}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {tiles.map((tile) => {
          const isFaceUp =
            flipped.includes(tile.uid) || matched.includes(tile.pairId);
          return (
            <GameTile
              key={tile.uid}
              motif={tile.motif}
              label={tile.label}
              faceUp={isFaceUp}
              matched={matched.includes(tile.pairId)}
              onFlip={() => handleFlip(tile.uid, tile.pairId)}
            />
          );
        })}
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mt-5 rounded-2xl px-5 py-4 text-center shadow-[0_10px_30px_rgba(44,44,44,0.05)]"
        >
          <p className="font-serif text-xl text-charcoal">{winMessage(seconds)}</p>
          <p className="mt-1 text-sm text-ink">
            {moves} moves in {formatTime(seconds)}.
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={reset}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm text-cream"
          >
            <RotateCcw className="h-4 w-4" />
            Play again
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}

function GameTile({
  motif,
  label,
  faceUp,
  matched,
  onFlip,
}: {
  motif: ArtMotif;
  label: string;
  faceUp: boolean;
  matched: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="[perspective:900px]">
      <motion.button
        type="button"
        onClick={onFlip}
        whileTap={{ scale: 0.96 }}
        animate={{ rotateY: faceUp ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative block aspect-square w-full rounded-xl ${
          matched ? "ring-2 ring-sage" : ""
        }`}
        aria-label={faceUp ? label : "Hidden card"}
        aria-pressed={faceUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-charcoal/90 text-rose"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <span className="font-serif text-lg text-rose">?</span>
        </div>
        <div
          className="absolute inset-0 overflow-hidden rounded-xl bg-white"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <MemoryArt motif={motif} />
        </div>
      </motion.button>
    </div>
  );
}
