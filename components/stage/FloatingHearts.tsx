"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seed(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function FloatingHearts({ active }: { active: boolean }) {
  const count = 28;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        x: (seed(index, 1) - 0.5) * 0.85,
        z: (seed(index, 2) - 0.5) * 0.45,
        delay: seed(index, 3) * 1.4,
        speed: 0.4 + seed(index, 4) * 0.4,
        scale: 0.055 + seed(index, 5) * 0.04,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((item, index) => {
      const local = (t * item.speed + item.delay) % 1.8;
      const visible = active ? 1 : 0;
      dummy.position.set(item.x, 0.55 + local * 1.15, item.z);
      dummy.scale.setScalar(item.scale * visible * (1 - local / 1.8));
      dummy.rotation.z = Math.sin(t + index) * 0.4;
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#e39a9a" emissive="#f4c2c2" emissiveIntensity={0.55} />
    </instancedMesh>
  );
}
