import * as THREE from "three";
import state from "./state";

let dt: number = state.clock.getDelta();

/**
 * The main update loop
 */
function update() {
  requestAnimationFrame(update);

  dt = state.clock.getDelta();

  state.cameraController.update(dt);

  // player is on the physics object but this specific update should run on the render loop IMO
  state.physics.player.update(dt);

  state.render();
}

let physicsDt = state.physicsClock.getDelta();
/**
 * The physic update loop
 */
function fixedUpdate() {
  physicsDt = state.physicsClock.getDelta();
  state.physics.update(physicsDt);

  for (let collider of state.physics.colliders) {
    if (collider.needsUpdate) {
      collider.update(physicsDt);
    }
  }
}

export { update, fixedUpdate };
