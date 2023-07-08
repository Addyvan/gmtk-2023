import {Particles} from "ptcl";
import Player from "./Player";
import Collider from "./Collider";
import {collisionDetection, collisionResponse} from "./core";
import state from "../state";

class PhysicsWorld {

  maxParticles: number;
  particles: Particles;

  player : Player;
  colliders : Array<Collider>;

  constructor(playerMesh: THREE.Mesh<THREE.SphereGeometry>, colliderMeshArr: Array<THREE.Mesh<THREE.BoxGeometry>>, maxParticles: number = 1) {
    this.maxParticles = maxParticles;
    this.particles = new Particles(this.maxParticles);
    // TODO come up with a proper way of initializing a level's particle
    for (let particle of this.particles) {
      particle.resetState();
      particle.setMass(2);
      particle.setPosition(0, 1, 0);
      particle.setVelocity(
        0.1 * (Math.random() - 0.5),
        0,
        0.1 * (Math.random() - 0.5)
      );
    }

    this.player = new Player(this.particles, playerMesh);
    state.cameraController.setPlayer(this.player);
    this.colliders = colliderMeshArr.map((colliderMesh) => {
      return(new Collider(colliderMesh));
    })
  }

  update(dt : number) {

    // hacky might need to change?
    this.particles._addForce(0, 0, -10, 0);

    this.player.isFlying = true;
    for (let collider of this.colliders) {
      let {collided, normal, penetration} = collisionDetection(
        this.player,
        collider
      );

      if (collided) {
        this.player.isFlying = false;

        collisionResponse(this.particles, 0, normal, penetration, 0.0)

        const popSpeed = 3;

      //console.log(collider.mesh.userData.deltaGammaRad > 0.05, this.player.position.x - collider.mesh.position.x > collider.depth/4, collider.mesh.userData.prevGammaRads.length == 10)

        if ((collider.mesh.userData.deltaBetaRad > 0.1 && 
            this.player.position.z - collider.mesh.position.z < -collider.depth/4 && 
            collider.mesh.userData.prevBetaRads.length == 10) || 
            (collider.mesh.userData.deltaBetaRad < -0.1 && 
            this.player.position.z - collider.mesh.position.z > collider.depth/4 && 
            collider.mesh.userData.prevBetaRads.length == 10) || 
            (collider.mesh.userData.deltaGammaRad > 0.1 && 
            this.player.position.x - collider.mesh.position.x > collider.width/4 && 
            collider.mesh.userData.prevGammaRads.length == 10) ||
            (collider.mesh.userData.deltaGammaRad < -0.1 && 
            this.player.position.x - collider.mesh.position.x > -collider.width/4 && 
            collider.mesh.userData.prevGammaRads.length == 10)) {

          console.log('pop');
          this.particles._addVelocity(0,0,popSpeed,0); 
          collider.mesh.userData.prevBetaRads = [];
          collider.mesh.userData.prevGammaRads = [];
        }
        
        if (collider.mesh.userData.endPlatform){
          //console.log('level complete!')
        }
      }
    }


    // TODO: Come up with a proper system for mapping physics changes to the objects
    this.player.updatePos();
  
    this.particles.integrate(dt);
  }

};

export default PhysicsWorld;
