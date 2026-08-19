"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { StageAction } from "@/data/content";

type PersonProps = {
  photo: string;
  outfit: string;
  accent: string;
  home: [number, number];
  x: number;
  z: number;
  facing: 1 | -1;
  action: StageAction | "idle";
  grabbed: boolean;
  onGrab: () => void;
  onMove: (x: number, z: number) => void;
  onRelease: () => void;
};

const GROUND = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const HIT = new THREE.Vector3();

export function Person({
  photo,
  outfit,
  accent,
  home,
  x,
  z,
  facing,
  action,
  grabbed,
  onGrab,
  onMove,
  onRelease,
}: PersonProps) {
  const { gl } = useThree();
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const start = useRef(0);
  const prevAction = useRef(action);
  const texture = useTexture(photo);

  useFrame(({ clock }, delta) => {
    if (!root.current || !body.current || !armL.current || !armR.current) return;

    if (prevAction.current !== action) {
      prevAction.current = action;
      start.current = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - start.current;
    const t = clock.elapsedTime;
    const idleBob = Math.sin(t * 2.1 + home[0]) * 0.016;

    let hop = 0;
    let leanZ = 0;
    let spinY = 0;
    let leftArm = 0.18;
    let rightArm = 0.18;
    let targetX = x;
    let targetZ = z;
    let faceY = facing === 1 ? 0.15 : Math.PI - 0.15;

    if (action === "wave") {
      rightArm = -1.85 + Math.sin(elapsed * 11) * 0.55;
      leftArm = 0.25;
    } else if (action === "hug") {
      targetX = facing === 1 ? -0.34 : 0.34;
      targetZ = 0.08;
      faceY = facing === 1 ? 0.45 : Math.PI - 0.45;
      leanZ = facing * -0.18;
      leftArm = -1.1;
      rightArm = -1.1;
    } else if (action === "dance") {
      hop = Math.abs(Math.sin(elapsed * 7.2)) * 0.11;
      spinY = Math.sin(elapsed * 3.4) * 0.65;
      leftArm = -0.9 + Math.cos(elapsed * 8) * 0.7;
      rightArm = -0.9 + Math.sin(elapsed * 8) * 0.7;
    } else if (action === "kiss") {
      targetX = facing === 1 ? -0.28 : 0.28;
      targetZ = 0.12;
      faceY = facing === 1 ? 0.55 : Math.PI - 0.55;
      leanZ = facing * -0.28;
      hop = Math.sin(elapsed * 4) * 0.02;
    } else if (action === "jump") {
      const cycle = elapsed % 0.72;
      hop = Math.sin((cycle / 0.72) * Math.PI) * 0.42;
      leftArm = -0.7;
      rightArm = -0.7;
    }

    const lerp = 1 - Math.exp(-delta * (grabbed ? 18 : 7));
    root.current.position.x += (targetX - root.current.position.x) * lerp;
    root.current.position.z += (targetZ - root.current.position.z) * lerp;
    root.current.position.y = hop;
    root.current.rotation.y += (faceY - root.current.rotation.y) * lerp;

    body.current.position.y = idleBob;
    body.current.rotation.z += (leanZ - body.current.rotation.z) * lerp;
    body.current.rotation.y += (spinY - body.current.rotation.y) * lerp;

    armL.current.rotation.x += (leftArm - armL.current.rotation.x) * lerp;
    armR.current.rotation.x += (rightArm - armR.current.rotation.x) * lerp;
  });

  function project(ray: THREE.Ray) {
    if (!ray.intersectPlane(GROUND, HIT)) return;
    onMove(
      THREE.MathUtils.clamp(HIT.x, -1.55, 1.55),
      THREE.MathUtils.clamp(HIT.z, -0.85, 0.85),
    );
  }

  return (
    <group
      ref={root}
      position={[home[0], 0, home[1]]}
      onPointerDown={(event) => {
        event.stopPropagation();
        gl.domElement.setPointerCapture(event.nativeEvent.pointerId);
        onGrab();
      }}
      onPointerMove={(event) => {
        if (!grabbed) return;
        event.stopPropagation();
        project(event.ray);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        if (gl.domElement.hasPointerCapture(event.nativeEvent.pointerId)) {
          gl.domElement.releasePointerCapture(event.nativeEvent.pointerId);
        }
        onRelease();
      }}
      onPointerCancel={onRelease}
    >
      <group ref={body}>
        <mesh position={[0, 0.22, 0]}>
          <capsuleGeometry args={[0.09, 0.28, 4, 10]} />
          <meshStandardMaterial color={outfit} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <capsuleGeometry args={[0.16, 0.34, 6, 14]} />
          <meshStandardMaterial color={outfit} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.78, 0.02]} rotation={[0.15, 0, 0]}>
          <circleGeometry args={[0.12, 20]} />
          <meshStandardMaterial color={accent} roughness={0.5} />
        </mesh>

        <group ref={armL} position={[-0.22, 0.78, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.055, 0.28, 4, 10]} />
            <meshStandardMaterial color={outfit} />
          </mesh>
        </group>
        <group ref={armR} position={[0.22, 0.78, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.055, 0.28, 4, 10]} />
            <meshStandardMaterial color={outfit} />
          </mesh>
        </group>

        <mesh position={[-0.09, 0.08, 0]}>
          <capsuleGeometry args={[0.07, 0.28, 4, 10]} />
          <meshStandardMaterial color="#6b625c" />
        </mesh>
        <mesh position={[0.09, 0.08, 0]}>
          <capsuleGeometry args={[0.07, 0.28, 4, 10]} />
          <meshStandardMaterial color="#6b625c" />
        </mesh>

        <mesh position={[0, 1.08, 0]}>
          <sphereGeometry args={[0.27, 28, 28]} />
          <meshStandardMaterial color="#f1d2be" roughness={0.55} />
        </mesh>
        <mesh position={[0, 1.22, -0.02]} rotation={[0.35, 0, 0]}>
          <sphereGeometry args={[0.2, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshStandardMaterial color="#4a3b34" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.07, 0.21]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial map={texture} roughness={0.7} metalness={0} />
        </mesh>
        <mesh position={[0, 1.07, 0.215]}>
          <ringGeometry args={[0.195, 0.225, 32]} />
          <meshStandardMaterial color={accent} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}
