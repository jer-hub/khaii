"use client";

import { useMemo, useRef, type Ref } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { StageAction } from "@/data/content";

export type PersonAction = StageAction | "idle" | "walk";

type PersonProps = {
  photo: string;
  outfit: string;
  accent: string;
  hair: string;
  home: [number, number];
  x: number;
  z: number;
  side: "left" | "right";
  action: PersonAction;
  grabbed?: boolean;
  scripted?: boolean;
  facingY?: number;
  onPointerDown?: (event: { nativeEvent: PointerEvent }) => void;
};

type Limb = { out: number; raise: number; elbow: number };
type Wrist = { flick: number; twist: number };
type Leg = { lift: number; knee: number };

type Pose = {
  hop: number;
  hipsY: number;
  hipsTilt: number;
  spineBend: number;
  chestTwist: number;
  headTilt: number;
  headTurn: number;
  faceY: number;
  armL: Limb;
  armR: Limb;
  wristL: Wrist;
  wristR: Wrist;
  legL: Leg;
  legR: Leg;
};

const HIP_Y = 0.24;

const REST: Pose = {
  hop: 0,
  hipsY: 0,
  hipsTilt: 0,
  spineBend: 0,
  chestTwist: 0,
  headTilt: 0,
  headTurn: 0,
  faceY: 0,
  armL: { out: 0.82, raise: 0.38, elbow: 0.92 },
  armR: { out: -0.82, raise: 0.38, elbow: 0.92 },
  wristL: { flick: 0.18, twist: 0.22 },
  wristR: { flick: 0.18, twist: -0.22 },
  legL: { lift: 0.06, knee: 0.12 },
  legR: { lift: 0.06, knee: 0.12 },
};

