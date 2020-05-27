import LayerService from "./LayerService";
import MovingSpike from "../enemies/MovingSpike";


export default class EnemiesService {
  static addEnemies(scene) {
    // enemy
    const layerArray = LayerService.checkObjectsLayerIndex(scene, 'enemies');
    if (!layerArray || !layerArray.objects.length) {
      return;
    }

    layerArray.objects.forEach((element, i) => {
      const x = element.x;
      const y = element.y;
      switch(element.properties.key) {
        case 'spike': {
          const spike = new MovingSpike(scene, x + 16, y, {
            key: element.properties.key,
            name: element.name + i,
            life: element.properties.life,
            damage: element.properties.damage,
            speed: element.properties.speed,
          });
          scene.enemyGroup.push(spike);
          break;
        }
      }
    });
  }
}