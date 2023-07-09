import * as THREE from "three";
import "./index.css";
import levels from "./levels";
import state from "./state";
import DeviceOrientationHandler from "./utils/DeviceOrientationHandler";
import { update } from "./update";

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

  await state.setLevels(levels);
  await state.nextLevel();
  state.clock.getDelta();
  update();
}
start();
