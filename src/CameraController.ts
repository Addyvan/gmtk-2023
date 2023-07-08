import * as THREE from "three";
import Player from "./physics/Player";
import Collider from "./physics/Collider";

// TODO: Maybe the offset should be conditional based off the current active collider?

const onPlatformOffset = new THREE.Vector3(0, 5, 3);

const offPlatformOffset = new THREE.Vector3(0, 5 / 2, 3 / 2);

class CameraController {
  camera: THREE.PerspectiveCamera;
  player: Player | null;

  currentCameraOffset: THREE.Vector3;

  currentPosition: THREE.Vector3;
  desiredPosition: THREE.Vector3;

  constructor(camera: THREE.PerspectiveCamera) {
    this.currentPosition = new THREE.Vector3();
    this.desiredPosition = new THREE.Vector3();

    this.camera = camera;
    this.camera.position.set(0, 5, 3);
    this.camera.lookAt(0, 0, 0);

    this.player = null;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  update(dt: number) {
    if (this.player === null) {
      return;
    }
    let offset = this.player.isFlying ? offPlatformOffset : onPlatformOffset;
    this.desiredPosition.set(
      this.player.position.x + offset.x,
      this.player.position.y + offset.y,
      this.player.position.z + offset.z
    );

    this.currentPosition.lerp(this.desiredPosition, dt);
    this.camera.position.copy(this.currentPosition);
  }
}

export default CameraController;
