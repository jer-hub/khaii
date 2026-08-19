"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seed(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function FloatingHearts({ active }: { active: boolean }) {
  const count = 18;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        x: (seed(index, 1) - 0.5) * 0.7,
        z: (seed(index, 2) - 0.5) * 0.4,
        delay: seed(index, 3) * 1.4,
        speed: 0.35 + seed(index, 4) * 0.35,
        scale: 0.04 + seed(index, 5) * 0.03,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((item, index) => {
      const local = (t * item.speed + item.delay) % 1.8;
      const visible = active ? 1 : 0;
      dummy.position.set(item.x, 0.9 + local * 1.1, item.z);
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
      <meshStandardMaterial color="#e39a9a" emissive="#f4c2c2" emissiveIntensity={0.35} />
    </instancedMesh>
  );
}
