import * as THREE from "three";
import { FBXLoader } from "three-stdlib";

const loader = new FBXLoader();

function loadCharacter(name: string): Promise<Level> {
  return new Promise((resolve, reject) => {
    const onLoad = (gltf: THREE.Group) => {
      resolve();
    };
    const onProgress = (evt: ProgressEvent<EventTarget>) => {
      console.log(`Loading level ${evt}`, evt);
    };
    const onError = (evt: ErrorEvent) => {
      console.error("Error loading level:", evt);
      reject(evt);
    };
    loader.load(`/assets/${name}.glb`, onLoad, onProgress, onError);
  });
}

export default loadCharacter;
