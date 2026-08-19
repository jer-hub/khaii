"use client";

import { useMemo, useRef } from "react";
import type { Ref } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function hash(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function SeasonParticles({
  kind,
  amount,
  materialRef,
}: {
  kind: "petals" | "leaves" | "snow" | "spark";
  amount: number;
  materialRef?: Ref<THREE.MeshBasicMaterial>;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: amount }, (_, index) => ({
        x: (hash(index, 1) - 0.5) * 8,
        z: (hash(index, 2) - 0.5) * 10,
        delay: hash(index, 3) * 4,
        speed: 0.25 + hash(index, 4) * 0.55,
        scale: kind === "snow" ? 0.025 + hash(index, 5) * 0.02 : 0.045 + hash(index, 5) * 0.04,
        spin: hash(index, 6) * 4,
      })),
    [amount, kind],
  );

  const color =
    kind === "petals" ? "#f4c2c2" : kind === "leaves" ? "#d98a4a" : kind === "snow" ? "#ffffff" : "#ffe7a8";

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((seed, index) => {
      const fall = ((t * seed.speed + seed.delay) % 5) / 5;
      dummy.position.set(
        seed.x + Math.sin(t * 0.7 + index) * 0.35,
        2.4 - fall * 2.8,
        seed.z,
      );
      dummy.rotation.set(fall * 4, t * seed.spin, fall * 2);
      dummy.scale.setScalar(seed.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, amount]}>
      {kind === "snow" ? <sphereGeometry args={[1, 6, 6]} /> : <planeGeometry args={[1, 1.4]} />}
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={kind === "spark" ? 0.7 : 0.9}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function Tree({
  position,
  foliage,
  scale = 1,
}: {
  position: [number, number, number];
  foliage: string;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.56, 8]} />
        <meshStandardMaterial color="#6b4f3a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <coneGeometry args={[0.32, 0.7, 8]} />
        <meshStandardMaterial color={foliage} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <coneGeometry args={[0.22, 0.48, 8]} />
        <meshStandardMaterial color={foliage} roughness={0.7} />
      </mesh>
    </group>
  );
}

function BlossomTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Tree position={[0, 0, 0]} foliage="#8fbe8a" />
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh
          key={index}
          position={[
            Math.sin(index * 1.7) * 0.22,
            0.7 + (index % 3) * 0.16,
            Math.cos(index * 1.3) * 0.18,
          ]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#f4c2c2" />
        </mesh>
      ))}
    </group>
  );
}

export function SpringSet({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <BlossomTree position={[-1.7, 0, -1.2]} />
      <BlossomTree position={[1.8, 0, -2.1]} />
      <BlossomTree position={[-2.1, 0, 1.4]} />
      <mesh position={[0.9, 0.02, 0.6]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <planeGeometry args={[0.9, 0.7]} />
        <meshStandardMaterial color="#f4c2c2" />
      </mesh>
      <mesh position={[0.7, 0.08, 0.55]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 10]} />
        <meshStandardMaterial color="#8c6448" />
      </mesh>
      <mesh position={[-0.6, 0.04, 0.9]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#e39a9a" />
      </mesh>
      <mesh position={[-0.48, 0.04, 1.02]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#fff6ea" />
      </mesh>
    </group>
  );
}

export function SummerSet({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <Tree position={[-2, 0, -1]} foliage="#6fa05a" scale={1.1} />
      <Tree position={[2.1, 0, -1.6]} foliage="#82b56a" />
      {[-0.85, -0.55, -0.2, 0.15, 0.5, 0.85].map((x, index) => (
        <mesh key={x} position={[x, 0.16 + (index % 3) * 0.04, 0.85 - (index % 2) * 0.18]}>
          <coneGeometry args={[0.05, 0.34 + (index % 2) * 0.08, 5]} />
          <meshStandardMaterial color={index % 2 ? "#6fa05a" : "#82b56a"} />
        </mesh>
      ))}
      <mesh position={[0, 2.3, -3]}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshBasicMaterial color="#ffd56a" />
      </mesh>
      <group position={[1.1, 0, 0.4]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.1, 8]} />
          <meshStandardMaterial color="#c4a992" />
        </mesh>
        <mesh position={[0, 1.05, 0]} rotation={[0.15, 0, 0]}>
          <coneGeometry args={[0.55, 0.18, 12, 1, true]} />
          <meshStandardMaterial color="#f4c2c2" side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[-0.9, 0.12, 0.7]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#e39a9a" />
      </mesh>
      <mesh position={[-1.15, 0.22, -0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#7e917e" />
      </mesh>
      <mesh position={[-1.15, 0.5, -0.2]}>
        <circleGeometry args={[0.16, 12]} />
        <meshStandardMaterial color="#f5d76e" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function AutumnSet({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <Tree position={[-1.8, 0, -1.3]} foliage="#d98a4a" />
      <Tree position={[1.9, 0, -0.8]} foliage="#c45c2a" scale={0.9} />
      <Tree position={[0.4, 0, -2.4]} foliage="#e0a04a" />
      <mesh position={[1.1, 0.12, 0.55]} scale={[1, 0.75, 1]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#e07a2f" />
      </mesh>
      <mesh position={[1.32, 0.1, 0.7]} scale={[1, 0.7, 1]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#c45c2a" />
      </mesh>
      {[-1.4, -0.9, -0.4].map((x) => (
        <mesh key={x} position={[x, 0.22, 1.1]}>
          <boxGeometry args={[0.06, 0.44, 0.06]} />
          <meshStandardMaterial color="#6b4f3a" />
        </mesh>
      ))}
      <mesh position={[-0.9, 0.42, 1.1]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.06, 1.1, 0.04]} />
        <meshStandardMaterial color="#6b4f3a" />
      </mesh>
      <group position={[-1.2, 0.28, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.08, 0.16, 10]} />
          <meshStandardMaterial color="#8c6448" />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffe7a8" />
        </mesh>
      </group>
    </group>
  );
}

export function WinterSet({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <Tree position={[-1.9, 0, -1]} foliage="#dfe8ef" />
      <Tree position={[1.7, 0, -1.8]} foliage="#cfdbe6" scale={1.15} />
      <group position={[1.05, 0, 0.5]}>
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.16, 14, 14]} />
          <meshStandardMaterial color="#f4f7fa" />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <sphereGeometry args={[0.12, 14, 14]} />
          <meshStandardMaterial color="#f4f7fa" />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#f4f7fa" />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.05, 10]} />
          <meshStandardMaterial color="#2c2c2c" />
        </mesh>
      </group>
      <group position={[-1.1, 0.32, 0.3]}>
        <mesh>
          <boxGeometry args={[0.12, 0.18, 0.12]} />
          <meshStandardMaterial color="#7e917e" />
        </mesh>
        <pointLight position={[0, 0.12, 0]} intensity={0.6} color="#ffd6a8" distance={3} />
      </group>
      <mesh position={[0.2, 0.08, 1.1]} rotation={[0.2, 0.4, 0]}>
        <boxGeometry args={[0.35, 0.04, 0.22]} />
        <meshStandardMaterial color="#e8a0a0" />
      </mesh>
    </group>
  );
}
