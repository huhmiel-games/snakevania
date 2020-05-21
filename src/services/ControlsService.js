import Config from '../constant/gameConstant';

/**
 * Handle controls configuration
 * @static setDefaultConfigKeys(): void
 * @static setCustomConfigKeys(arrKeys: string[]): void
 * @static getConfigKeys(): object
 * @static deleteConfigKeys(): void
 */
export default class ControlsService {

  /**
   * Store default config keys to localStorage
   * 
   * Default keys are: LEFT', 'RIGHT', 'UP', 'DOWN', 'X', 'W', 'C', 'S', 'P'
   */
  static setDefaultConfigKeys() {
    if (!localStorage.getItem(`${Config.GAMENAME}OptionsKeys`)) {
      const keys = ['LEFT', 'RIGHT', 'UP', 'DOWN', 'X', 'W', 'C', 'S', 'P'];
      const keysToString = JSON.stringify(keys);
      localStorage.setItem(`${Config.GAMENAME}OptionsKeys`, keysToString);
    }
  }

  /**
   * Store custom config keys to localStorage
   */
  static setCustomConfigKeys(arrKeys) {
      const keysToString = JSON.stringify(arrKeys);
      localStorage.setItem(`${Config.GAMENAME}OptionsKeys`, keysToString);
  }

  /**
   * Get config keys from localStorage.
   * If not present, return the default config keys
   */
  static getConfigKeys() {
    let configKeys = {};
    const storedKeys = localStorage.getItem(`${Config.GAMENAME}OptionsKeys`);
    if (storedKeys !== null) {
      configKeys = JSON.parse(storedKeys);
    } else {
      this.setDefaultConfigKeys();
      this.getConfigKeys();
      const storedKeys = localStorage.getItem(`${Config.GAMENAME}OptionsKeys`);
      if (storedKeys !== null) {
        configKeys = JSON.parse(storedKeys);
      }
    }
    return configKeys;
  };

  /**
   * Delete config keys from localstorage
   */
  static deleteConfigKeys() {
    localStorage.removeItem(`${Config.GAMENAME}OptionsKeys`);
  }

  /**
   * Disable the player inputs keys
   * @param scene 
   */
  static disableInputKeys(scene) {
    scene.input.keyboard.enabled = false;
    console.log('KEYS DISABLED')
  }

  /**
   * Enable the player inputs keys
   * @param scene 
   */
  static enableInputKeys(scene) {
    const inputKeysArray =  Object.values(scene.keys);
    inputKeysArray.forEach((key) => {
      if (key.keyCode !== scene.keys.run.keyCode) {
        key.reset();
      }
    });
    scene.input.keyboard.enabled = true;
    console.log('KEYS ENABLED')
  }
}