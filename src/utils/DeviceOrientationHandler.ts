import * as THREE from "three";
import checkSupportFor from "../utils/checkSupport";

class DeviceOrientationHandler {
  alpha0 = 0;
  beta0 = 0;
  gamma0 = 0;
  calibrated: boolean = false;

  constructor() {
    this.initDeviceOrientationListener();
    const button = document.getElementById(
      "device-calibrate-button"
    );
    const container = document.getElementById(
      "device-calibrate-container"
    );
    button.onclick = () => {
      container.style.display = "none";
      this.calibrated = true;
    };
  }

  handleDeviceOrientation(evt) {
    let { alpha, beta, gamma } = evt;

    if (!this.calibrated) {
      this.alpha0 = alpha;
      this.beta0 = beta;
      this.gamma0 = gamma;
    } else {
      const alphaRad = THREE.MathUtils.degToRad(alpha - this.alpha0);
      const betaRad = THREE.MathUtils.degToRad(beta - this.beta0);
      const gammaRad = THREE.MathUtils.degToRad(gamma - this.gamma0);
      window.dispatchEvent(
        new CustomEvent("phonemove", {
          detail: {
            alphaRad,
            betaRad,
            gammaRad,
          },
        })
      );
    }
  }

  initDeviceOrientationListener() {
    if (checkSupportFor("Device Orientation", "ondeviceorientation")) {
      window.addEventListener(
        "deviceorientation",
        (evt) => this.handleDeviceOrientation(evt)
      );
    }
  }
}

export default DeviceOrientationHandler;
