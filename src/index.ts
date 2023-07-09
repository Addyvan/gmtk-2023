import "./index.css";
import state from "./state";
import DeviceOrientationHandler from "./utils/DeviceOrientationHandler";
import { loadAudio } from "./audio";
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

  await state.nextLevel();
  state.clock.getDelta();
  loadAudio(state.camera);
  update();
}
start();
