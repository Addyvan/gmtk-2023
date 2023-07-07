import * as THREE from "three";
import state from "./state";

const clock = new THREE.Clock();
let dt: number = clock.getDelta();

/**
 * The main update loop
 */
function update() {
  requestAnimationFrame(update);

  dt = clock.getDelta();

  state.render();
}

const physicsClock = new THREE.Clock();
let physicsDt = physicsClock.getDelta();
/**
 * The physic update loop
 */
function fixedUpdate() {
  physicsDt = physicsClock.getDelta();
  state.physics.update(physicsDt);
}

export { update, fixedUpdate };
