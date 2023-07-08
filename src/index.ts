import * as THREE from "three";
import "./index.css";
import loadLevel, { Level } from "./utils/loadLevel";
import { update, fixedUpdate } from "./update";
import state from "./state";
import DeviceOrientationHandler from "./utils/DeviceOrientationHandler";

// The wake lock sentinel.
let wakeLock = null;

// Function that attempts to request a screen wake lock.
const requestWakeLock = async () => {
  try {
    //@ts-ignore
    wakeLock = await navigator.wakeLock.request();
  } catch (err) {
    alert(err);
    console.error(`${err.name}, ${err.message}`);
  }
};

const deviceOrientationHandler = new DeviceOrientationHandler();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function start() {
  // Request a screen wake lock…
  await requestWakeLock();
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
      }, 1000 / 40);
      update();
    }

    state.clock.getDelta();
    state.physicsClock.getDelta();
    start();
  });
}
start();
