import * as THREE from "three";
import loadLevel, { Level } from "./utils/loadLevel";
import { update, fixedUpdate } from "./update";
import state from "./state";
import DeviceOrientationHandler from "./utils/DeviceOrientationHandler";

const deviceOrientationHandler = new DeviceOrientationHandler();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function start() {
  while (true) {
    if (deviceOrientationHandler.calibrated) {
      break;
    }
    await sleep(100);
  }
  loadLevel("test").then((level: Level) => {

    state.setLevel(level);

    function start() {
      setInterval(() => {
        fixedUpdate();
      }, 1000 / 30);
      update();
    }

    state.clock.getDelta();
    state.physicsClock.getDelta();
    start();
  });
}
start();
