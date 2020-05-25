import PowerUpService from './PowerUpService';
import MapService from './MapService';

export default class ColliderService {
  /**
   * Add the Colliders
   */
  static addColliders(scene) {
    console.log('start adding colliders')
    // define tiles body
    scene.solLayer.setCollisionByProperty({ collides: true });

    // Handle player colliders
    scene.physics.add.collider(scene.playerGroup, scene.solLayer, (player, tile) => {
      if (tile.index === 18) {
        player.playerIsHit()
      }
      
    }, null, scene);
    scene.physics.add.collider(scene.player0, scene.doorGroup, (door, player) => MapService.changeRoom(scene, door, player), null, scene);

    // Handle enemies colliders
    // scene.physics.add.collider(scene.enemyGroup, scene.solLayer, undefined, undefined, scene);

    
    // Collisions with powerUps
    scene.physics.add.collider(scene.powerUpGroup, scene.player0, (elm) => {
      PowerUpService.getPowerUp(scene, elm)
    }, undefined, scene);
  }
}