import * as THREE from "three";
import { Particles, pSize } from "ptcl";

class Ball {
  particles: Particles;
  mesh: THREE.Mesh<THREE.SphereGeometry>;

  constructor(particles: Particles, mesh: THREE.Mesh<THREE.SphereGeometry>) {
    this.particles = particles;
    this.mesh = mesh;
  }

  get radius() {
    return this.mesh.geometry.parameters.radius;
  }

  get position() {
    return this.particles._getPosition(0);
  }

  updatePos() {
    this.mesh.position.set(
      this.particles.data[0 * pSize],
      this.particles.data[0 * pSize + 1],
      this.particles.data[0 * pSize + 2]
    );
  }
}

export default Ball;
