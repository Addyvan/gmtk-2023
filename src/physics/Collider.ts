import * as THREE from "three";
import checkSupportFor from "../utils/checkSupport";

class Collider {
  mesh : THREE.Mesh<THREE.BoxGeometry>;
  geometry : THREE.BoxGeometry;

  constructor(mesh: THREE.Mesh<THREE.BoxGeometry>) {
    this.mesh = mesh;
  

    // TODO: CHANGE ASAP (ADDY)

    let init = true;
    let [alpha0, beta0, gamma0] = [0,0,0];

    const handleDeviceOrientation = (event) => {
      // Get the rotation values from the event
      let { alpha, beta, gamma } = event;

      if (init){
        [alpha0,beta0,gamma0] = [alpha,beta,gamma];
        init = false;
      } 

      alpha -= alpha0;
      beta -= beta0;
      gamma -= gamma0;
    
      // Convert degrees to radians
      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);
    
      // Set the cube rotation based on the device orientation
      this.mesh.rotation.set(betaRad, -gammaRad, alphaRad);
    }
    
    
    if (checkSupportFor("Device Orientation", "ondeviceorientation")) {
      console.log("add deviceorientation handler");
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    }

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
