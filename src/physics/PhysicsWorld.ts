import * as THREE from "three";
import { Particles } from "ptcl";
import Player from "./Player";
import Collider from "./Collider";
import {
  collisionDetection,
  collisionResponse,
  closestPointOnBox,
} from "./core";
import state from "../state";

class PhysicsWorld {
  maxParticles: number;
  particles: Particles;

  player: Player;
  colliders: Array<Collider>;

  constructor(
    playerMesh: THREE.Mesh<THREE.SphereGeometry>,
    colliderMeshArr: Array<THREE.Mesh<THREE.BoxGeometry>>,
    maxParticles: number = 1
  ) {
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
      return new Collider(colliderMesh);
    });
  }

  update(dt: number) {
    // hacky might need to change?
    this.particles._addForce(0, 0, -10, 0);

    if (this.player.position.y < -5) {
      this.player.reset();
      return;
    }

    for (let collider of this.colliders) {
      if (!this.player.isFlying && !collider.isActive()) continue;

      const { collided, normal, penetration } = collisionDetection(
        this.player,
        collider
      );
      if (!collided) {
        this.player.framesSinceLastCollision += 1;
      }

      if (collider.mesh.userData.endPlatform) {
        //console.log('level complete!')
      } else {
        // collider.setDebugColor(collided);
      }

      if (this.player.isFlying) {
        // if we are flying and have not collided with a platform then do nothing
        if (!collided) continue;

        // if we are flying and have collided then we should set the active collider
        // and toggle player.isFlying
        if (this.player.timeSinceLastPop > 0.1) {
          this.player.isFlying = false;
          this.player.framesSinceLastCollision = 0;
          state.setActiveCollider(collider);
        }
      } else {
        if (this.player.framesSinceLastCollision > 10) {
          this.player.isFlying = true;
          this.player.timeSinceLastPop = 0;
        }
      }

      // Handle interaction between the player and the platform
      if (collided) {
        this.player.framesSinceLastCollision = 0;
        if (this.player.timeSinceLastPop > 0.2) {
          collisionResponse(this.particles, 0, normal, penetration, 0.0);
        }

        let frictionCoeff = 0.1;
        let friction = this.particles
          ._getVelocity(0)
          .clone()
          .normalize()
          .multiplyScalar(-frictionCoeff * 10);
        //this.particles._addForce(0, friction.x, friction.y, friction.z);

        if (!collider.mesh.userData.controllable) {
          let velocity = this.particles._getVelocity(0);
          if (velocity.lengthSq() < 0.03) {
            this.player.resetFramesCounter += 1;
            if (this.player.resetFramesCounter > 30) {
              this.player.reset();
            }
          }
          continue;
        }

        if (this.player.timeSinceLastPop < 0.2) {
          continue;
        }

        let dBetaRad = state.deltaBetaRad;
        let dGammaRad = state.deltaGammaRad;
        const popSensitivity = 0.05;

        if (
          dBetaRad < -popSensitivity &&
          this.player.position.z - collider.mesh.position.z <
            -collider.depth / 4
        ) {
          this.player.pop();
        }

        /**
        if (
          dBetaRad > popSensitivity &&
          this.player.position.z - collider.mesh.position.z > collider.depth / 4
        ) {
          this.player.pop();
        }

        if (
          dGammaRad < popSensitivity &&
          this.player.position.x - collider.mesh.position.x > collider.width / 4
        ) {
          this.player.pop();
        }

        if (
          dGammaRad > -popSensitivity &&
          this.player.position.x - collider.mesh.position.x <
            -collider.width / 4
        ) {
          this.player.pop();
        }
        **/
      }
    }

    this.particles.integrate(dt);
  }
}

export default PhysicsWorld;
