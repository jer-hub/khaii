"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seed(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createHeartGeometry() {
  const shape = new THREE.Shape();
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    points.push(new THREE.Vector2(x * 0.028, y * 0.028));
  }
  shape.setFromPoints(points);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 8,
  });
  geometry.center();
  return geometry;
}

type HeartKind = "orb" | "heart";

export function FloatingHearts({
  active,
  kind = "orb",
}: {
  active: boolean;
  kind?: HeartKind;
}) {
  const count = kind === "heart" ? 22 : 28;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const heartGeometry = useMemo(() => (kind === "heart" ? createHeartGeometry() : null), [kind]);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        x: (seed(index, 1) - 0.5) * (kind === "heart" ? 0.48 : 0.85),
        z: (seed(index, 2) - 0.5) * (kind === "heart" ? 0.28 : 0.45),
        delay: seed(index, 3) * (kind === "heart" ? 1.1 : 1.4),
        speed: (kind === "heart" ? 0.48 : 0.4) + seed(index, 4) * 0.4,
        scale: kind === "heart" ? 0.085 + seed(index, 5) * 0.055 : 0.055 + seed(index, 5) * 0.04,
        spin: 0.6 + seed(index, 6) * 1.4,
      })),
    [count, kind],
  );

  useEffect(() => {
    return () => {
      heartGeometry?.dispose();
    };
  }, [heartGeometry]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    const life = kind === "heart" ? 1.55 : 1.8;
    seeds.forEach((item, index) => {
      const local = (t * item.speed + item.delay) % life;
      const visible = active ? 1 : 0;
      const fade = 1 - local / life;
      dummy.position.set(
        item.x + Math.sin(t * 1.4 + index) * (kind === "heart" ? 0.04 : 0.02),
        (kind === "heart" ? 0.48 : 0.55) + local * (kind === "heart" ? 0.95 : 1.15),
        item.z,
      );
      dummy.scale.setScalar(item.scale * visible * fade);
      dummy.rotation.set(
        kind === "heart" ? Math.sin(t * 0.8 + index) * 0.18 : 0,
        kind === "heart" ? Math.sin(t * item.spin + index) * 0.35 : 0,
        Math.sin(t + index) * (kind === "heart" ? 0.55 : 0.4),
      );
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      {kind === "heart" && heartGeometry ? (
        <primitive object={heartGeometry} attach="geometry" />
      ) : (
        <sphereGeometry args={[1, 8, 8]} />
      )}
      <meshStandardMaterial
        color={kind === "heart" ? "#e56b7a" : "#e39a9a"}
        emissive={kind === "heart" ? "#f4a0ab" : "#f4c2c2"}
        emissiveIntensity={kind === "heart" ? 0.7 : 0.55}
        roughness={0.42}
        metalness={0.04}
      />
    </instancedMesh>
  );
}
