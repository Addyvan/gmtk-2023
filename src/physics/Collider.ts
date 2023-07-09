import * as THREE from "three";
import state from "../state";
import bufferToBoxGeo from "../utils/bufferToBoxGeo";
import { Octree } from "./Octree.js";
//@ts-ignore
import { OctreeHelper } from "three/addons/helpers/OctreeHelper.js";
import Player from "./Player";

class Collider {
  mesh: THREE.Mesh<THREE.BufferGeometry>;
  geometry: THREE.BufferGeometry;
  boxGeometry: THREE.BoxGeometry;

  deltaBetaRad: number;

  // if true then we should be lerping back to original position
  needsUpdate: boolean = false;
  originalOrientation: THREE.Quaternion;

  octree: Octree;
  octreeHelper: OctreeHelper;
  octreeNeedsUpdate: boolean = true;

  desiredRotation: THREE.Vector3;

  constructor(mesh: THREE.Mesh<THREE.BufferGeometry>) {
    this.mesh = mesh;

    this.octree = new Octree();
    this.octree.fromGraphNode(mesh);
    console.log(this.octree.triangles);

    this.originalOrientation = this.mesh.quaternion.clone();
    this.boxGeometry = bufferToBoxGeo(mesh.geometry, mesh.scale);
  }

  get id() {
    return this.mesh.id;
  }

  get position() {
    return this.mesh.position;
  }

  get quaternion() {
    return this.mesh.quaternion;
  }

  get width() {
    return this.boxGeometry.parameters.width;
  }

  get height() {
    return this.boxGeometry.parameters.height;
  }

  get depth() {
    return this.boxGeometry.parameters.depth;
  }

  isActive() {
    return state.activeCollider.id === this.id;
  }

  setRotationFromDeviceOrientation(betaRad: number, gammaRad: number) {
    if (this.mesh.userData.controllable) {
      this.mesh.rotation.set(betaRad, 0, -gammaRad);
      this.octreeNeedsUpdate = true;
      // this.octree.rotation.set(betaRad, 0, -gammaRad);
      // this.octree.updateRotation(this.mesh.matrixWorld);
    }
  }

  setDebugColor(collided: boolean) {
    //@ts-ignore
    this.mesh.material.color = collided
      ? new THREE.Color(0xff0000)
      : new THREE.Color(0x00ff00);
  }

  update(dt: number) {
    this.mesh.quaternion.slerp(this.originalOrientation, dt);
    if (this.mesh.quaternion.dot(this.originalOrientation) < dt) {
      this.needsUpdate = false;
    }
  }

  collide(player: Player) {


    // HELP ME NOT DO THIS PLEASE GOD
    if (this.octreeNeedsUpdate) {
      this.octree = new Octree();
      this.octree.fromGraphNode(this.mesh);
      this.octreeNeedsUpdate = false;
    }

    return this.octree.sphereIntersect(
      new THREE.Sphere(player.position, player.radius)
    );
  }
}

export default Collider;
