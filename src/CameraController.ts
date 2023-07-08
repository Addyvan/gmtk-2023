import * as THREE from "three";
import Player from "./physics/Player";
import state from "./state";
import Collider from "./physics/Collider";

// TODO: Maybe the offset should be conditional based off the current active collider?

const onPlatformOffset = new THREE.Vector3(0, 3, 2);

const offPlatformOffset = new THREE.Vector3(
  0,
  onPlatformOffset.y - 1,
  onPlatformOffset.z - 1
);

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
    this.camera.position.set(0, onPlatformOffset.y, onPlatformOffset.z);
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



    if (!this.player.isFlying || (state.activeCollider === null) ? false : !state.activeCollider.mesh.userData.controllable ) {
      this.desiredPosition.set(
        state.activeCollider.position.x + onPlatformOffset.x,
        state.activeCollider.position.y + onPlatformOffset.y,
        state.activeCollider.position.z + onPlatformOffset.z
      );
    } else {
      this.desiredPosition.set(
        this.player.position.x + offPlatformOffset.x,
        this.player.position.y + offPlatformOffset.y,
        this.player.position.z + offPlatformOffset.z
      );
    }

    this.currentPosition.lerp(this.desiredPosition, dt * 10);
    this.camera.position.copy(this.currentPosition);
  }
}

export default CameraController;
