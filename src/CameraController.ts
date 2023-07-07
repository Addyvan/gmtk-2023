import * as THREE from "three";
import Player from "./physics/Player";

class CameraController {
  camera: THREE.PerspectiveCamera;
  player: Player | null;
  currentMoveable: THREE.Mesh | null;

  // currentOrientation: THREE.Quaternion;
  // desiredOrientation: THREE.Quaternion;

  currentPosition: THREE.Vector3;
  desiredPosition: THREE.Vector3;

  constructor(camera: THREE.PerspectiveCamera) {
    // this.currentOrientation = new THREE.Quaternion();
    // this.desiredOrientation = new THREE.Quaternion();

    this.currentPosition = new THREE.Vector3();
    this.desiredPosition = new THREE.Vector3();

    this.camera = camera;
    this.camera.position.set(0, 4, 0);
    this.camera.lookAt(0, 0, 0);
    // this.camera.rotation.set(0, -Math.PI, 0);
    this.player = null;
    this.currentMoveable = null;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  update(dt: number) {
    if (this.player === null) {
      return;
    }

    this.desiredPosition.set(
      this.player.position.x,
      this.player.position.y + 4,
      this.player.position.z + 0
    );

    this.currentPosition.lerp(this.desiredPosition, dt);
  }
}

export default CameraController;
