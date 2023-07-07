import * as THREE from "three";
import PhysicsWorld from "./physics/PhysicsWorld";

class AppState {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;

  ballMesh: THREE.Mesh<THREE.SphereGeometry>;
  physics: PhysicsWorld;

  constructor() {
    // THREE.js init
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      //@ts-ignore
      canvas: document.getElementById("canvas"),
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    // Gameplay objects init

    let geometry = new THREE.SphereGeometry(0.05);
    let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.ballMesh = new THREE.Mesh(geometry, material);

    const colliderGeometry = new THREE.BoxGeometry(2, 1, 2, 3, 1, 3);
    const colliderMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: "red",
    });
    const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
    colliderMesh.position.set(0, -1, 0);

    this.physics = new PhysicsWorld(this.ballMesh, [colliderMesh]);
    this.scene.add(this.ballMesh);
    this.scene.add(colliderMesh);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

const state = new AppState();

export default state;
