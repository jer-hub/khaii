"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { ArrowUp, Hand, Heart, HeartHandshake, Music } from "lucide-react";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { CHARACTERS, STAGE_ACTIONS, type CharacterId, type StageAction } from "@/data/content";
import { readImageFile, useAvatars } from "@/hooks/useAvatars";
import { DragLayer, type DragOrigin } from "@/components/stage/DragLayer";
import { FloatingHearts } from "@/components/stage/FloatingHearts";
import { Person } from "@/components/stage/Person";

const ACTION_ICONS = {
  wave: Hand,
  hug: HeartHandshake,
  dance: Music,
  kiss: Heart,
  jump: ArrowUp,
} as const;

const DURATIONS: Record<StageAction, number> = {
  wave: 2400,
  hug: 3400,
  dance: 4000,
  kiss: 3000,
  jump: 900,
};

const HOMES: Record<CharacterId, [number, number]> = {
  you: [-0.52, 0.14],
  partner: [0.52, 0.14],
};

export function HomeStage() {
  const { photos, setPhoto } = useAvatars();
  const [action, setAction] = useState<StageAction | "idle">("idle");
  const [grab, setGrab] = useState<CharacterId | null>(null);
  const [you, setYou] = useState({ x: HOMES.you[0], z: HOMES.you[1] });
  const [partner, setPartner] = useState({ x: HOMES.partner[0], z: HOMES.partner[1] });
  const timer = useRef<number>(0);
  const fileYou = useRef<HTMLInputElement>(null);
  const filePartner = useRef<HTMLInputElement>(null);
  const originRef = useRef<DragOrigin>({ x: 0, y: 0, dragged: false });

  function play(next: StageAction) {
    window.clearTimeout(timer.current);
    setGrab(null);
    setAction(next);
    timer.current = window.setTimeout(() => setAction("idle"), DURATIONS[next]);
  }

  async function applyFile(id: CharacterId, file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const dataUrl = await readImageFile(file);
    setPhoto(id, dataUrl);
  }

  const movePerson = useCallback((id: CharacterId, x: number, z: number) => {
    if (id === "you") setYou({ x, z });
    else setPartner({ x, z });
  }, []);

  const releasePerson = useCallback(() => setGrab(null), []);

  const tapPerson = useCallback((id: CharacterId) => {
    if (id === "you") fileYou.current?.click();
    else filePartner.current?.click();
  }, []);

  const hint = useMemo(() => {
    if (grab) return "Drag to move · release to place";
    if (action === "idle") return "Drag us around · tap a head to set a photo";
    const current = STAGE_ACTIONS.find((item) => item.id === action);
    return current?.hint ?? "";
  }, [action, grab]);

  return (
    <div className="relative">
      <div
        className="relative h-[340px] overflow-hidden rounded-[1.6rem] bg-gradient-to-b from-[#efe6dc] via-[#f7efe6] to-[#e7ddd3] shadow-[0_18px_40px_rgba(44,44,44,0.08)] ring-1 ring-white/70"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          const bounds = event.currentTarget.getBoundingClientRect();
          const id: CharacterId =
            event.clientX < bounds.left + bounds.width / 2 ? "you" : "partner";
          void applyFile(id, file);
        }}
      >
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 0.78, 3.35], fov: 38, near: 0.1, far: 20 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ camera }) => camera.lookAt(0, 0.38, 0)}
          className="touch-none h-full w-full"
        >
          <color attach="background" args={["#f3ebe2"]} />
          <Suspense fallback={null}>
            <DragLayer
              grab={grab}
              originRef={originRef}
              onMove={movePerson}
              onRelease={releasePerson}
              onTap={tapPerson}
            />
            <hemisphereLight args={["#fff6ea", "#9aa894", 0.95]} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[2.4, 4.8, 3.4]} intensity={1.25} color="#fff4e8" />
            <pointLight position={[-2.2, 2.4, 1.2]} intensity={0.5} color="#f4c2c2" />

            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.2, 48]} />
              <meshStandardMaterial color="#f7f1ea" roughness={0.9} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <ringGeometry args={[1.45, 1.62, 48]} />
              <meshStandardMaterial color="#eadfd4" roughness={1} />
            </mesh>

            <Person
              photo={photos.you}
              outfit={CHARACTERS.you.outfit}
              accent={CHARACTERS.you.accent}
              hair={CHARACTERS.you.hair}
              home={HOMES.you}
              x={you.x}
              z={you.z}
              side="left"
              action={action}
              grabbed={grab === "you"}
              onPointerDown={(event) => {
                originRef.current = {
                  x: event.nativeEvent.clientX,
                  y: event.nativeEvent.clientY,
                  dragged: false,
                };
                setGrab("you");
              }}
            />
            <Person
              photo={photos.partner}
              outfit={CHARACTERS.partner.outfit}
              accent={CHARACTERS.partner.accent}
              hair={CHARACTERS.partner.hair}
              home={HOMES.partner}
              x={partner.x}
              z={partner.z}
              side="right"
              action={action}
              grabbed={grab === "partner"}
              onPointerDown={(event) => {
                originRef.current = {
                  x: event.nativeEvent.clientX,
                  y: event.nativeEvent.clientY,
                  dragged: false,
                };
                setGrab("partner");
              }}
            />

            <FloatingHearts active={action === "kiss" || action === "hug"} />
            <ContactShadows position={[0, 0, 0]} opacity={0.32} scale={6.5} blur={2.2} far={2.8} />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
          <p className="rounded-full bg-white/55 px-3 py-1 text-[11px] tracking-wide text-ink backdrop-blur-md">
            {hint}
          </p>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between">
          <PhotoButton label={CHARACTERS.you.name} onClick={() => fileYou.current?.click()} />
          <PhotoButton
            label={CHARACTERS.partner.name}
            onClick={() => filePartner.current?.click()}
          />
        </div>

        <input
          ref={fileYou}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            void applyFile("you", event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <input
          ref={filePartner}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            void applyFile("partner", event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {STAGE_ACTIONS.map((item) => {
          const Icon = ACTION_ICONS[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => play(item.id)}
              className={`rounded-2xl px-1 py-2 text-center shadow-sm ring-1 transition-colors ${
                action === item.id
                  ? "bg-charcoal text-cream ring-charcoal"
                  : "bg-white/75 text-charcoal ring-white hover:bg-rose/40"
              }`}
            >
              <Icon className="mx-auto mb-1 h-4 w-4" />
              <span className="block text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhotoButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-medium text-charcoal shadow-sm backdrop-blur-md ring-1 ring-white"
    >
      Photo · {label}
    </button>
  );
}
