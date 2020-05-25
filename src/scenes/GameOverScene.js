import { Scene } from 'phaser';
import Constant from '../constant/gameConstant';
import ControlsService from '../services/ControlsService';


export default class gameOverScene extends Scene {
  constructor() {
    super({
      key: Constant.SCENENAME.gameOver
    });
  }

  create() {
    this.position = [Constant.HEIGHT / 6 * 4, Constant.HEIGHT / 6 * 5];
    this.lastPosition = 0;

    this.scene.stop(Constant.SCENENAME.hud);

    this.background = this.add.image(0, -256, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(Constant.WIDTH, Constant.HEIGHT * 2);

    const gameOverText = this.add.bitmapText(Constant.WIDTH / 2, Constant.HEIGHT / 2, 'atomic', 'GAME OVER')
      .setFontSize(0)
      .setOrigin(0.5, 0.5)
      .setBlendMode(0)
      .setLetterSpacing(8)
    this.tweens.add({
      targets: gameOverText,
      duration: 1000,
      fontSize: 32
    });

    this.add.bitmapText(Constant.WIDTH / 10 * 4, this.position[0], Constant.FONTNAME, 'Try again')
      .setOrigin(0, 0)
      .setFontSize(16);

    this.add.bitmapText(Constant.WIDTH / 10 * 4, this.position[1], Constant.FONTNAME, 'Quit')
      .setOrigin(0, 0)
      .setFontSize(16);

    this.head = this.add.image(Constant.WIDTH / 10 * 3.6, this.position[0] + 9, 'snakeHead')
      .setOrigin(0.5, 0.5)
      .setDisplaySize(16, 16)
      .setBlendMode(1);

    const keysOptions = ControlsService.getConfigKeys();

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes[keysOptions[2]],
      down: Phaser.Input.Keyboard.KeyCodes[keysOptions[3]],
      fire: Phaser.Input.Keyboard.KeyCodes[keysOptions[4]],
    });

    this.input.keyboard.on('keydown', (event) => {
      if (this.keys.down.isDown && event.key === this.keys.down.originalEvent.key) {
        //this.sound.play('bip', { volume: 0.2 });
        this.choose(1);
      } else if (this.keys.up.isDown && event.key === this.keys.up.originalEvent.key) {
        //this.sound.play('bip', { volume: 0.2 });
        this.choose(-1);
      } else if (this.keys.fire.isDown && event.key === this.keys.fire.originalEvent.key) {
        //this.sound.play('bip2', { volume: 0.1 });
        this.launch();
      }
    });

    // fading the scene from black
    //this.cameras.main.fadeIn(1000);
    console.clear();
    console.log(this);
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
    if (this.lastPosition === 0) {
      this.input.keyboard.enabled = true;
      this.scene.start(Constant.SCENENAME.gameScene, { loadSavedGame: true });
      this.scene.start(Constant.SCENENAME.hud);
    }
    if (this.lastPosition === 1) {
      this.scene.start(Constant.SCENENAME.mainMenu);
    }
  }
}
