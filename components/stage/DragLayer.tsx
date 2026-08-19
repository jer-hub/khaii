"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { CharacterId } from "@/data/content";

export type DragOrigin = {
  x: number;
  y: number;
  dragged: boolean;
};

type DragLayerProps = {
  grab: CharacterId | null;
  originRef: MutableRefObject<DragOrigin>;
  onMove: (id: CharacterId, x: number, z: number) => void;
  onRelease: () => void;
  onTap: (id: CharacterId) => void;
};

const PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

export function DragLayer({ grab, originRef, onMove, onRelease, onTap }: DragLayerProps) {
  const { camera, gl } = useThree();
  const grabRef = useRef(grab);

  useEffect(() => {
    grabRef.current = grab;
  }, [grab]);

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();

    function project(event: PointerEvent) {
      const id = grabRef.current;
      if (!id) return;
      const rect = gl.domElement.getBoundingClientRect();
      ndc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      if (!raycaster.ray.intersectPlane(PLANE, hit)) return;
      onMove(
        id,
        THREE.MathUtils.clamp(hit.x, -1.55, 1.55),
        THREE.MathUtils.clamp(hit.z, -0.9, 0.9),
      );
    }

    function onMoveEvent(event: PointerEvent) {
      if (!grabRef.current) return;
      const dx = event.clientX - originRef.current.x;
      const dy = event.clientY - originRef.current.y;
      if (dx * dx + dy * dy > 36) originRef.current.dragged = true;
      if (originRef.current.dragged) project(event);
    }

    function onUp() {
      const id = grabRef.current;
      if (!id) return;
      if (!originRef.current.dragged) onTap(id);
      onRelease();
    }

    window.addEventListener("pointermove", onMoveEvent);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMoveEvent);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [camera, gl, onMove, onRelease, onTap, originRef]);

  return null;
}
