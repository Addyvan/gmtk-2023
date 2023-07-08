import * as THREE from "three";
import state from "../state";
import bufferToBoxGeo from "../utils/bufferToBoxGeo";

class Collider {
  mesh: THREE.Mesh<THREE.BoxGeometry>;
  geometry: THREE.BufferGeometry;
  boxGeometry: THREE.BoxGeometry;

  deltaBetaRad: number;

  // if true then we should be lerping back to original position
  needsUpdate: boolean = false;
  originalOrientation: THREE.Quaternion;

  constructor(mesh: THREE.Mesh<THREE.BoxGeometry>) {
    this.mesh = mesh;
    this.originalOrientation = this.mesh.quaternion.clone();
    this.boxGeometry = bufferToBoxGeo(mesh.geometry, mesh.scale);
    if (this.mesh.userData.endPlatform) {
      //@ts-ignore
      this.mesh.material.color = new THREE.Color(0x0000ff);
    }
  }

  get id() {
    return this.mesh.id;
  }

  get position() {
    return this.mesh.position;
  }

  get quaternion() {
    return this.mesh.quaternion;
  }

  get width() {
    return this.boxGeometry.parameters.width;
  }

  get height() {
    return this.boxGeometry.parameters.height;
  }

  get depth() {
    return this.boxGeometry.parameters.depth;
  }

  isActive() {
    return state.activeCollider.id === this.id;
  }

  setRotationFromDeviceOrientation(betaRad: number, gammaRad: number) {
    if (this.mesh.userData.controllable)
      this.mesh.rotation.set(betaRad, 0, -gammaRad);
  }

  setDebugColor(collided: boolean) {
    //@ts-ignore
    this.mesh.material.color = collided
      ? new THREE.Color(0xff0000)
      : new THREE.Color(0x00ff00);
  }

  update(dt: number) {
    this.mesh.quaternion.slerp(this.originalOrientation, dt);
    if (this.mesh.quaternion.dot(this.originalOrientation) < dt) {
      this.needsUpdate = false;
    }
  }
}

export default Collider;
