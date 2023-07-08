import * as THREE from "three";
import { Particles, pSize } from "ptcl";

class Player {
  particles: Particles;
  mesh: THREE.Mesh<THREE.SphereGeometry>;
  isFlying: boolean;
  popSpeed: number = 1.9;

  framesSinceLastCollision: number = 0;
  timeSinceLastPop: number = 1000;

  startingPosition: THREE.Vector3;

  constructor(particles: Particles, mesh: THREE.Mesh<THREE.SphereGeometry>) {
    this.particles = particles;
    this.mesh = mesh;
    this.startingPosition = mesh.position.clone();
    this.isFlying = true;
  }

  get radius() {
    return this.mesh.geometry.parameters.radius;
  }

  get position() {
    return this.particles._getPosition(0);
  }

  reset() {
    this.particles._setVelocity(0, 0, 0, 0);
    this.particles._setPosition(
      0,
      this.startingPosition.x,
      this.startingPosition.y,
      this.startingPosition.z
    );
  }

  update(dt: number) {
    this.timeSinceLastPop += dt;
    // update position
    this.mesh.position.set(
      this.particles.data[0 * pSize],
      this.particles.data[0 * pSize + 1],
      this.particles.data[0 * pSize + 2]
    );
  }

  pop() {
    // @ts-ignore
    //this.mesh.material.color = new THREE.Color(0xff0000)
    this.isFlying = true;
    //this.particles._addVelocity(0, 0, this.popSpeed, 0);
    this.particles._setVelocity(
      0,
      0,
      2*this.popSpeed,
      -this.popSpeed 
    );
    this.timeSinceLastPop = 0;
  }
}

export default Player;
