import * as THREE from "three";
import PhysicsWorld from "./physics/PhysicsWorld";
import { Level } from "./utils/loadLevel";
import CameraController from "./CameraController";
import Collider from "./physics/Collider";

import { EffectComposer } from "three-stdlib";
import { RenderPixelatedPass } from "three/examples/jsm/postprocessing/RenderPixelatedPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import loadLevel from "./utils/loadLevel";
import levels from "./levels";

class AppState {

  levelSwitching: boolean = true;

  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;

  ballMesh: THREE.Mesh<THREE.SphereGeometry>;
  physics: PhysicsWorld;
  flag: THREE.Object3D;

  clock: THREE.Clock;
  physicsClock: THREE.Clock;
  cameraController: CameraController;

  activeCollider: Collider;

  prevBetaRad: number = 0;
  prevGammaRad: number = 0;
  deltaBetaRad: number = 0;
  deltaGammaRad: number = 0;

  levels: Array<Level>;
  levelIndex: number = 0;

  composer: EffectComposer;

  holeClock: THREE.Clock;

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
      antialias: true,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.useLegacyLights = false;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    this.clock = new THREE.Clock();
    this.physicsClock = new THREE.Clock();

    this.activeCollider = null;
    window.addEventListener("phonemove", (evt: any) =>
      this.handlePhoneMove(evt)
    );

    this.composer = new EffectComposer(this.renderer);
    const renderPixelatedPass = new RenderPixelatedPass(
      2,
      this.scene,
      this.camera
    );
    renderPixelatedPass.normalEdgeStrength = 1;
    renderPixelatedPass.depthEdgeStrength = 1;
    this.composer.addPass(renderPixelatedPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  setLevel(level: Level) {
    // clear the scene
    this.scene.remove.apply(this.scene, this.scene.children);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(50, 20, 0);
    this.scene.add(dirLight);
    this.scene.add(level.flag);
    this.flag = level.flag;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 32;

    const context: any = canvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, 0, 32);
    gradient.addColorStop(0.0, "#014a84");
    gradient.addColorStop(0.5, "#0561a0");
    gradient.addColorStop(1.0, "#437ab6");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 32);

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(80),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(canvas),
        side: THREE.BackSide,
      })
    );
    this.scene.add(sky);

    this.scene.add(level.playerMesh);
    for (let colliderMesh of level.colliderMeshes) {
      this.scene.add(colliderMesh);
    }

    this.physics = new PhysicsWorld(level.playerMesh, level.colliderMeshes);
  }

  nextLevel() {
    this.levelSwitching = true;
    if (this.levelIndex > levels.length - 1) {
      this.levelIndex = 0;
      alert("Thanks for playing, please leave a review!");
    }

    loadLevel(levels[this.levelIndex]).then((level) => {
      this.setLevel(level);
      this.levelIndex += 1;
      this.levelSwitching = false;
    });
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
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();
  }
}

const state = new AppState();

export default state;
