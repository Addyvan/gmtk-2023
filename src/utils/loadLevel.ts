import * as THREE from "three";
import { GLTFLoader, GLTF } from "three-stdlib";
import { Octree } from "three-stdlib";

export type Level = {
  name: string;
  playerMesh: THREE.Mesh<THREE.SphereGeometry>;
  colliderMeshes: Array<THREE.Mesh<THREE.BoxGeometry>>;
  flag: THREE.Group;
};

const loader = new GLTFLoader();

function loadLevel(name: string): Promise<Level> {
  return new Promise((resolve, reject) => {
    const onLoad = (gltf: GLTF) => {
      let player: THREE.Mesh<THREE.SphereGeometry>;
      let colliders: Array<THREE.Mesh<THREE.BoxGeometry>> = [];
      let flag: THREE.Group;
      gltf.scene.traverse((obj: any) => {
        if (obj.userData.ball) {
          if (player !== undefined) {
            reject("Can only have one ball on a level!");
          }
          player = new THREE.Mesh(
            bufferToSphereGeo(obj.geometry, obj.scale),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
          );
          player.position.set(obj.position.x, obj.position.y, obj.position.z);
          return;
        }

        if (obj.userData.collider === true) {
          colliders.push(obj);
          return;
        }

        if (obj.name === "flag") {
          flag = obj;
          flag.userData.octree = new Octree();
          flag.userData.octree.fromGraphNode(flag);
          return;
        }
      });

      resolve({
        name: name,
        playerMesh: player,
        colliderMeshes: colliders,
        flag,
      });
    };
    const onProgress = (evt: ProgressEvent<EventTarget>) => {
      console.log(`Loading level ${evt}`, evt);
    };
    const onError = (evt: ErrorEvent) => {
      console.error("Error loading level:", evt);
      reject(evt);
    };
    loader.load(`./assets/${name}.glb`, onLoad, onProgress, onError);
  });
}

function bufferToSphereGeo(
  bufferGeometry: THREE.BufferGeometry,
  scale: THREE.Vector3
) {
  // Extract the position attribute from the buffer geometry
  const positionAttribute = bufferGeometry.getAttribute("position");

  // Get the array buffer containing the position data
  const positionArray = positionAttribute.array;

  // Calculate the center of the sphere
  let centerX = 0,
    centerY = 0,
    centerZ = 0;

  for (let i = 0; i < positionArray.length; i += 3) {
    centerX += positionArray[i] * scale.x;
    centerY += positionArray[i + 1] * scale.y;
    centerZ += positionArray[i + 2] * scale.z;
  }

  centerX /= positionArray.length / 3;
  centerY /= positionArray.length / 3;
  centerZ /= positionArray.length / 3;

  // Calculate the radius of the sphere
  let radius = 0;

  for (let i = 0; i < positionArray.length; i += 3) {
    const dx = positionArray[i] * scale.x - centerX;
    const dy = positionArray[i + 1] * scale.y - centerY;
    const dz = positionArray[i + 2] * scale.z - centerZ;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    radius = Math.max(radius, distance);
  }

  // Create the new SphereGeometry
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);

  // Set the position of the sphere geometry to match the center of the original object
  sphereGeometry.translate(centerX, centerY, centerZ);

  return sphereGeometry;
}

export default loadLevel;
