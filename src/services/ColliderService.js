import PowerUpService from './PowerUpService';

export default class ColliderService {
  /**
   * Add the Colliders
   */
  static addColliders(scene) {
    console.log('start adding colliders')
    // define tiles body
    scene.solLayer.setCollisionByProperty({ collides: true });

    // Handle player colliders
    scene.physics.add.collider(scene.playerGroup, scene.solLayer, null, null, scene);

    // Handle enemies colliders
    // scene.physics.add.collider(scene.enemyGroup, scene.solLayer, undefined, undefined, scene);

    
    // Collisions with powerUps
    scene.physics.add.overlap(scene.powerUpGroup, scene.player0, (elm) => {
      PowerUpService.getPowerUp(scene, elm)
    }, undefined, scene);
  }
}