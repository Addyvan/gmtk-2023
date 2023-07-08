import * as THREE from "three";
import checkSupportFor from "../utils/checkSupport";

class Collider {
  mesh: THREE.Mesh<THREE.BoxGeometry>;
  geometry: THREE.BoxGeometry;

  constructor(mesh: THREE.Mesh<THREE.BoxGeometry>) {
    this.mesh = mesh;

    this.mesh.userData.prevBetaRads = [];
    this.mesh.userData.prevGammaRads = [];

    // TODO: CHANGE ASAP (ADDY)
    const handlePhoneMove = (evt: CustomEvent) => {
      const { alphaRad, betaRad, gammaRad } = evt.detail;

      this.mesh.userData.prevBetaRads.unshift(betaRad);
      if (this.mesh.userData.prevBetaRads.length > 10) {
        this.mesh.userData.prevBetaRads.pop();
      }

      this.mesh.userData.prevGammaRads.unshift(gammaRad);
      if (this.mesh.userData.prevGammaRads.length > 10) {
        this.mesh.userData.prevGammaRads.pop();
      }

      if (this.mesh.userData.movable) {
        this.mesh.userData.deltaBetaRad = this.mesh.userData.prevBetaRads[0]-this.mesh.userData.prevBetaRads[1];
        this.mesh.userData.deltaGammaRad = -(this.mesh.userData.prevGammaRads[0]-this.mesh.userData.prevGammaRads[1]);
        this.mesh.rotation.set(betaRad, 0, -gammaRad);
      }
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
