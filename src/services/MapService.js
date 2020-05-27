import Constant from '../constant/gameConstant';
import SaveLoadService from './SaveLoadService';
import LayerService from './LayerService';
import DoorService from './DoorService';
import ColliderService from './ColliderService';
import SaveStationService from './SaveStationService';
import CameraService from './CameraService';
import EnemyService from './EnemyService';
import PowerUpService from './PowerUpService';
import ControlsService from './ControlsService';

/**
 * @static loadGame()
 * @static startRoom()
 * @static changeRoom()
 */
export default class MapService {

  /**
   * Load the saved game
   */
  static loadGame(scene) {
    const data = SaveLoadService.getSavedGameData();

    if (typeof data === 'string' && data.length > 2) {
      const parsedData = JSON.parse(data);
      scene.player0.inventory = parsedData;
      scene.player0.x = scene.player0.inventory.savedPositionX;
      scene.player0.y = scene.player0.inventory.savedPositionY;
    } else {
      scene.player0.inventory.savedPositionX = 17 * 16;
      scene.player0.inventory.savedPositionY = 14 * 16;
      SaveLoadService.setNewSavedGame(scene.player0.inventory);
    }
    this.startRoom(scene.player0.inventory.map, scene);
  }

  /**
   * Start the room
   */
  static startRoom(room, scene) {
    // clean up old room
    MapService.destroyRoom(scene);

    // create room
    scene.map = scene.make.tilemap({ key: room, tileWidth: 16, tileHeight: 16 });
    scene.tileset = scene.map.addTilesetImage(scene.map.tilesets[0].name, 'tiles', 16, 16);
    scene.player0Position = room;
    
    LayerService.addLayers(scene);
    DoorService.addDoors(scene);
    scene.player0.x = scene.player0.inventory.savedPositionX + 24;
    scene.player0.y = scene.player0.inventory.savedPositionY;
    ColliderService.addColliders(scene);
    PowerUpService.addPowerUp(scene);
    EnemyService.addEnemies(scene);

    // CAMERA
    CameraService.handleCamera(scene);
    scene.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
    CameraService.setBounds(scene);
    CameraService.startFollowPlayer(scene);

    scene.time.addEvent({
      delay: 1000,
      callback: () => {
        scene.events.emit('loadingDone');
      },
    });
    ControlsService.enableInputKeys(scene);
  }

  /**
   * Change the room
   */
  static changeRoom(scene, player0, doorP) {
    // if door closed, return!!
    if (doorP && doorP.alpha === 1) {
      return;
    }
    // destroy leaving room
    MapService.destroyRoom(scene);
    // create new room
    scene.map = scene.make.tilemap({ key: doorP.state.destination, tileWidth: 16, tileHeight: 16 });
    scene.tileset = scene.map.addTilesetImage(scene.map.tilesets[0].name, 'tiles', 16, 16);
    
    scene.player0Position = doorP.state.destination;
    if (!scene.player0.inventory.visitedRooms.includes(doorP.state.destination)) {
      scene.player0.inventory.visitedRooms.push(doorP.state.destination);
    }

    LayerService.addLayers(scene);
    DoorService.addDoors(scene);
    EnemyService.addEnemies(scene);
    SaveStationService.addSaveStation(scene);
    
    // Handle the new player0 position
    CameraService.stopFollowPlayer(scene);
    if (doorP.state.side === 'left') {
      scene.player0.body.reset(doorP.state.playerX * 16 + 8, doorP.state.playerY * 16 + player0.body.height - 2);
      scene.addBodies(doorP.state.playerX * 16 + 8, doorP.state.playerY * 16 + player0.body.height - 2)
    } else {
      scene.player0.body.reset(doorP.state.playerX * 16 + 8, doorP.state.playerY * 16 + player0.body.height - 2);
      scene.addBodies(doorP.state.playerX * 16 + 8, doorP.state.playerY * 16 + player0.body.height - 2)
    }

    ColliderService.addColliders(scene);
    PowerUpService.addPowerUp(scene);
    CameraService.handleCamera(scene);
    scene.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
    CameraService.setBounds(scene);
    CameraService.startFollowPlayer(scene);

    // last room
    if (doorP.state.destination === 'map13') {
      scene.setLastRoom();
    }
  }

  /**
   * Destroy all elements created in the previous room
   * @param scene 
   */
  static destroyRoom(scene) {
    scene.physics.world.colliders.destroy();
    if (scene.map) scene.map.destroy();

    if (scene.doorGroup) scene.doorGroup.forEach(e => e.destroy());
    scene.doorGroup = [];

    if (scene.giveLifeGroup) scene.giveLifeGroup.forEach(e => e.destroy());

    if (scene.powerUpGroup) scene.powerUpGroup.forEach(e => e.destroy());
    scene.powerUpGroup = [];

    if (scene.enemyGroup) scene.enemyGroup.forEach(e => e.destroy());
    scene.enemyGroup = [];

    if (scene.saveStationGroup) scene.saveStationGroup.forEach(e => e.destroy());
    scene.saveStationGroup = [];

    if (scene.paraBackGroup) scene.paraBackGroup.forEach(e => e.destroy());
    if (scene.paraMiddleGroup) scene.paraMiddleGroup.forEach(e => e.destroy());

    if (scene.weaponsGroup) scene.weaponsGroup.forEach(e => e.destroy());
  }
}