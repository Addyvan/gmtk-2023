import * as THREE from "three";
import checkSupportFor from "../utils/checkSupport";

class Collider {
  mesh: THREE.Mesh<THREE.BoxGeometry>;
  geometry: THREE.BoxGeometry;

  
  
  deltaBetaRad: number;

  constructor(mesh: THREE.Mesh<THREE.BoxGeometry>) {
    this.mesh = mesh;

    const prevBetaRads = [];


    // TODO: CHANGE ASAP (ADDY)
    const handlePhoneMove = (evt: CustomEvent) => {
      const { alphaRad, betaRad, gammaRad } = evt.detail;

      prevBetaRads.unshift(betaRad);
      if (prevBetaRads.length >= 5) {
        prevBetaRads.pop();
      }
      let deltaBetaRad = Math.abs(prevBetaRads[0] - prevBetaRads[4]);

      if (this.mesh.userData.movable) {
        this.mesh.userData.deltaBetaRad = deltaBetaRad;
        this.mesh.userData.popPosZ = betaRad-this.mesh.rotation.x > 0.1? true: false;
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
