import PowerUpService from './PowerUpService';
import MapService from './MapService';
import LayerService from './LayerService'

export default class ColliderService {
  /**
   * Add the Colliders
   */
  static addColliders(scene) {
    // define tiles body
    scene.solLayer.setCollisionByProperty({ collides: true });

    // Handle player colliders
    scene.physics.add.collider(scene.playerGroup, scene.solLayer, (player, tile) => {
      if (tile.index === 18 || tile.index === 26) {
        player.playerIsHit();
      }
    }, null, scene);

    if (LayerService.checkIfLayerExists(scene, 'invisible')) {
      scene.invisibleLayer.setCollisionByProperty({ collides: true });
      scene.physics.add.collider(scene.player0, scene.invisibleLayer);
      scene.invisibleLayer.setAlpha(0);
    }

    scene.physics.add.collider(scene.player0, scene.doorGroup, (player, door) => {
      if (player.stateMachine.state === 'attack') {
        return;
      }
      MapService.changeRoom(scene, player, door);
    }, null, scene);

    // Handle enemies colliders
    scene.physics.add.collider(scene.enemyGroup, scene.solLayer, undefined, undefined, scene);
    scene.physics.add.overlap(scene.enemyGroup, scene.playerGroup, (spike, player) => {
      player.playerIsHit();
    }, undefined, scene);

    
    // Collisions with powerUps
    scene.physics.add.collider(scene.powerUpGroup, scene.player0, (elm) => {
      PowerUpService.getPowerUp(scene, elm)
    }, undefined, scene);
  }
}