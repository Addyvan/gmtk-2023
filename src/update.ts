import * as THREE from "three";
import state from "./state";
import Stats from "stats.js";
var stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

let dt: number = state.clock.getDelta();

/**
 * The main update loop
 */
function update() {
  requestAnimationFrame(update);

  stats.begin();

  // monitored code goes here
  dt = state.clock.getDelta();
  state.cameraController.update(dt);

  // player is on the physics object but this specific update should run on the render loop IMO
  state.physics.player.update(dt);

  state.render();

  state.physics.update(dt);

  for (let collider of state.physics.colliders) {
    if (collider.needsUpdate) {
      collider.update(dt);
    }
  }

  stats.end();
}

let physicsDt = state.physicsClock.getDelta();
/**
 * The physic update loop
 */
function fixedUpdate() {
  physicsDt = state.physicsClock.getDelta();
  // state.physics.update(physicsDt);

  // for (let collider of state.physics.colliders) {
  //   if (collider.needsUpdate) {
  //     collider.update(physicsDt);
  //   }
  // }
}

export { update, fixedUpdate };
