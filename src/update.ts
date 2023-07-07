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

  state.render();
}

let physicsDt = state.physicsClock.getDelta();
/**
 * The physic update loop
 */
function fixedUpdate() {
  physicsDt = state.physicsClock.getDelta();
  state.physics.update(physicsDt);
}

export { update, fixedUpdate };
