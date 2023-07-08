import * as THREE from "three";
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

export default bufferToBoxGeo;
