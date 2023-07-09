import "./index.css";
import state from "./state";
import DeviceOrientationHandler from "./utils/DeviceOrientationHandler";
import { loadAudio } from "./audio";
import { update } from "./update";

const deviceOrientationHandler = new DeviceOrientationHandler();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const requestWakeLock = async () => {
  try {
    //@ts-ignore
    wakeLock = await navigator.wakeLock.request();
  } catch (err) {
    alert(err);
    console.error(`${err.name}, ${err.message}`);
  }
};

async function start() {

  try {
    await requestWakeLock();
  } catch {

  }

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
