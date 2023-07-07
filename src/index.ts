import loadLevel, { Level } from "./utils/loadLevel";
import { update, fixedUpdate } from "./update";
import state from "./state";

loadLevel("test").then((level: Level) => {
  console.log(level);

  state.setLevel(level);

  function start() {
    setInterval(() => {
      fixedUpdate();
    }, 1000 / 30);
    update();
  }
  
  start();
});

