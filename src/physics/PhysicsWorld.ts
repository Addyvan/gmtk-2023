import {Particles} from "ptcl";
import Ball from "./Ball";
import Collider from "./Collider";
import {collisionDetection, collisionResponse} from "./core";

class PhysicsWorld {

  maxParticles: number;
  particles: Particles;

  ball : Ball;
  colliders : Array<Collider>;

  constructor(ballMesh: THREE.Mesh<THREE.SphereGeometry>, colliderMeshArr: Array<THREE.Mesh<THREE.BoxGeometry>>, maxParticles: number = 1) {
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

    this.ball = new Ball(this.particles, ballMesh);
    this.colliders = colliderMeshArr.map((colliderMesh) => {
      return(new Collider(colliderMesh));
    })
  }

  update(dt : number) {

    // hacky might need to change?
    this.particles._addForce(0, 0, -10, 0);

    for (let collider of this.colliders) {
      let {collided, normal, penetration} = collisionDetection(
        this.ball,
        collider
      );

      if (collided) {
        if (collider.mesh.userData.endPlatform){
          // do something
        }
        collisionResponse(this.particles, 0, normal, penetration, 0.0)
      }
    }

    // TODO: Come up with a proper system for mapping physics changes to the objects
    this.ball.updatePos();
  
    this.particles.integrate(dt);
  }

};

export default PhysicsWorld;
