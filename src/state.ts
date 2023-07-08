import * as THREE from "three";
import PhysicsWorld from "./physics/PhysicsWorld";
import { Level } from "./utils/loadLevel";
import CameraController from "./CameraController";
import Collider from "./physics/Collider";

class AppState {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;

  ballMesh: THREE.Mesh<THREE.SphereGeometry>;
  physics: PhysicsWorld;

  clock: THREE.Clock;
  physicsClock: THREE.Clock;
  cameraController: CameraController;

  activeCollider: Collider;

  prevBetaRad: number = 0;
  prevGammaRad: number = 0;
  deltaBetaRad: number = 0;
  deltaGammaRad: number = 0;

  constructor() {
    // THREE.js init
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.cameraController = new CameraController(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      //@ts-ignore
      canvas: document.getElementById("canvas"),
    });
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    this.clock = new THREE.Clock();
    this.physicsClock = new THREE.Clock();

    this.activeCollider = null;
    window.addEventListener("phonemove", (evt: any) =>
      this.handlePhoneMove(evt)
    );
  }

  setLevel(level: Level) {
    // clear the scene
    this.scene.remove.apply(this.scene, this.scene.children);

    this.scene.add(level.playerMesh);
    for (let colliderMesh of level.colliderMeshes) {
      this.scene.add(colliderMesh);
    }

    this.physics = new PhysicsWorld(level.playerMesh, level.colliderMeshes);
  }

  handlePhoneMove(evt: CustomEvent<any>) {
    const { _, betaRad, gammaRad } = evt.detail;

    // if we are currently balancing on a collider then move it
    if (this.activeCollider !== null) {
      this.activeCollider.setRotationFromDeviceOrientation(betaRad, gammaRad);

      this.deltaBetaRad = this.prevBetaRad - betaRad;
      this.deltaGammaRad = -(this.prevGammaRad - gammaRad);
    }

    this.prevBetaRad = betaRad;
    this.prevGammaRad = gammaRad;
  }

  setActiveCollider(collider: Collider | null) {
    this.deltaBetaRad = 0;
    this.deltaGammaRad = 0;

    if (this.activeCollider !== null) {
      // setting needsUpdate to true here triggers the platform to be
      // lerp-ed back to its original rotation
      this.activeCollider.needsUpdate = true;
      this.activeCollider = null;
    }

    this.activeCollider = collider;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

const state = new AppState();

export default state;