function poseFor(
  action: PersonAction,
  elapsed: number,
  t: number,
  side: "left" | "right",
  grabbed: boolean,
  phase: number,
): Pose {
  const inward = side === "left" ? 1 : -1;
  const breathe = 0.018 + Math.sin(t * 2.6 + phase) * 0.02;
  const sway = Math.sin(t * 1.35 + phase) * 0.05;
  const pose: Pose = {
    ...REST,
    hop: breathe,
    hipsTilt: sway,
    spineBend: Math.sin(t * 2.2 + phase) * 0.03,
    headTilt: Math.sin(t * 1.4 + phase) * 0.05,
    armL: { ...REST.armL },
    armR: { ...REST.armR },
    wristL: { ...REST.wristL, flick: REST.wristL.flick + Math.sin(t * 2.6 + phase) * 0.1 },
    wristR: { ...REST.wristR, flick: REST.wristR.flick + Math.sin(t * 2.6 + phase + 0.7) * 0.1 },
    legL: { ...REST.legL },
    legR: { ...REST.legR },
  };

  if (grabbed) {
    pose.hop = 0.05;
    pose.hipsY = -0.04;
    pose.legL.knee = 0.45;
    pose.legR.knee = 0.45;
    pose.armL = { out: 0.7, raise: 0.35, elbow: 0.6 };
    pose.armR = { out: -0.7, raise: 0.35, elbow: 0.6 };
    pose.wristL = { flick: 0.35, twist: 0.2 };
    pose.wristR = { flick: 0.35, twist: -0.2 };
    pose.headTilt = 0.12;
    return pose;
  }

  if (action === "walk") {
    // Contact / down / passing / up, with arm-lead then elbow then wrist drag.
    const cadence = t * 9.2 + phase;
    const left = Math.sin(cadence);
    const right = Math.sin(cadence + Math.PI);
    const down = Math.abs(Math.sin(cadence * 2));
    const elbowLag = 0.42;
    const wristLag = 0.85;
    pose.hop = down * 0.07;
    pose.hipsY = -down * 0.02;
    pose.hipsTilt = left * 0.11;
    pose.chestTwist = -left * 0.16;
    pose.spineBend = down * 0.05;
    pose.headTurn = left * 0.07;
    pose.headTilt = -down * 0.04;
    pose.armL = {
      out: 0.72 + Math.abs(right) * 0.18,
      raise: 0.32 + right * 0.7,
      elbow: 0.7 + Math.max(0, -Math.sin(cadence + Math.PI + elbowLag)) * 0.45,
    };
    pose.armR = {
      out: -0.72 - Math.abs(left) * 0.18,
      raise: 0.32 + left * 0.7,
      elbow: 0.7 + Math.max(0, -Math.sin(cadence + elbowLag)) * 0.45,
    };
    pose.wristL = {
      flick: Math.sin(cadence + Math.PI + wristLag) * 0.55,
      twist: Math.sin(cadence + Math.PI + wristLag) * 0.65,
    };
    pose.wristR = {
      flick: Math.sin(cadence + wristLag) * 0.55,
      twist: -Math.sin(cadence + wristLag) * 0.65,
    };
    pose.legL = {
      lift: 0.06 + Math.max(0, left) * 0.58,
      knee: 0.12 + Math.max(0, left) * 0.72 + down * 0.1,
    };
    pose.legR = {
      lift: 0.06 + Math.max(0, right) * 0.58,
      knee: 0.12 + Math.max(0, right) * 0.72 + down * 0.1,
    };
  } else if (action === "wave") {
    const flap = Math.sin(elapsed * 16.5);
    const snap = Math.sign(flap) * Math.pow(Math.abs(flap), 0.65);
    pose.armR = { out: -1.45, raise: 0.15 + snap * 0.55, elbow: 0.7 + Math.abs(snap) * 0.35 };
    pose.wristR = { flick: Math.sin(elapsed * 16.5 + 0.5) * 0.95, twist: 0.55 + snap * 0.45 };
    pose.armL = { out: 0.72, raise: 0.35, elbow: 0.85 };
    pose.wristL = { flick: 0.12, twist: 0.18 };
    pose.hipsTilt = -0.14 * inward;
    pose.headTilt = 0.14;
    pose.headTurn = -0.28 * inward;
    pose.chestTwist = 0.22 * inward;
  } else if (action === "hug") {
    pose.faceY = 0.55 * inward;
    pose.spineBend = 0.18;
    pose.headTilt = 0.18;
    pose.headTurn = 0.35 * inward;
    pose.armL = { out: 1.05, raise: 0.15, elbow: 1.05 };
    pose.armR = { out: -1.05, raise: 0.15, elbow: 1.05 };
    pose.wristL = { flick: 0.45, twist: 0.7 * inward };
    pose.wristR = { flick: 0.45, twist: 0.7 * inward };
    pose.hipsY = -0.02;
    pose.legL.lift = 0.18;
    pose.legR.lift = 0.05;
  } else if (action === "dance") {
    const beat = Math.sin(elapsed * 10.4);
    const bounce = Math.abs(Math.sin(elapsed * 10.4));
    const snap = Math.sign(beat) * Math.pow(Math.abs(beat), 0.55);
    pose.hop = bounce * 0.12;
    pose.hipsTilt = snap * 0.32;
    pose.chestTwist = Math.sin(elapsed * 5.2) * 0.42;
    pose.headTurn = -snap * 0.24;
    pose.armL = { out: 1.05 + snap * 0.35, raise: 0.15 + bounce * 0.75, elbow: 0.7 + bounce * 0.35 };
    pose.armR = { out: -1.05 - snap * 0.35, raise: 0.15 + bounce * 0.75, elbow: 0.7 + bounce * 0.35 };
    pose.wristL = { flick: snap * 0.7, twist: bounce * 0.9 };
    pose.wristR = { flick: -snap * 0.7, twist: -bounce * 0.9 };
    pose.legL = { lift: 0.1 + Math.max(0, beat) * 0.5, knee: 0.32 + bounce * 0.45 };
    pose.legR = { lift: 0.1 + Math.max(0, -beat) * 0.5, knee: 0.32 + bounce * 0.45 };
  } else if (action === "kiss") {
    pose.faceY = 0.72 * inward;
    pose.spineBend = 0.32;
    pose.headTilt = -0.22 * inward;
    pose.headTurn = 0.28 * inward;
    pose.hop = Math.sin(elapsed * 5) * 0.012;
    pose.armL = { out: 0.9, raise: 0.2, elbow: 0.95 };
    pose.armR = { out: -0.9, raise: 0.2, elbow: 0.95 };
    pose.wristL = { flick: 0.25, twist: 0.35 * inward };
    pose.wristR = { flick: 0.25, twist: 0.35 * inward };
    pose.legL.lift = side === "left" ? 0.22 : 0.08;
    pose.legR.lift = side === "right" ? 0.22 : 0.08;
  } else if (action === "jump") {
    const crouch = Math.min(1, elapsed / 0.1);
    if (elapsed < 0.1) {
      pose.hipsY = -0.1 * crouch;
      pose.legL.knee = 0.9 * crouch;
      pose.legR.knee = 0.9 * crouch;
      pose.armL = { out: 0.85, raise: 0.45, elbow: 0.85 };
      pose.armR = { out: -0.85, raise: 0.45, elbow: 0.85 };
      pose.wristL = { flick: 0.2, twist: 0.15 };
      pose.wristR = { flick: 0.2, twist: -0.15 };
      pose.spineBend = 0.2;
    } else {
      const air = Math.sin(Math.min(1, (elapsed - 0.1) / 0.36) * Math.PI);
      if (elapsed > 0.46) {
        const land = Math.min(1, (elapsed - 0.46) / 0.18);
        pose.hop = 0;
        pose.hipsY = -0.06 * (1 - land);
        pose.legL.knee = 0.55 * (1 - land) + 0.12 * land;
        pose.legR.knee = 0.55 * (1 - land) + 0.12 * land;
        pose.armL = { out: 0.78, raise: 0.35, elbow: 0.8 };
        pose.armR = { out: -0.78, raise: 0.35, elbow: 0.8 };
      } else {
        pose.hop = air * 0.5;
        pose.legL = { lift: -0.15, knee: 0.55 };
        pose.legR = { lift: -0.15, knee: 0.55 };
        pose.armL = { out: 0.95, raise: 0.85, elbow: 0.25 };
        pose.armR = { out: -0.95, raise: 0.85, elbow: 0.25 };
        pose.wristL = { flick: -0.4, twist: 0.2 };
        pose.wristR = { flick: -0.4, twist: -0.2 };
        pose.headTilt = -0.08;
      }
    }
  }

  return pose;
}

