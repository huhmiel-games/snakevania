import LayerService from "./LayerService";
import PowerUp from "../player/PowerUp";

export default class PowerUpService {
  /**
   * Add power up to the room
   */
  static addPowerUp(scene) {
    const layerArray = LayerService.checkObjectsLayerIndex(scene, 'eggs');
    if (!layerArray || layerArray.objects.length === 0) {
      return;
    }
    layerArray.objects.forEach((element) => {
      console.log(layerArray)
      if (scene.player0.inventory.powerUp && scene.player0.inventory.powerUp[element.properties.id] === 0) {
        const powerUp = new PowerUp(scene, element.x + 4, element.y - 12, {
          key: element.properties.key,
          name: element.properties.name,
          id: element.properties.id,
          ability: element.properties.ability,
        }); 
        scene.powerUpGroup.push(powerUp);
      }
    });
  }

  /**
   * Give player a new powerUp
   */
  static getPowerUp(scene, newPowerUp) {
    // New body and new life
    if (newPowerUp.powerUpState.ability === 'egg') {
      scene.player0.inventory.lifeEnergyBlock += 1;
      scene.player0.inventory.eggs += 1;
      scene.player0.inventory.life = scene.player0.inventory.lifeEnergyBlock * 100;
      scene.events.emit('setHealth', { life: scene.player0.inventory.life });
      scene.playerGroup.forEach((snakeBody,i) => {
        if (i > 0) {
          snakeBody.destroy();
        }
      });
      console.log(scene.player0.x, scene.player0.y)
      scene.addBodies(scene.player0.x, scene.player0.y);
      newPowerUp.destroy();
      return;
    }

    // New weapon
    if (newPowerUp.powerUpState.powerup === 'powerupRed') {
      // add powerUp ability to selectables weapons except moringBomb
      if (newPowerUp.powerUpState.ability !== 'morphingBomb') {
        scene.player0.inventory.selectableWeapon.push(newPowerUp.powerUpState.ability);
      }
      scene.player0.inventory[newPowerUp.powerUpState.ability] = true;
      scene.player0.inventory.powerUp[newPowerUp.powerUpState.id] = 1;
      scene.events.emit('addWeapon', { Weapon: newPowerUp.powerUpState.ability });
      newPowerUp.destroy();
      return;
    }

    if (newPowerUp.powerUpState.powerup === 'powerupBlue') {
      scene.player0.inventory[newPowerUp.powerUpState.ability] = true;
      scene.player0.inventory.powerUp[newPowerUp.powerUpState.id] = 1;
      scene.events.emit('addAbility', { Weapon: newPowerUp.powerUpState.ability });
      // destroy the powerup
      newPowerUp.destroy();
      return;
    }
  }
}
