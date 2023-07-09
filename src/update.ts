import state from "./state";
let dt: number = state.clock.getDelta();

/**
 * The main update loop
 */
function update() {
  requestAnimationFrame(update);

  if (state.levelSwitching) {
    return;
  }

  // monitored code goes here
  dt = state.clock.getDelta();
  state.cameraController.update(dt);

  // player is on the physics object but this specific update should run on the render loop IMO
  state.physics.player.update(dt);

  state.physics.update(dt);

  for (let collider of state.physics.colliders) {
    if (collider.needsUpdate) {
      collider.update(dt);
    }
  }

  state.render();
}

export { update };
