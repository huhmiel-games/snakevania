import Constant from '../constant/gameConstant';
import SaveLoadService from './SaveLoadService';
import LayerService from './LayerService';
import DoorService from './DoorService';
import ColliderService from './ColliderService';
import SaveStationService from './SaveStationService';
import CameraService from './CameraService';
//import EnemiesService from './EnemiesService';
//import PowerUpService from './PowerUpService';
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
      console.log('Loading saved game')
      const parsedData = JSON.parse(data);
      scene.player0.inventory = parsedData;
      scene.player0.x = scene.player0.inventory.savedPositionX;
      scene.player0.y = scene.player0.inventory.savedPositionY;
    } else {
      console.log('Saved data missing, create a new game!!', data);
      scene.player0.inventory.savedPositionX = 34 * 16;
      scene.player0.inventory.savedPositionY = 26 * 16;
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
    // LightService.addSceneLights(scene);
    scene.player0.x = scene.player0.inventory.savedPositionX + 24;
    scene.player0.y = scene.player0.inventory.savedPositionY;
    ColliderService.addColliders(scene);
    // PowerUpService.addPowerUp(scene);
    //EnemiesService.addEnemies(scene);
    
    
    
    

    // launch special functions from the room
    // if (scene.map.properties.callFunction && scene.map.properties.callFunction.length) {
    //   const arr = scene.map.properties.callFunction.split(',');
    //   arr.forEach(elm => scene[elm]());
    // }

    

    // CAMERA
    CameraService.handleCamera(scene);
    scene.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
    CameraService.setBounds(scene);
    CameraService.startFollowPlayer(scene);

    // scene.children.list.forEach(elm => {
    //   try {
    //     if (elm.type !== 'Graphics' && elm.type !== 'Text') {
    //       elm.setPipeline('Light2D');
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // });

    scene.time.addEvent({
      delay: 1000,
      callback: () => {
        scene.events.emit('loadingDone');
      },
    });
    ControlsService.enableInputKeys(scene);
    
    console.log(scene);
  }

  /**
   * Change the room
   */
  static changeRoom(scene, player0, doorP) {
    // console.log('CHANGE ROOM', doorP)
    // if door closed, return!!
    if (doorP && doorP.alpha === 1) {
      return;
    }
    console.clear();
    // Stop player0 velocity to avoid weird bugs
    scene.player0.body.setAcceleration(0);
    scene.player0.body.setVelocity(0);
    // destroy leaving room
    MapService.destroyRoom(scene);
    
    // TO DO --> refactor
    if (scene.para_water) {
      scene.para_water.destroy();
      //scene.cameras.remove(scene.waterCamera);
      scene.player0.onWaterCoef = 1;
    }
    if (scene.waterAmbientMusic && scene.waterAmbientMusic.isPlaying) {
      scene.waterAmbientMusic.stop();
    }
    if (scene.backheat) {
      scene.backheat.destroy();
    }

    //scene.debugGroup.forEach(e => e.destroy());

    // create new room
    console.log(doorP.state.destination)
    scene.map = scene.make.tilemap({ key: doorP.state.destination, tileWidth: 16, tileHeight: 16 });
    if (scene.map.properties.environment && scene.map.properties.environment === 'lava') {
      console.log(scene.tileset)
      scene.tileset = scene.map.addTilesetImage(scene.map.tilesets[0].name, 'tilesLava', 16, 16);
    } else {
      console.log(scene.tileset)
      scene.tileset = scene.map.addTilesetImage(scene.map.tilesets[0].name, 'tiles', 16, 16);
    }
    
    scene.player0Position = doorP.state.destination;
    if (!scene.player0.inventory.visitedRooms.includes(doorP.state.destination)) {
      scene.player0.inventory.visitedRooms.push(doorP.state.destination);
    }

    //ParralaxService.addBackgrounds(scene);
    LayerService.addLayers(scene);
    LightService.addSceneLights(scene);
    DoorService.addDoors(scene);
    EnemiesService.addEnemies(scene);
    SaveStationService.addSaveStation(scene);
    
    // Handle the new player0 position
    CameraService.stopFollowPlayer(scene);
    //scene.cameras.main.setScroll(doorP.state.player0X * 16, doorP.state.player0Y * 16);
    if (doorP.state.side === 'left') {
      scene.player0.body.reset(doorP.state.player0X * 16, doorP.state.player0Y * 16 + player0.body.height - 2);
    } else {
      scene.player0.body.reset(doorP.state.player0X * 16 + 16, doorP.state.player0Y * 16 + player0.body.height - 2);
    }
    // Add elevator after reset player0's position !!important!!
    ElevatorService.addElevators(scene);
    ColliderService.addColliders(scene);
    PowerUpService.addPowerUp(scene);
    // debug tilemap
    if (scene.debugGraphics) scene.debugGraphics.destroy();
    scene.debugGraphics = scene.add.graphics().setDepth(2000);
    scene.solLayer.renderDebug(scene.debugGraphics, {
      tileColor: null, // Non-colliding tiles
      collidingTileColor: null, // new Phaser.Display.Color(243, 134, 48, 50), // Colliding tiles
      faceColor: new Phaser.Display.Color(227, 6, 6, 255) // Colliding face edges
      }
    );

    // launch special functions from the room
    if (scene.map.properties.callFunction && scene.map.properties.callFunction.length) {
      const arr = scene.map.properties.callFunction.split(',');
      arr.forEach(elm => {
        // water room
        if (elm === 'addWater') {
          scene.underWater = true;
          WaterService.addWater(scene);
        } else {
          scene.underWater = false;
        }

        if (elm === 'heatEffect') {
          LavaService.makeLavaRoom(scene)
        } else {
          //scene.underWater = false;
          //scene[elm]()
        }
      });
    }

    CameraService.handleCamera(scene);
    scene.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
    CameraService.setBounds(scene);
    CameraService.startFollowPlayer(scene);
    
    
    // scene.debugLights();
    console.log(scene);
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