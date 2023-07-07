import * as THREE from "three";
import { Particles, ParticleRef } from "ptcl";
import Ball from "./Ball";
import Collider from "./Collider";

function argmin(vec: Array<number>) {
  return vec
    .map((a, i) => [a, i])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1])[0];
}

export function collisionDetection(ball: Ball, collider: Collider) {
  let relCenter = ball.position.addScaledVector(collider.position, -1);
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
    Math.abs(relCenter.x) <= ball.radius + collider.width / 2 &&
    Math.abs(relCenter.y) <= ball.radius + collider.height / 2 &&
    Math.abs(relCenter.z) <= ball.radius + collider.depth / 2
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
        penetration = ball.radius + vec[idx];
      } else {
        penetration = ball.radius - vec[idx];
      }
    }
  }
  return {
    penetration,
    collided,
    normal,
  };
}

export function collisionResponse(
  particles: Particles,
  pIndex: number,
  normal: THREE.Vector3,
  penetration: number,
  Cr = 0.5
) {
  particles._addPosition(
    pIndex,
    penetration * normal.x,
    penetration * normal.y,
    penetration * normal.z
  );
  let norm = Math.abs((1 + Cr) * particles._getVelocity(pIndex).dot(normal));
  particles._addVelocity(
    pIndex,
    norm * normal.x,
    norm * normal.y,
    norm * normal.z
  );
}

export function particleBoxCollisionDetectionOLD(
  particle: ParticleRef,
  particleGeometry: THREE.SphereGeometry,
  box: THREE.Mesh,
  boxGeometry: THREE.BoxGeometry
) {
  let relCenter = particle.getPosition().addScaledVector(box.position, -1);
  const quaternion = new THREE.Quaternion(
    -box.quaternion.x,
    -box.quaternion.y,
    -box.quaternion.z,
    box.quaternion.w
  );
  relCenter.applyQuaternion(quaternion);
  let collided = false;
  let normal = new THREE.Vector3();
  let penetration = 0;
  const radius = particleGeometry.parameters.radius;
  const [width, height, depth] = [
    boxGeometry.parameters.width,
    boxGeometry.parameters.height,
    boxGeometry.parameters.depth,
  ];
  if (
    Math.abs(relCenter.x) <= radius + width / 2 &&
    Math.abs(relCenter.y) <= radius + height / 2 &&
    Math.abs(relCenter.z) <= radius + depth / 2
  ) {
    const vec = [
      Math.abs(width / 2 - relCenter.x),
      Math.abs(-width / 2 - relCenter.x),
      Math.abs(height / 2 - relCenter.y),
      Math.abs(-height / 2 - relCenter.y),
      Math.abs(depth / 2 - relCenter.z),
      Math.abs(-depth / 2 - relCenter.z),
    ];
    const idx = argmin(vec);
    if (idx == 2) {
      collided = true;
      normal.x = idx < 2 ? 1 : 0;
      normal.y = idx >= 2 && idx < 4 ? 1 : 0;
      normal.z = idx >= 4 && idx < 6 ? 1 : 0;
      const sign = idx % 2 == 0 ? 1 : -1;
      normal.multiplyScalar(sign);
      normal.applyQuaternion(box.quaternion);

      if (
        Math.abs(relCenter.x) <= width / 2 &&
        Math.abs(relCenter.y) <= height / 2 &&
        Math.abs(relCenter.z) <= depth / 2
      ) {
        penetration = radius + vec[idx];
      } else {
        penetration = radius - vec[idx];
      }
    }
  }
  let values: [boolean, THREE.Vector3, number] = [
    collided,
    normal,
    penetration,
  ];
  return values;
}

export function collisionResponseOLD(
  particles: Particles,
  pIndex: number,
  normal: THREE.Vector3,
  penetration: number,
  dt: number,
  Cr = 0.5
) {
  particles._addPosition(
    pIndex,
    penetration * normal.x,
    penetration * normal.y,
    penetration * normal.z
  );
  let norm = Math.abs((1 + Cr) * particles._getVelocity(pIndex).dot(normal));
  particles._addVelocity(
    pIndex,
    norm * normal.x,
    norm * normal.y,
    norm * normal.z
  );
}
