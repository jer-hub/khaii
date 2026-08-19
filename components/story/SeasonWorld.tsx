"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CHARACTERS, STORY_LOOP_SECONDS } from "@/data/content";
import { useAvatars } from "@/hooks/useAvatars";
import { Person, type PersonAction } from "@/components/stage/Person";
import {
  AutumnSet,
  SeasonParticles,
  SpringSet,
  SummerSet,
  WinterSet,
} from "@/components/story/SeasonDecor";
import { actionForTime, coupleOffset, seasonBlend, wrapStoryTime } from "@/components/story/storyClock";

const scratch = new THREE.Color();
const WORLD_LENGTH = 36;

function seasonOpacity(index: number, next: number, blend: number, season: number, on: number, off: number) {
  if (index === season) return on * (1 - blend) + off * blend;
  if (next === season) return off * (1 - blend) + on * blend;
  return off;
}

function Scene({ onTime }: { onTime: (t: number) => void }) {
  const { scene, camera } = useThree();
  const { photos } = useAvatars();
  const world = useRef<THREE.Group>(null);
  const youGroup = useRef<THREE.Group>(null);
  const partnerGroup = useRef<THREE.Group>(null);
  const ground = useRef<THREE.MeshStandardMaterial>(null);
  const petal = useRef<THREE.MeshBasicMaterial>(null);
  const leaf = useRef<THREE.MeshBasicMaterial>(null);
  const snow = useRef<THREE.MeshBasicMaterial>(null);
  const spark = useRef<THREE.MeshBasicMaterial>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const fogColor = useMemo(() => new THREE.Color("#f7e9ee"), []);
  const skyColor = useMemo(() => new THREE.Color("#f3dce6"), []);
  const groundColor = useMemo(() => new THREE.Color("#8fbe8a"), []);
  const lastUi = useRef(0);
  const [action, setAction] = useState<PersonAction>("walk");
  const actionRef = useRef<PersonAction>("walk");

  if (!scene.fog) scene.fog = new THREE.Fog("#f7e9ee", 6, 16);

  useFrame(({ clock }) => {
    const t = wrapStoryTime(clock.elapsedTime);
    const mix = seasonBlend(t);
    skyColor.set(mix.current.sky).lerp(scratch.set(mix.upcoming.sky), mix.blend);
    groundColor.set(mix.current.ground).lerp(scratch.set(mix.upcoming.ground), mix.blend);
    fogColor.set(mix.current.fog).lerp(scratch.set(mix.upcoming.fog), mix.blend);
    scene.background = skyColor;
    const fog = scene.fog as THREE.Fog;
    fog.color.copy(fogColor);
    fog.near = 5.5 - mix.blend * 1.2;
    fog.far = 15 - mix.blend * 2;
    if (ground.current) ground.current.color.copy(groundColor);
    if (sun.current) {
      sun.current.color.set(mix.current.light).lerp(scratch.set(mix.upcoming.light), mix.blend);
    }
    if (world.current) world.current.position.z = (t / STORY_LOOP_SECONDS) * WORLD_LENGTH;

    const pulse = mix.blend * 0.5;
    camera.position.set(
      Math.sin(t * 0.22) * 0.55,
      1.42 + Math.sin(t * 0.18) * 0.08 + pulse * 0.14,
      3.55 - pulse * 0.6 - mix.loopFade * 0.85,
    );
    camera.lookAt(0, 0.72, 0);

    const nextAction = actionForTime(t);
    if (nextAction !== actionRef.current) {
      actionRef.current = nextAction;
      setAction(nextAction);
    }

    const left = coupleOffset(t, "left");
    const right = coupleOffset(t, "right");
    if (youGroup.current) youGroup.current.position.set(left.x + 0.34, 0, left.z - 0.12);
    if (partnerGroup.current) partnerGroup.current.position.set(right.x - 0.34, 0, right.z - 0.12);

    if (petal.current) petal.current.opacity = seasonOpacity(mix.index, mix.next, mix.blend, 0, 0.9, 0.04);
    if (spark.current) spark.current.opacity = seasonOpacity(mix.index, mix.next, mix.blend, 1, 0.75, 0.04);
    if (leaf.current) leaf.current.opacity = seasonOpacity(mix.index, mix.next, mix.blend, 2, 0.9, 0.04);
    if (snow.current) snow.current.opacity = seasonOpacity(mix.index, mix.next, mix.blend, 3, 0.95, 0.04);

    if (t - lastUi.current > 0.08 || t < lastUi.current) {
      lastUi.current = t;
      onTime(t);
    }
  });

  return (
    <>
      <color attach="background" args={["#f3dce6"]} />
      <hemisphereLight args={["#fff6ea", "#8aa08a", 0.9]} />
      <ambientLight intensity={0.55} />
      <directionalLight ref={sun} position={[3, 5, 2]} intensity={1.15} color="#fff1dc" />
      <pointLight position={[0, 2.2, 1]} intensity={0.35} color="#f4c2c2" />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial ref={ground} color="#8fbe8a" roughness={0.92} />
      </mesh>

      <group ref={world}>
        <SpringSet z={0} />
        <SummerSet z={-9} />
        <AutumnSet z={-18} />
        <WinterSet z={-27} />
        <SpringSet z={-36} />
      </group>

      <group ref={youGroup}>
        <Person
          photo={photos.you}
          outfit={CHARACTERS.you.outfit}
          accent={CHARACTERS.you.accent}
          hair={CHARACTERS.you.hair}
          home={[-0.34, 0.12]}
          x={-0.34}
          z={0.12}
          side="left"
          action={action}
          scripted
        />
      </group>
      <group ref={partnerGroup}>
        <Person
          photo={photos.partner}
          outfit={CHARACTERS.partner.outfit}
          accent={CHARACTERS.partner.accent}
          hair={CHARACTERS.partner.hair}
          home={[0.34, 0.12]}
          x={0.34}
          z={0.12}
          side="right"
          action={action}
          scripted
        />
      </group>

      <SeasonParticles kind="petals" amount={28} materialRef={petal} />
      <SeasonParticles kind="spark" amount={14} materialRef={spark} />
      <SeasonParticles kind="leaves" amount={24} materialRef={leaf} />
      <SeasonParticles kind="snow" amount={40} materialRef={snow} />
      <ContactShadows position={[0, 0, 0]} opacity={0.28} scale={10} blur={2.4} far={3} />
    </>
  );
}

export function SeasonWorld({ onTime }: { onTime: (t: number) => void }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.42, 3.55], fov: 38, near: 0.1, far: 24 }}
        gl={{ antialias: true }}
        className="h-full w-full"
      >
        <Scene onTime={onTime} />
      </Canvas>
    </div>
  );
}
