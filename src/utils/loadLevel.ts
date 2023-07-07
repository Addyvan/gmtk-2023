import { GLTFLoader, GLTF } from "three-stdlib";

export type Level = {
  name: string;
};

const loader = new GLTFLoader();

function loadLevel(name: string): Promise<Level> {
  return new Promise((resolve, reject) => {
    const onLoad = (gltf: GLTF) => {
      console.log(gltf);
      resolve({
        name: name,
      });
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

export default loadLevel;
