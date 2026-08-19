"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { StageAction } from "@/data/content";

type PersonProps = {
  photo: string;
  outfit: string;
  accent: string;
  hair: string;
  home: [number, number];
  x: number;
  z: number;
  side: "left" | "right";
  action: StageAction | "idle";
  grabbed: boolean;
  onPointerDown: (event: { nativeEvent: PointerEvent }) => void;
};

type Pose = {
  hop: number;
  hipsY: number;
  hipsTilt: number;
  spineBend: number;
  chestTwist: number;
  headTilt: number;
  headTurn: number;
  faceY: number;
  armL: { out: number; raise: number; elbow: number };
  armR: { out: number; raise: number; elbow: number };
  legL: { lift: number; knee: number };
  legR: { lift: number; knee: number };
};

const REST: Pose = {
  hop: 0,
  hipsY: 0,
  hipsTilt: 0,
  spineBend: 0,
  chestTwist: 0,
  headTilt: 0,
  headTurn: 0,
  faceY: 0,
  armL: { out: 0.12, raise: 0.18, elbow: 0.25 },
  armR: { out: -0.12, raise: 0.18, elbow: 0.25 },
  legL: { lift: 0.08, knee: 0.12 },
  legR: { lift: 0.08, knee: 0.12 },
};

function poseFor(
  action: StageAction | "idle",
  elapsed: number,
  t: number,
  side: "left" | "right",
  grabbed: boolean,
  phase: number,
): Pose {
  const inward = side === "left" ? 1 : -1;
  const breathe = Math.sin(t * 2.2 + phase) * 0.012;
  const sway = Math.sin(t * 1.15 + phase) * 0.04;
  const pose: Pose = {
    ...REST,
    hop: breathe,
    hipsTilt: sway,
    spineBend: Math.sin(t * 2.2 + phase) * 0.03,
    headTilt: Math.sin(t * 1.4 + phase) * 0.05,
    armL: { ...REST.armL },
    armR: { ...REST.armR },
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
    pose.headTilt = 0.12;
    return pose;
  }

  if (action === "wave") {
    const flap = Math.sin(elapsed * 12) * 0.55;
    pose.armR = { out: -1.15, raise: -0.15 + flap, elbow: 0.9 };
    pose.armL = { out: 0.28, raise: 0.35, elbow: 0.4 };
    pose.hipsTilt = -0.12 * inward;
    pose.headTilt = 0.12;
    pose.headTurn = -0.2 * inward;
    pose.chestTwist = 0.18 * inward;
  } else if (action === "hug") {
    pose.faceY = 0.55 * inward;
    pose.spineBend = 0.18;
    pose.headTilt = 0.18;
    pose.headTurn = 0.35 * inward;
    pose.armL = { out: 0.85, raise: -0.55, elbow: 1.15 };
    pose.armR = { out: -0.85, raise: -0.55, elbow: 1.15 };
    pose.hipsY = -0.02;
    pose.legL.lift = 0.18;
    pose.legR.lift = 0.05;
  } else if (action === "dance") {
    const beat = Math.sin(elapsed * 8.2);
    const bounce = Math.abs(Math.sin(elapsed * 8.2));
    pose.hop = bounce * 0.07;
    pose.hipsTilt = beat * 0.28;
    pose.chestTwist = Math.sin(elapsed * 4.1) * 0.35;
    pose.headTurn = -beat * 0.2;
    pose.armL = { out: 0.7 + beat * 0.4, raise: -0.4 + bounce * 0.5, elbow: 0.7 };
    pose.armR = { out: -0.7 - beat * 0.4, raise: -0.4 + bounce * 0.5, elbow: 0.7 };
    pose.legL = { lift: 0.12 + Math.max(0, beat) * 0.45, knee: 0.35 + bounce * 0.4 };
    pose.legR = { lift: 0.12 + Math.max(0, -beat) * 0.45, knee: 0.35 + bounce * 0.4 };
  } else if (action === "kiss") {
    pose.faceY = 0.72 * inward;
    pose.spineBend = 0.32;
    pose.headTilt = -0.22 * inward;
    pose.headTurn = 0.28 * inward;
    pose.hop = Math.sin(elapsed * 5) * 0.012;
    pose.armL = { out: 0.55, raise: -0.25, elbow: 0.8 };
    pose.armR = { out: -0.55, raise: -0.25, elbow: 0.8 };
    pose.legL.lift = side === "left" ? 0.22 : 0.08;
    pose.legR.lift = side === "right" ? 0.22 : 0.08;
  } else if (action === "jump") {
    const crouch = Math.min(1, elapsed / 0.12);
    if (elapsed < 0.12) {
      pose.hipsY = -0.1 * crouch;
      pose.legL.knee = 0.9 * crouch;
      pose.legR.knee = 0.9 * crouch;
      pose.armL = { out: 0.45, raise: 0.5, elbow: 0.7 };
      pose.armR = { out: -0.45, raise: 0.5, elbow: 0.7 };
      pose.spineBend = 0.2;
    } else {
      const air = Math.sin(Math.min(1, (elapsed - 0.12) / 0.42) * Math.PI);
      if (elapsed > 0.54) {
        const land = Math.min(1, (elapsed - 0.54) / 0.22);
        pose.hop = 0;
        pose.hipsY = -0.06 * (1 - land);
        pose.legL.knee = 0.55 * (1 - land) + 0.12 * land;
        pose.legR.knee = 0.55 * (1 - land) + 0.12 * land;
        pose.armL = { out: 0.2, raise: 0.25, elbow: 0.3 };
        pose.armR = { out: -0.2, raise: 0.25, elbow: 0.3 };
      } else {
        pose.hop = air * 0.46;
        pose.legL = { lift: -0.15, knee: 0.55 };
        pose.legR = { lift: -0.15, knee: 0.55 };
        pose.armL = { out: 0.55, raise: -1.1, elbow: 0.2 };
        pose.armR = { out: -0.55, raise: -1.1, elbow: 0.2 };
        pose.headTilt = -0.08;
      }
    }
  }

  return pose;
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
  grabbed,
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
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const kneeL = useRef<THREE.Group>(null);
  const kneeR = useRef<THREE.Group>(null);
  const start = useRef(0);
  const prevAction = useRef(action);
  const texture = useTexture(photo);
  const skin = "#f0c7b1";

  const hugX = side === "left" ? -0.32 : 0.32;

  useFrame(({ clock }, delta) => {
    const nodes = [root, hips, spine, chest, head, armL, armR, elbowL, elbowR, legL, legR, kneeL, kneeR];
    if (nodes.some((node) => !node.current)) return;

    if (prevAction.current !== action) {
      prevAction.current = action;
      start.current = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - start.current;
    const pose = poseFor(action, elapsed, clock.elapsedTime, side, grabbed, home[0]);
    const dt = Math.min(delta, 0.04);

    let targetX = x;
    let targetZ = z;
    if (!grabbed && (action === "hug" || action === "kiss")) {
      targetX = hugX;
      targetZ = 0.1;
    }

    const rootNode = root.current!;
    rootNode.position.x = spring(rootNode.position.x, targetX, dt, grabbed ? 22 : 9);
    rootNode.position.z = spring(rootNode.position.z, targetZ, dt, grabbed ? 22 : 9);
    rootNode.position.y = spring(rootNode.position.y, pose.hop, dt, 14);
    rootNode.rotation.y = spring(rootNode.rotation.y, pose.faceY, dt, 8);

    hips.current!.position.y = spring(hips.current!.position.y, pose.hipsY, dt, 12);
    hips.current!.rotation.z = spring(hips.current!.rotation.z, pose.hipsTilt, dt, 10);
    spine.current!.rotation.x = spring(spine.current!.rotation.x, pose.spineBend, dt, 10);
    chest.current!.rotation.y = spring(chest.current!.rotation.y, pose.chestTwist, dt, 9);
    head.current!.rotation.z = spring(head.current!.rotation.z, pose.headTilt, dt, 8);
    head.current!.rotation.y = spring(head.current!.rotation.y, pose.headTurn, dt, 8);

    armL.current!.rotation.z = spring(armL.current!.rotation.z, pose.armL.out, dt, 12);
    armL.current!.rotation.x = spring(armL.current!.rotation.x, pose.armL.raise, dt, 12);
    armR.current!.rotation.z = spring(armR.current!.rotation.z, pose.armR.out, dt, 12);
    armR.current!.rotation.x = spring(armR.current!.rotation.x, pose.armR.raise, dt, 12);
    elbowL.current!.rotation.x = spring(elbowL.current!.rotation.x, pose.armL.elbow, dt, 14);
    elbowR.current!.rotation.x = spring(elbowR.current!.rotation.x, pose.armR.elbow, dt, 14);

    legL.current!.rotation.x = spring(legL.current!.rotation.x, pose.legL.lift, dt, 12);
    legR.current!.rotation.x = spring(legR.current!.rotation.x, pose.legR.lift, dt, 12);
    kneeL.current!.rotation.x = spring(kneeL.current!.rotation.x, pose.legL.knee, dt, 14);
    kneeR.current!.rotation.x = spring(kneeR.current!.rotation.x, pose.legR.knee, dt, 14);
  });

  const shirtMat = useMemo(() => ({ color: outfit, roughness: 0.42, metalness: 0.02 }), [outfit]);

  return (
    <group ref={root} position={[home[0], 0, home[1]]} onPointerDown={onPointerDown}>
      <mesh visible={false} position={[0, 0.72, 0]}>
        <capsuleGeometry args={[0.28, 0.95, 4, 8]} />
      </mesh>

      <group ref={hips} position={[0, 0.52, 0]}>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={outfit} roughness={0.45} />
        </mesh>

        <group ref={legL} position={[-0.075, -0.04, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 5, 10]} />
            <meshStandardMaterial color="#5c5550" />
          </mesh>
          <group ref={kneeL} position={[0, -0.28, 0]}>
            <mesh position={[0, -0.13, 0]}>
              <capsuleGeometry args={[0.048, 0.16, 5, 10]} />
              <meshStandardMaterial color="#5c5550" />
            </mesh>
            <mesh position={[0, -0.23, 0.03]} rotation={[0.15, 0, 0]}>
              <boxGeometry args={[0.09, 0.045, 0.14]} />
              <meshStandardMaterial color="#3f3a37" roughness={0.6} />
            </mesh>
          </group>
        </group>

        <group ref={legR} position={[0.075, -0.04, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 5, 10]} />
            <meshStandardMaterial color="#5c5550" />
          </mesh>
          <group ref={kneeR} position={[0, -0.28, 0]}>
            <mesh position={[0, -0.13, 0]}>
              <capsuleGeometry args={[0.048, 0.16, 5, 10]} />
              <meshStandardMaterial color="#5c5550" />
            </mesh>
            <mesh position={[0, -0.23, 0.03]} rotation={[0.15, 0, 0]}>
              <boxGeometry args={[0.09, 0.045, 0.14]} />
              <meshStandardMaterial color="#3f3a37" roughness={0.6} />
            </mesh>
          </group>
        </group>

        <group ref={spine} position={[0, 0.06, 0]}>
          <mesh position={[0, 0.16, 0]}>
            <capsuleGeometry args={[0.145, 0.22, 6, 14]} />
            <meshStandardMaterial {...shirtMat} />
          </mesh>

          <group ref={chest} position={[0, 0.28, 0]}>
            <mesh position={[0, 0.04, 0.02]} rotation={[0.2, 0, 0]}>
              <circleGeometry args={[0.09, 20]} />
              <meshStandardMaterial color={accent} roughness={0.5} />
            </mesh>

            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.045, 0.055, 0.08, 12]} />
              <meshStandardMaterial color={skin} roughness={0.55} />
            </mesh>

            <group ref={head} position={[0, 0.32, 0]}>
              <mesh>
                <sphereGeometry args={[0.155, 28, 28]} />
                <meshStandardMaterial color={skin} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.08, -0.02]} rotation={[0.55, 0, 0]}>
                <sphereGeometry args={[0.125, 20, 16, 0, Math.PI * 2, 0, 1.15]} />
                <meshStandardMaterial color={hair} roughness={0.72} />
              </mesh>
              <mesh position={[0.11, 0.02, 0.04]} rotation={[0, 0, -0.4]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial color={hair} roughness={0.72} />
              </mesh>
              <mesh position={[-0.11, 0.02, 0.04]} rotation={[0, 0, 0.4]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial color={hair} roughness={0.72} />
              </mesh>
              <mesh position={[0, 0.01, 0.148]} renderOrder={2}>
                <circleGeometry args={[0.112, 32]} />
                <meshBasicMaterial color="#fff6ea" toneMapped={false} />
              </mesh>
              <mesh position={[0, 0.01, 0.152]} renderOrder={3}>
                <circleGeometry args={[0.1, 32]} />
                <meshBasicMaterial map={texture} toneMapped={false} />
              </mesh>
              <mesh position={[0, 0.01, 0.154]} renderOrder={4}>
                <ringGeometry args={[0.1, 0.118, 32]} />
                <meshBasicMaterial color={accent} toneMapped={false} />
              </mesh>
            </group>

            <group ref={armL} position={[-0.175, 0.08, 0]}>
              <mesh position={[0, -0.12, 0]}>
                <capsuleGeometry args={[0.042, 0.14, 5, 10]} />
                <meshStandardMaterial color={outfit} />
              </mesh>
              <group ref={elbowL} position={[0, -0.2, 0]}>
                <mesh position={[0, -0.1, 0]}>
                  <capsuleGeometry args={[0.036, 0.12, 5, 10]} />
                  <meshStandardMaterial color={skin} roughness={0.55} />
                </mesh>
                <mesh position={[0, -0.18, 0]}>
                  <sphereGeometry args={[0.038, 12, 12]} />
                  <meshStandardMaterial color={skin} roughness={0.55} />
                </mesh>
              </group>
            </group>

            <group ref={armR} position={[0.175, 0.08, 0]}>
              <mesh position={[0, -0.12, 0]}>
                <capsuleGeometry args={[0.042, 0.14, 5, 10]} />
                <meshStandardMaterial color={outfit} />
              </mesh>
              <group ref={elbowR} position={[0, -0.2, 0]}>
                <mesh position={[0, -0.1, 0]}>
                  <capsuleGeometry args={[0.036, 0.12, 5, 10]} />
                  <meshStandardMaterial color={skin} roughness={0.55} />
                </mesh>
                <mesh position={[0, -0.18, 0]}>
                  <sphereGeometry args={[0.038, 12, 12]} />
                  <meshStandardMaterial color={skin} roughness={0.55} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
