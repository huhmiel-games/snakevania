import LayerService from "./LayerService";
import PowerUp from "../player/PowerUp";

export default class PowerUpService {
  /**
   * Add power up to the room
   */
  static addPowerUp(scene) {
    const layerArray = LayerService.checkObjectsLayerIndex(scene, 'powerup');
    if (!layerArray || layerArray.objects.length === 0) {
      return;
    }
    layerArray.objects.forEach((element) => {
      console.log(layerArray)
      if (scene.player0.inventory.powerUp && scene.player0.inventory.powerUp[element.properties.id] === 0) {
        const powerUp = new PowerUp(scene, element.x, element.y - 16, {
          key: element.properties.key,
          name: element.properties.name,
          ability: element.properties.ability,
          text: element.properties.text,
          id: element.properties.id,
          powerup: element.properties.powerup,
        }); 
        powerUp.anims.play(element.properties.powerup, true);
        scene.powerUpGroup.push(powerUp);

        // add a light
        let lightColor = 0x04FCF3;
        switch (element.properties.powerup) {
          case 'powerupBlue': {
            lightColor = 0x00FFCF;
            break;
          }
          case 'powerupRed': {
            lightColor = 0xFD0202;
            break;
          }
          case 'powerupGreen': {
            lightColor = 0x00FD00;
            break;
          }
          case 'powerupYellow': {
            lightColor = 0xFDEF05;
            break;
          }
        }
        powerUp.light = scene.lights.addLight(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, 40, lightColor, 1);
        scene.lightsGroup.push(powerUp.light);
      }
    });
  }

  /**
   * Give player a new powerUp
   */
  static getPowerUp(scene, newPowerUp) {
    //this.state.displayPowerUpMsg = true;
    // Nex energy pack
    if (newPowerUp.powerUpState.ability === 'energy') {
      scene.player0.inventory.lifeEnergyBlock += 1;
      scene.player0.inventory.life = scene.player0.inventory.lifeEnergyBlock * 100;
      scene.events.emit('setHealth', { life: scene.player0.inventory.life });
      newPowerUp.light.intensity = 0;
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
      newPowerUp.light.intensity = 0;
      newPowerUp.destroy();
      return;
    }

    if (newPowerUp.powerUpState.powerup === 'powerupBlue') {
      scene.player0.inventory[newPowerUp.powerUpState.ability] = true;
      scene.player0.inventory.powerUp[newPowerUp.powerUpState.id] = 1;
      scene.events.emit('addAbility', { Weapon: newPowerUp.powerUpState.ability });
      // destroy the powerup
      newPowerUp.light.intensity = 0;
      newPowerUp.destroy();
      return;
    }
  }
}