function ChibiArm({
  side,
  outfit,
  skin,
  arm,
  elbow,
  wrist,
}: {
  side: "left" | "right";
  outfit: string;
  skin: string;
  arm: Ref<THREE.Group>;
  elbow: Ref<THREE.Group>;
  wrist: Ref<THREE.Group>;
}) {
  const x = side === "left" ? -0.22 : 0.22;
  const thumbX = side === "left" ? 0.045 : -0.045;
  return (
    <group ref={arm} position={[x, 0.08, 0.16]}>
      <mesh position={[0, -0.1, 0.03]}>
        <capsuleGeometry args={[0.058, 0.11, 6, 12]} />
        <meshStandardMaterial color={outfit} roughness={0.45} />
      </mesh>
      <group ref={elbow} position={[0, -0.18, 0.05]}>
        <mesh position={[0, -0.075, 0.03]}>
          <capsuleGeometry args={[0.052, 0.09, 6, 12]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>
        <group ref={wrist} position={[0, -0.155, 0.06]}>
          <mesh scale={[1.2, 0.82, 1.28]}>
            <sphereGeometry args={[0.07, 14, 14]} />
            <meshStandardMaterial color={skin} roughness={0.5} />
          </mesh>
          <mesh position={[thumbX, 0.015, 0.04]}>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color={skin} roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function spring(current: number, target: number, delta: number, stiffness: number) {
  return current + (target - current) * (1 - Math.exp(-delta * stiffness));
}

export function Person({
  photo,
  outfit,
  accent,
  hair,
  home,
  x,
  z,
  side,
  action,
  grabbed = false,
  scripted = false,
  facingY,
  onPointerDown,
}: PersonProps) {
  const root = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const spine = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const elbowL = useRef<THREE.Group>(null);
  const elbowR = useRef<THREE.Group>(null);
  const wristL = useRef<THREE.Group>(null);
  const wristR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const kneeL = useRef<THREE.Group>(null);
  const kneeR = useRef<THREE.Group>(null);
  const start = useRef(0);
  const prevAction = useRef(action);
  const texture = useTexture(photo);
  const skin = "#f0c7b1";

  const hugX = side === "left" ? -0.22 : 0.22;

  useFrame(({ clock }, delta) => {
    const nodes = [root, hips, spine, chest, head, armL, armR, elbowL, elbowR, wristL, wristR, legL, legR, kneeL, kneeR];
    if (nodes.some((node) => !node.current)) return;

    if (prevAction.current !== action) {
      prevAction.current = action;
      start.current = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - start.current;
    const pose = poseFor(action, elapsed, clock.elapsedTime, side, grabbed, home[0]);
    const dt = Math.min(delta, 0.033);
    const snap = grabbed ? 1.7 : scripted ? 1.45 : 1.25;

    let targetX = x;
    let targetZ = z;
    if (!scripted && !grabbed && (action === "hug" || action === "kiss")) {
      targetX = hugX;
      targetZ = 0.1;
    }

    const rootNode = root.current!;
    rootNode.position.x = spring(rootNode.position.x, targetX, dt, 18 * snap);
    rootNode.position.z = spring(rootNode.position.z, targetZ, dt, 18 * snap);
    rootNode.position.y = spring(rootNode.position.y, pose.hop, dt, 26 * snap);
    const yaw = facingY ?? pose.faceY;
    rootNode.rotation.y = spring(rootNode.rotation.y, yaw, dt, 16 * snap);

    hips.current!.position.y = spring(hips.current!.position.y, HIP_Y + pose.hipsY, dt, 20 * snap);
    hips.current!.rotation.z = spring(hips.current!.rotation.z, pose.hipsTilt, dt, 18 * snap);
    spine.current!.rotation.x = spring(spine.current!.rotation.x, pose.spineBend, dt, 18 * snap);
    chest.current!.rotation.y = spring(chest.current!.rotation.y, pose.chestTwist, dt, 18 * snap);
    head.current!.rotation.z = spring(head.current!.rotation.z, pose.headTilt, dt, 16 * snap);
    head.current!.rotation.y = spring(head.current!.rotation.y, pose.headTurn, dt, 16 * snap);

    armL.current!.rotation.z = spring(armL.current!.rotation.z, pose.armL.out, dt, 26 * snap);
    armL.current!.rotation.x = spring(armL.current!.rotation.x, pose.armL.raise, dt, 26 * snap);
    armR.current!.rotation.z = spring(armR.current!.rotation.z, pose.armR.out, dt, 26 * snap);
    armR.current!.rotation.x = spring(armR.current!.rotation.x, pose.armR.raise, dt, 26 * snap);
    elbowL.current!.rotation.x = spring(elbowL.current!.rotation.x, pose.armL.elbow, dt, 28 * snap);
    elbowR.current!.rotation.x = spring(elbowR.current!.rotation.x, pose.armR.elbow, dt, 28 * snap);
    wristL.current!.rotation.x = spring(wristL.current!.rotation.x, pose.wristL.flick, dt, 32 * snap);
    wristL.current!.rotation.z = spring(wristL.current!.rotation.z, pose.wristL.twist, dt, 30 * snap);
    wristR.current!.rotation.x = spring(wristR.current!.rotation.x, pose.wristR.flick, dt, 32 * snap);
    wristR.current!.rotation.z = spring(wristR.current!.rotation.z, pose.wristR.twist, dt, 30 * snap);

    legL.current!.rotation.x = spring(legL.current!.rotation.x, pose.legL.lift, dt, 22 * snap);
    legR.current!.rotation.x = spring(legR.current!.rotation.x, pose.legR.lift, dt, 22 * snap);
    kneeL.current!.rotation.x = spring(kneeL.current!.rotation.x, pose.legL.knee, dt, 24 * snap);
    kneeR.current!.rotation.x = spring(kneeR.current!.rotation.x, pose.legR.knee, dt, 24 * snap);
  });

  const shirtMat = useMemo(() => ({ color: outfit, roughness: 0.42, metalness: 0.02 }), [outfit]);

  return (
    <group ref={root} position={[home[0], 0, home[1]]} onPointerDown={onPointerDown}>
      {onPointerDown ? (
        <mesh visible={false} position={[0, 0.42, 0]}>
          <capsuleGeometry args={[0.26, 0.55, 4, 8]} />
        </mesh>
      ) : null}

      <group ref={hips} position={[0, HIP_Y, 0]}>
        <mesh position={[0, 0.02, 0]} scale={[1.15, 0.9, 1.05]}>
          <sphereGeometry args={[0.155, 18, 18]} />
          <meshStandardMaterial color={outfit} roughness={0.45} />
        </mesh>

        <group ref={legL} position={[-0.07, -0.02, 0]}>
          <mesh position={[0, -0.07, 0]}>
            <capsuleGeometry args={[0.062, 0.07, 5, 10]} />
            <meshStandardMaterial color="#5c5550" />
          </mesh>
          <group ref={kneeL} position={[0, -0.12, 0]}>
            <mesh position={[0, -0.05, 0]}>
              <capsuleGeometry args={[0.055, 0.05, 5, 10]} />
              <meshStandardMaterial color="#5c5550" />
            </mesh>
            <mesh position={[0, -0.09, 0.03]}>
              <sphereGeometry args={[0.058, 12, 12]} />
              <meshStandardMaterial color="#3f3a37" roughness={0.55} />
            </mesh>
          </group>
        </group>

        <group ref={legR} position={[0.07, -0.02, 0]}>
          <mesh position={[0, -0.07, 0]}>
            <capsuleGeometry args={[0.062, 0.07, 5, 10]} />
            <meshStandardMaterial color="#5c5550" />
          </mesh>
          <group ref={kneeR} position={[0, -0.12, 0]}>
            <mesh position={[0, -0.05, 0]}>
              <capsuleGeometry args={[0.055, 0.05, 5, 10]} />
              <meshStandardMaterial color="#5c5550" />
            </mesh>
            <mesh position={[0, -0.09, 0.03]}>
              <sphereGeometry args={[0.058, 12, 12]} />
              <meshStandardMaterial color="#3f3a37" roughness={0.55} />
            </mesh>
          </group>
        </group>

        <group ref={spine} position={[0, 0.05, 0]}>
          <mesh position={[0, 0.08, 0]} scale={[1.12, 0.85, 1]}>
            <sphereGeometry args={[0.15, 18, 18]} />
            <meshStandardMaterial {...shirtMat} />
          </mesh>

          <group ref={chest} position={[0, 0.12, 0]}>
            <mesh position={[0, 0.02, 0.06]} rotation={[0.25, 0, 0]}>
              <circleGeometry args={[0.07, 20]} />
              <meshStandardMaterial color={accent} roughness={0.5} />
            </mesh>

            <group ref={head} position={[0, 0.26, 0]}>
              <mesh>
                <sphereGeometry args={[0.23, 28, 28]} />
                <meshStandardMaterial color={skin} roughness={0.48} />
              </mesh>
              <mesh position={[0, 0.1, -0.02]} rotation={[0.45, 0, 0]}>
                <sphereGeometry args={[0.2, 20, 16, 0, Math.PI * 2, 0, 1.2]} />
                <meshStandardMaterial color={hair} roughness={0.72} />
              </mesh>
              <mesh position={[0.155, 0.02, 0.04]} rotation={[0, 0, -0.35]}>
                <sphereGeometry args={[0.065, 12, 12]} />
                <meshStandardMaterial color={hair} roughness={0.72} />
              </mesh>
              <mesh position={[-0.155, 0.02, 0.04]} rotation={[0, 0, 0.35]}>
                <sphereGeometry args={[0.065, 12, 12]} />
                <meshStandardMaterial color={hair} roughness={0.72} />
              </mesh>
              <mesh position={[0.11, -0.04, 0.175]}>
                <sphereGeometry args={[0.038, 10, 10]} />
                <meshStandardMaterial color="#f4c2c2" transparent opacity={0.55} />
              </mesh>
              <mesh position={[-0.11, -0.04, 0.175]}>
                <sphereGeometry args={[0.038, 10, 10]} />
                <meshStandardMaterial color="#f4c2c2" transparent opacity={0.55} />
              </mesh>
              <mesh position={[0, 0.01, 0.218]} renderOrder={2}>
                <circleGeometry args={[0.155, 32]} />
                <meshBasicMaterial color="#fff6ea" toneMapped={false} />
              </mesh>
              <mesh position={[0, 0.01, 0.222]} renderOrder={3}>
                <circleGeometry args={[0.14, 32]} />
                <meshBasicMaterial map={texture} toneMapped={false} />
              </mesh>
              <mesh position={[0, 0.01, 0.224]} renderOrder={4}>
                <ringGeometry args={[0.14, 0.162, 32]} />
                <meshBasicMaterial color={accent} toneMapped={false} />
              </mesh>
            </group>
          </group>

          <ChibiArm side="left" outfit={outfit} skin={skin} arm={armL} elbow={elbowL} wrist={wristL} />
          <ChibiArm side="right" outfit={outfit} skin={skin} arm={armR} elbow={elbowR} wrist={wristR} />
        </group>
      </group>
    </group>
  );
}
