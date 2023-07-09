import * as THREE from "three";
import { Particles, ParticleRef } from "ptcl";
import Player from "./Player";
import Collider from "./Collider";

function argmin(vec: Array<number>) {
  return vec
    .map((a, i) => [a, i])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1])[0];
}

export function collisionDetection(player: Player, collider: Collider) {
  let relCenter = player.position.addScaledVector(collider.position, -1);
  const quaternion = new THREE.Quaternion(
    -collider.quaternion.x,
    -collider.quaternion.y,
    -collider.quaternion.z,
    collider.quaternion.w
  );
  relCenter.applyQuaternion(quaternion);

  let collided = false;
  let penetration = 0;
  let normal = new THREE.Vector3();

  if (
    Math.abs(relCenter.x) <= player.radius + collider.width / 2 &&
    Math.abs(relCenter.y) <= player.radius + collider.height / 2 &&
    Math.abs(relCenter.z) <= player.radius + collider.depth / 2
  ) {
    const vec = [
      Math.abs(collider.width / 2 - relCenter.x),
      Math.abs(-collider.width / 2 - relCenter.x),
      Math.abs(collider.height / 2 - relCenter.y),
      Math.abs(-collider.height / 2 - relCenter.y),
      Math.abs(collider.depth / 2 - relCenter.z),
      Math.abs(-collider.depth / 2 - relCenter.z),
    ];
    const idx = argmin(vec);
    if (idx == 2) {
      collided = true;
      normal.x = idx < 2 ? 1 : 0;
      normal.y = idx >= 2 && idx < 4 ? 1 : 0;
      normal.z = idx >= 4 && idx < 6 ? 1 : 0;
      const sign = idx % 2 == 0 ? 1 : -1;
      normal.multiplyScalar(sign);
      normal.applyQuaternion(collider.quaternion);

      if (
        Math.abs(relCenter.x) <= collider.width / 2 &&
        Math.abs(relCenter.y) <= collider.height / 2 &&
        Math.abs(relCenter.z) <= collider.depth / 2
      ) {
        penetration = player.radius + vec[idx];
      } else {
        penetration = player.radius - vec[idx];
      }
    }
  }
  return {
    penetration,
    collided,
    normal,
  };
}

export function collisionDetectionGeneral(player: Player, collider: Collider) {
  let relCenter = player.position.addScaledVector(collider.position, -1);
  const quaternion = new THREE.Quaternion(
    -collider.quaternion.x,
    -collider.quaternion.y,
    -collider.quaternion.z,
    collider.quaternion.w
  );
  relCenter.applyQuaternion(quaternion);

  let collided = false;
  let penetration = 0;
  let normal = new THREE.Vector3();

  if (
    Math.abs(relCenter.x) <= player.radius + collider.width / 2 &&
    Math.abs(relCenter.y) <= player.radius + collider.height / 2 &&
    Math.abs(relCenter.z) <= player.radius + collider.depth / 2
  ) {
    const vec = [
      Math.abs(collider.width / 2 - relCenter.x),
      Math.abs(-collider.width / 2 - relCenter.x),
      Math.abs(collider.height / 2 - relCenter.y),
      Math.abs(-collider.height / 2 - relCenter.y),
      Math.abs(collider.depth / 2 - relCenter.z),
      Math.abs(-collider.depth / 2 - relCenter.z),
    ];
    const idx = argmin(vec);

    collided = true;
    normal.x = idx < 2 ? 1 : 0;
    normal.y = idx >= 2 && idx < 4 ? 1 : 0;
    normal.z = idx >= 4 && idx < 6 ? 1 : 0;
    const sign = idx % 2 == 0 ? 1 : -1;
    normal.multiplyScalar(sign);
    normal.applyQuaternion(collider.quaternion);

    if (
      Math.abs(relCenter.x) <= collider.width / 2 &&
      Math.abs(relCenter.y) <= collider.height / 2 &&
      Math.abs(relCenter.z) <= collider.depth / 2
    ) {
      penetration = player.radius + vec[idx];
    } else {
      penetration = player.radius - vec[idx];
    }
  }
  return {
    penetration,
    collided,
    normal,
  };
}
let norm: number;
export function collisionResponse(
  particles: Particles,
  pIndex: number,
  normal: THREE.Vector3,
  penetration: number,
  Cr = 0.5,
  // isBouncePad: boolean
) {
  particles._addPosition(
    pIndex,
    penetration * normal.x,
    penetration * normal.y,
    penetration * normal.z
  );
  norm = Math.abs((1 + Cr) * particles._getVelocity(pIndex).dot(normal));
  particles._addVelocity(
    pIndex,
    norm * normal.x,
    norm * normal.y,
    norm * normal.z
  );
}

export function closestPointOnBox(
  player: Player,
  collider: Collider
): THREE.Vector3 {
  const sphereCenter = player.position.clone();

  const clampedX = THREE.MathUtils.clamp(
    sphereCenter.x,
    collider.position.x - collider.width / 2,
    collider.position.x + collider.width / 2
  );
  const clampedY = THREE.MathUtils.clamp(
    sphereCenter.y,
    collider.position.y - collider.height / 2,
    collider.position.y + collider.height / 2
  );
  const clampedZ = THREE.MathUtils.clamp(
    sphereCenter.z,
    collider.position.z - collider.depth / 2,
    collider.position.z + collider.depth / 2
  );

  return new THREE.Vector3(clampedX, clampedY, clampedZ);
}
