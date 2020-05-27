import { Scene } from 'phaser';
import Constant from '../constant/gameConstant';
import SaveLoadService from '../services/SaveLoadService';
import ControlsService from '../services/ControlsService';

export default class MainMenuScene extends Scene {
  constructor() {
    super({ key: Constant.SCENENAME.mainMenu });
  }

  create() {
    const totalTime = SaveLoadService.getSavedGameTimeToString();
    const savedGame = SaveLoadService.getSavedGameData();

    const keysOptions = ControlsService.getConfigKeys();

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes[keysOptions[2]],
      down: Phaser.Input.Keyboard.KeyCodes[keysOptions[3]],
      fire: Phaser.Input.Keyboard.KeyCodes[keysOptions[4]],
    });

    this.background = this.add.image(0, -200, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(Constant.WIDTH, Constant.HEIGHT * 2);

    // Determine lines positions
    this.position = [Constant.HEIGHT / 4, Constant.HEIGHT / 2, Constant.HEIGHT / 4 * 3];
    this.lastPosition = 0;

    if (savedGame) {
      // If a saved game exists, show the load + time, delete and options menu
      this.loadGameText = this.add.bitmapText(Constant.WIDTH / 10, this.position[0], 'atomic', ' LOAD GAME ', 16, 1)
        .setBlendMode(3).setLetterSpacing(4);

      const deleteSavedGameText = this.add.bitmapText(Constant.WIDTH / 10, this.position[2], 'atomic', ' DELETE GAME ', 16, 1)
        .setBlendMode(3).setLetterSpacing(4);
    } else {
      // if no saved game yet show the new game and options menu only
      this.position = [74, 114];
      const newGameText = this.add.bitmapText(Constant.WIDTH / 10, this.position[0], 'atomic', ' NEW GAME ', 18, 1)
        .setBlendMode(3).setLetterSpacing(4);
    }

    // the options menu
    const optionGameText = this.add.bitmapText(Constant.WIDTH / 10, this.position[1], 'atomic', ' OPTIONS ', 16, 1)
      .setBlendMode(3).setLetterSpacing(4)

    // The navigation helper
    this.head = this.add.image(Constant.WIDTH / 10, this.position[0] + 9, 'snakeHead')
      .setDisplaySize(16, 16).setBlendMode(1);


    // Handle player action
    this.input.keyboard.on('keydown', (event) => {
      if (this.keys.down.isDown && event.key === this.keys.down.originalEvent.key) {
        this.choose(1);
      } else if (this.keys.up.isDown && event.key === this.keys.up.originalEvent.key) {
        this.choose(-1);
      } else if (this.keys.fire.isDown && event.key === this.keys.fire.originalEvent.key) {
        this.launch();
      }
    });
  }

  choose(count) {
    if (this.lastPosition === this.position.length - 1 && count > 0) {
      this.lastPosition = 0;
    } else if (this.lastPosition === 0 && count < 0) {
      this.lastPosition = this.position.length - 1;
    } else {
      this.lastPosition += count;
    }
    this.head.y = this.position[this.lastPosition] + 9;
  }

  launch() {
    this.keys = null;
    const texts = this.children.list.filter(child => child instanceof Phaser.GameObjects.BitmapText);
    texts.push(this.head);
    this.startGameScene();
  }

  startGameScene() {
    if (this.lastPosition === 0 && this.loadGameText) {
      // saved game exists, start the next scene with loadSavedGame: true
      this.scene.start(Constant.SCENENAME.gameScene);
      this.scene.start(Constant.SCENENAME.hud);
    } else if (this.lastPosition === 0) {
      // saved game doesn't exists, start the next scene with default value
      this.scene.start(Constant.SCENENAME.gameScene);
      this.scene.start(Constant.SCENENAME.hud);
    }

    if (this.lastPosition === 1) {
      this.scene.start(Constant.SCENENAME.options);
    }

    if (this.lastPosition === 2) {
      SaveLoadService.deleteSavedGame();
      //TODO: need a workaround to not reload the entire game
      window.location.reload(false);
    }
  }
}
