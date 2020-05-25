import Doors from '../environment/Doors';
import LayerService from './LayerService';

export default class DoorService {
  /**
   * Add the doors to the current room
   */
  static addDoors(scene) {
    const layerArray = LayerService.checkObjectsLayerIndex(scene, 'doors');
    if (!layerArray) return;

    layerArray.objects.forEach((element, i) => {
      // doors pointing to the right
      if (element.properties.side === 'right') {
        const door = new Doors(scene, element.x - 8, element.y - 24, { //element.x + 3, element.y + 9
          key: element.properties.key,
          name: element.name,
          side: element.properties.side,
          playerX: element.properties.playerX,
          playerY: element.properties.playerY,
          destination: element.properties.destination,
          openWith: element.properties.openWith,
        });
        scene.doorGroup.push(door);

        // check open status
        if (element.properties.open) {
          door.isOpen = true;
          door.alpha = 0;
          return;
        }
      }

      // doors pointing to the left
      if (element.properties.side === 'left') {
        const door = new Doors(scene, element.x - 8, element.y - 24, { //element.x + 13, element.y + 9
          key: element.properties.key,
          name: element.name,
          side: element.properties.side,
          playerX: element.properties.playerX,
          playerY: element.properties.playerY,
          destination: element.properties.destination,
          openWith: element.properties.openWith,
        });
        door.flipX = true;
        scene.doorGroup.push(door);

        // check open status
        if (element.properties.open) {
          door.isOpen = true;
          door.alpha = 0;
          return;
        }
      }
    });

    // Disable doors during development
    scene.doorGroup.forEach((e)=> {
      e.openDoor()
    });
  }
}