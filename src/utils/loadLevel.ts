import * as THREE from "three";
import { GLTFLoader, GLTF } from "three-stdlib";
import Ball from "../physics/Ball";
import Collider from "../physics/Collider";

export type Level = {
  name: string;
  ballMesh: THREE.Mesh<THREE.SphereGeometry>;
  colliderMeshes: Array<THREE.Mesh<THREE.BoxGeometry>>;
};

const loader = new GLTFLoader();

function loadLevel(name: string): Promise<Level> {
  return new Promise((resolve, reject) => {
    const onLoad = (gltf: GLTF) => {
      console.log("gltf", gltf);

      let ball: THREE.Mesh<THREE.SphereGeometry>;
      let colliders: Array<THREE.Mesh<THREE.BoxGeometry>> = [];

      gltf.scene.traverse((obj: any) => {
        if (obj.userData.ball) {
          if (ball !== undefined) {
            reject("Can only have one ball on a level!");
          }
          ball = new THREE.Mesh(
            bufferToSphereGeo(obj.geometry, obj.scale),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
          );
          ball.position.set(obj.position.x, obj.position.y, obj.position.z);
        }

        if (obj.userData.collider) {
          let colliderMesh = new THREE.Mesh(
            bufferToBoxGeo(obj.geometry, obj.scale),
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
          );
          colliderMesh.position.set(
            obj.position.x,
            obj.position.y,
            obj.position.z
          );
          colliderMesh.rotation.setFromQuaternion(obj.quaternion);
          colliders.push(colliderMesh);
        }
      });

      resolve({
        name: name,
        ballMesh: ball,
        colliderMeshes: colliders,
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

function bufferToBoxGeo(
  bufferGeometry: THREE.BufferGeometry,
  scale: THREE.Vector3
) {
  const positionAttribute = bufferGeometry.getAttribute("position");

  // Get the array buffer containing the position data
  const positionArray = positionAttribute.array;

  // Calculate the minimum and maximum coordinates
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  for (let i = 0; i < positionArray.length; i += 3) {
    const x = positionArray[i] * scale.x;
    const y = positionArray[i + 1] * scale.y;
    const z = positionArray[i + 2] * scale.z;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);

    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }

  // Calculate the dimensions of the box
  const width = maxX - minX;
  const height = maxY - minY;
  const depth = maxZ - minZ;

  // Create the new BoxGeometry
  return new THREE.BoxGeometry(width, height, depth);
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
