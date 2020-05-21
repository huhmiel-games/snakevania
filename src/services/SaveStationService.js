import LayerService from "./LayerService";
import SaveStation from "../environment/saveStation";
import SaveLoadService from "./SaveLoadService";

export default class SaveStationService {
  /**
   * Add the save station
   */
  static addSaveStation(scene) {
    const layerArray = LayerService.checkObjectsLayerIndex(scene, 'savestation');
    if (!layerArray || layerArray.objects.length === 0) {
      return;
    }

    layerArray.objects.forEach((element) => {
      scene[element.name] = new SaveStation(scene, element.x + 32, element.y + 12, {
        key: element.properties.key,
        destination: element.properties.destination,
      });
      scene.saveStationGroup.push(scene[element.name]);

      // Add the savestation collider
      scene.physics.add.overlap(scene.player0, scene[element.name], (player, savestation) => {
        SaveLoadService.saveGame(scene, player, savestation);
      }, null, scene.player0);
    });
  }
}