import * as THREE from "three";
import checkSupportFor from "../utils/checkSupport";

class Collider {
  mesh: THREE.Mesh<THREE.BoxGeometry>;
  geometry: THREE.BoxGeometry;

  constructor(mesh: THREE.Mesh<THREE.BoxGeometry>) {
    this.mesh = mesh;

    // TODO: CHANGE ASAP (ADDY)
    const handlePhoneMove = (evt: CustomEvent) => {
      const { alphaRad, betaRad, gammaRad } = evt.detail;
      this.mesh.rotation.set(betaRad, -gammaRad, alphaRad);
    };
    window.addEventListener("phonemove", handlePhoneMove);
  }

  get position() {
    return this.mesh.position;
  }

  get quaternion() {
    return this.mesh.quaternion;
  }

  get width() {
    return this.mesh.geometry.parameters.width;
  }

  get height() {
    return this.mesh.geometry.parameters.height;
  }

  get depth() {
    return this.mesh.geometry.parameters.depth;
  }
}

export default Collider;
