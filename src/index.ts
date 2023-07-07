import loadLevel, { Level } from "./utils/loadLevel";
import { update, fixedUpdate } from "./update";

loadLevel("test").then((level: Level) => {
  console.log(level);
});

function start() {
  setInterval(() => {
    fixedUpdate();
  }, 1000 / 30);
  update();
}

start();
