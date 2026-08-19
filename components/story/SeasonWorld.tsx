"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CHARACTERS, STORY_LOOP_SECONDS } from "@/data/content";
import { useAvatars } from "@/hooks/useAvatars";
import { FloatingHearts } from "@/components/stage/FloatingHearts";
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

function Scene() {
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
  const fog = useRef<THREE.Fog>(null);
  const sky = useRef<THREE.Color>(null);
  const fogColor = useMemo(() => new THREE.Color("#f7e9ee"), []);
  const skyColor = useMemo(() => new THREE.Color("#f3dce6"), []);
  const groundColor = useMemo(() => new THREE.Color("#8fbe8a"), []);
  const [action, setAction] = useState<PersonAction>("walk");
  const actionRef = useRef<PersonAction>("walk");

  useFrame((state) => {
    const t = wrapStoryTime(state.clock.elapsedTime);
    const mix = seasonBlend(t);
    skyColor.set(mix.current.sky).lerp(scratch.set(mix.upcoming.sky), mix.blend);
    groundColor.set(mix.current.ground).lerp(scratch.set(mix.upcoming.ground), mix.blend);
    fogColor.set(mix.current.fog).lerp(scratch.set(mix.upcoming.fog), mix.blend);
    if (sky.current) sky.current.copy(skyColor);
    if (fog.current) {
      fog.current.color.copy(fogColor);
      fog.current.near = 5.5 - mix.blend * 1.2;
      fog.current.far = 15 - mix.blend * 2;
    }
    if (ground.current) ground.current.color.copy(groundColor);
    if (sun.current) {
      sun.current.color.set(mix.current.light).lerp(scratch.set(mix.upcoming.light), mix.blend);
    }
    if (world.current) world.current.position.z = (t / STORY_LOOP_SECONDS) * WORLD_LENGTH;

    const pulse = mix.blend * 0.5;
    const aspect = state.camera instanceof THREE.PerspectiveCamera ? state.camera.aspect : 0.5;
    const nextAction = actionForTime(t);
    const hugging = nextAction === "hug";
    const dist = aspect < 0.75 ? 4.55 : 4.15;
    state.camera.position.set(
      Math.sin(t * 0.22) * (hugging ? 0.06 : 0.32),
      0.82 + Math.sin(t * 0.18) * 0.04 + pulse * 0.06 - (hugging ? 0.1 : 0),
      dist - pulse * 0.28 - mix.loopFade * 0.35 - (hugging ? 0.7 : 0),
    );
    state.camera.lookAt(0, hugging ? 0.34 : 0.4, 0);
    if (nextAction !== actionRef.current) {
      actionRef.current = nextAction;
      setAction(nextAction);
    }

    const left = coupleOffset(t, "left");
    const right = coupleOffset(t, "right");
    if (youGroup.current) youGroup.current.position.set(left.x + 0.28, 0, left.z - 0.12);
    if (partnerGroup.current) partnerGroup.current.position.set(right.x - 0.28, 0, right.z - 0.12);

    if (petal.current) petal.current.opacity = seasonOpacity(mix.index, mix.next, mix.blend, 0, 0.9, 0.04);
    if (spark.current) spark.current.opacity = seasonOpacity(mix.index, mix.next, mix.blend, 1, 0.75, 0.04);
    if (leaf.current) leaf.current.opacity = seasonOpacity(mix.index, mix.next, mix.blend, 2, 0.9, 0.04);
    if (snow.current) snow.current.opacity = seasonOpacity(mix.index, mix.next, mix.blend, 3, 0.95, 0.04);
  });

  return (
    <>
      <color ref={sky} attach="background" args={["#f3dce6"]} />
      <fog ref={fog} attach="fog" args={["#f7e9ee", 6, 16]} />
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
          home={[-0.28, 0.12]}
          x={-0.28}
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
          home={[0.28, 0.12]}
          x={0.28}
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
      <FloatingHearts active={action === "hug"} />
      <ContactShadows position={[0, 0, 0]} opacity={0.28} scale={10} blur={2.4} far={3} />
    </>
  );
}

export function SeasonWorld() {
  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.82, 4.35], fov: 40, near: 0.1, far: 24 }}
        gl={{ antialias: true }}
        className="h-full w-full"
        style={{ display: "block", width: "100%", height: "100%" }}
        resize={{ debounce: 0 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
