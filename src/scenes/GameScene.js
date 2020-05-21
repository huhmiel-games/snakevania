import { Scene } from 'phaser';
import Constant from '../constant/gameConstant';
import Player from '../player/Player';
import PlayerBodies from '../player/PlayerBodies';

import ControlsService from '../services/ControlsService';
import MapService from '../services/MapService';
import SaveLoadService from '../services/SaveLoadService';
// import ExplosionService from '../services/ExplosionService';

export default class GameScene extends Scene {
  constructor() {
    super({
      key: Constant.SCENENAME.gameScene,
    });
    this.giveLifeGroup = [],
    this.enemyGroup = [];
    this.doorGroup = [];
    this.saveStationGroup = [];
    this.powerUpGroup = [];
  }

  init() { }

  preload() { }

  create() {
    console.clear();
    console.log(this)

    // Get Controls keys
    const keysOptions = ControlsService.getConfigKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes[keysOptions[0]],
      right: Phaser.Input.Keyboard.KeyCodes[keysOptions[1]],
      up: Phaser.Input.Keyboard.KeyCodes[keysOptions[2]],
      down: Phaser.Input.Keyboard.KeyCodes[keysOptions[3]],
      fire: Phaser.Input.Keyboard.KeyCodes[keysOptions[4]],
      jump: Phaser.Input.Keyboard.KeyCodes[keysOptions[5]],
      run: Phaser.Input.Keyboard.KeyCodes[keysOptions[6]],
      select: Phaser.Input.Keyboard.KeyCodes[keysOptions[7]],
      pause: Phaser.Input.Keyboard.KeyCodes[keysOptions[8]],
    });


    // the main player
    this.playerGroup = []
    this.player0 = new Player(this, 200, 150, { key: 'player' })
    this.player0.direction = 'right';
    this.playerGroup.push(this.player0);


    // Load the map
    MapService.loadGame(this);

    // add bodies to the player
    this.addBodies();

    // DEV: DEBUG / HELPERS
    this.debugGraphics = this.add.graphics().setDepth(2000).setPipeline('GlowFixedFx');
    this.text1 = this.add.text(10, 226, '', { fill: '#00ff00', fontSize: 10 }).setDepth(5000).setPipeline('GlowFixedFx');

    // DEV: FAKE SAVE WHILE IN DEV
    this.input.on('pointerdown', ()=> {
      this.player0.inventory.savedPositionX = this.player0.x;
      this.player0.inventory.savedPositionY = this.player0.y;
      this.player0.inventory.map = this.player0Position;
      const s = JSON.stringify(this.player0.inventory);
      localStorage.setItem(`${Constant.GAMENAME}_data`, s);
      console.log('GAME SAVED')
      this.cameras.main.shake(500);
    });
  }

  update(time, delta) {
    // DEV: debug position with pointer
    const pointer = this.input.activePointer;
    this.text1.setText([
      `x:${Math.round(pointer.worldX)}`,
      `y:${Math.round(pointer.worldY)}`,
      `velX:${this.player0.body.velocity.x}`,
      `pos:${Math.round(this.player0.x)},${Math.round(this.player0.y)}`,
    ]);
    this.text1.setPosition(this.cameras.main.scrollX + 300, this.cameras.main.scrollY);
    //////////////////////////////
  }

  /**
   * 
   */
  addBodies() {
    const NUMBER_OF_FOLLOWERS = this.player0.inventory.eggs;
    console.log('FOLLOWERS: ', this.player0.inventory.eggs)
    for (let i = 1; i < NUMBER_OF_FOLLOWERS; i += 1) {
      this[`player${i}`] = new PlayerBodies(this, this.player0.inventory.savedPositionX - i, this.player0.inventory.savedPositionY, {
        key: 'snakeBody',
        position: i,
        follow: i - 1,
        life: 500 / i,
        name: `player${i}`,
        target: this[`player${i - 1}`],
      }).setDepth(i);
      // this[`player${i}`].displayWidth = this[`player${i}`].displayWidth - i;
      // this[`player${i}`].displayHeight = this[`player${i}`].displayHeight - i;

      if (i === NUMBER_OF_FOLLOWERS - 1) {
        this[`player${i}`].setTexture('snakeTail');
      }
      this.playerGroup.push(this[`player${i}`]);
    }
  }
}
