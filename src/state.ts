import * as THREE from "three";
import PhysicsWorld from "./physics/PhysicsWorld";
import { Level } from "./utils/loadLevel";
import CameraController from "./CameraController";

class AppState {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;

  ballMesh: THREE.Mesh<THREE.SphereGeometry>;
  physics: PhysicsWorld;

  clock: THREE.Clock;
  physicsClock: THREE.Clock;
  cameraController: CameraController;

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

  }

  setLevel(level : Level) {
    
    // clear the scene
    this.scene.remove.apply(this.scene, this.scene.children);

    this.scene.add(level.playerMesh);
    for (let colliderMesh of level.colliderMeshes) {
      this.scene.add(colliderMesh);
    }

    this.physics = new PhysicsWorld(level.playerMesh, level.colliderMeshes);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

const state = new AppState();

export default state;
