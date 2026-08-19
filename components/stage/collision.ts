export const PERSON_RADIUS = 0.27;
export const PERSON_MIN_DISTANCE = PERSON_RADIUS * 2;
export const PERSON_CONTACT_X = PERSON_RADIUS;

const STAGE_BOUNDS = {
  x: 1.55,
  z: 0.9,
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function separateFromOther(
  x: number,
  z: number,
  otherX: number,
  otherZ: number,
  previous: { x: number; z: number },
): { x: number; z: number } {
  let nx = clamp(x, -STAGE_BOUNDS.x, STAGE_BOUNDS.x);
  let nz = clamp(z, -STAGE_BOUNDS.z, STAGE_BOUNDS.z);
  const dx = nx - otherX;
  const dz = nz - otherZ;
  const dist = Math.hypot(dx, dz);

  if (dist < 1e-6) {
    const side = previous.x >= otherX ? 1 : -1;
    nx = otherX + PERSON_MIN_DISTANCE * side;
    nz = otherZ;
  } else if (dist < PERSON_MIN_DISTANCE) {
    const scale = PERSON_MIN_DISTANCE / dist;
    nx = otherX + dx * scale;
    nz = otherZ + dz * scale;
  }

  nx = clamp(nx, -STAGE_BOUNDS.x, STAGE_BOUNDS.x);
  nz = clamp(nz, -STAGE_BOUNDS.z, STAGE_BOUNDS.z);

  if (Math.hypot(nx - otherX, nz - otherZ) < PERSON_MIN_DISTANCE - 0.001) {
    return previous;
  }

  return { x: nx, z: nz };
}

export function keepPairApart(
  leftX: number,
  rightX: number,
  minDistance = PERSON_MIN_DISTANCE,
): [number, number] {
  const gap = rightX - leftX;
  if (gap >= minDistance) return [leftX, rightX];
  const mid = (leftX + rightX) / 2;
  return [mid - minDistance / 2, mid + minDistance / 2];
}
