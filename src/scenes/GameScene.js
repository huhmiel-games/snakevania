import { Scene } from 'phaser';
import Constant from '../constant/gameConstant';
import Player from '../player/Player';
import PlayerBodies from '../player/PlayerBodies';

import ControlsService from '../services/ControlsService';
import MapService from '../services/MapService';
import SaveLoadService from '../services/SaveLoadService';
import LayerService from '../services/LayerService';
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
    this.player0 = new Player(this, 52, 156, { key: 'player' })
    this.player0.direction = 'right';
    this.playerGroup.push(this.player0);

    this.player0.venoms = this.physics.add.group({
      defaultKey: 'spitVenom',
      maxSize: 10,
      allowGravity: false,
      createIfNull: true,
    });

    // set the fps to 120 for good collisions at high speed
    //this.physics.world.setFPS(120);


    // Load the map
    MapService.loadGame(this);

    // add bodies to the player
    this.addBodies();

    // Add music
    this.mainMusic = this.sound.add('snakeJazz', { loop: true });
    this.mainMusic.play();
  }

  update(time, delta) {
    
  }

  /**
   * 
   */
  addBodies(x = this.player0.inventory.savedPositionX, y = this.player0.inventory.savedPositionY + 16) {
    // clean the bodies if needed
    if (this.playerGroup.length) {
      this.playerGroup.forEach((snakeBody, i) => {
        if (i > 0) {
          snakeBody.destroy();
        }
      });
      this.playerGroup = [this.player0];
    }
    // check the number of bodies
    const NUMBER_OF_FOLLOWERS = this.player0.inventory.eggs;
    // add the bodies
    for (let i = 1; i < NUMBER_OF_FOLLOWERS; i += 1) {
      this[`player${i}`] = new PlayerBodies(this, x - i, y, {
        key: 'snakeBody',
        position: i,
        follow: i - 1,
        life: 500 / i,
        name: `player${i}`,
        target: this[`player${i - 1}`],
      }).setDepth(50 + i);

      if (i === NUMBER_OF_FOLLOWERS - 1) {
        this[`player${i}`].setTexture('snakeTail');
      }
      this.playerGroup.push(this[`player${i}`]);
    }
  }

  setLastRoom() {
    // create female snake
    this.snakeFemale0 = new Player(this, 352, 228, { key: 'player' }).setDepth(250);
    this.snakeFemale0.direction = 'left';
    const NUMBER_OF_FOLLOWERS = this.player0.inventory.eggs;
    this.snakeFemaleGroup = [];
    this.snakeFemaleGroup.push(this.snakeFemale0);
    // add the bodies
    for (let i = 1; i < NUMBER_OF_FOLLOWERS; i += 1) {
      this[`snakeFemale${i}`] = new PlayerBodies(this, this.snakeFemale0.x + i, this.snakeFemale0.y, {
        key: 'snakeBody',
        position: i,
        follow: i - 1,
        life: 500 / i,
        name: `snakeFemale${i}`,
        target: this[`snakeFemale${i - 1}`],
      }).setDepth(250 + i);

      if (i === NUMBER_OF_FOLLOWERS - 1) {
        this[`snakeFemale${i}`].setTexture('snakeTail');
      }
      this.snakeFemaleGroup.push(this[`snakeFemale${i}`]);
    }
    // tint the female snake
    this.snakeFemaleGroup.forEach(e => e.setTint(0xe522d9));

    // create heart particles
    this.particles = this.add.particles('heart').setDepth(2000).setVisible(false);
    this.particlesEmitter = this.particles.createEmitter({
      alpha: { start: 1, end: 0 },
      scale: { start: 0.1, end: 1 },
      speed: 10,
      accelerationY: -300,
      angle: { min: -85, max: -95 },
      rotate: { min: -180, max: 180 },
      lifespan: { min: 500, max: 800 },
      frequency: 220,
      x: this.player0.x,
      y: this.player0.y
    });

    // add the colliders
    this.heartParticlesFollowPlayerFlag = false;
    this.physics.add.collider(this.snakeFemaleGroup, this.solLayer, null, null, this);
    this.physics.add.overlap(this.snakeFemaleGroup, this.playerGroup, (male, female) => {
      this.heartParticlesFollowPlayer();
    }, null, this);
    this.snakeFemale0.body.setVelocityX(-10);
  }

  heartParticlesFollowPlayer() {
    if (this.heartParticlesFollowPlayerFlag) {
      return;
    }
    this.heartParticlesFollowPlayerFlag = true;
    this.particlesEmitter.startFollow(this.player0, -this.player0.width / 2, -this.player0.height * 4);
    
    this.time.addEvent({
      delay: 5000,
      callback: () => this.endGame()
    });
    this.time.addEvent({
      delay: 800,
      callback: () => this.particles.setVisible(true)
    });
  }

  endGame() {
    const endText = this.add.bitmapText(Constant.WIDTH / 2, Constant.HEIGHT / 2, 'atomic', 'The end', 20, 1)
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setDepth(3000)
      .setTintFill(0xFFFFFF);

    const tween = this.tweens.add({
      targets: endText,
      ease: 'Sine.easeInOut',
      duration: 2000,
      delay: 1000,
      repeat: 5,
      yoyo: true,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      },
      onRepeat: (e) => {
        tween.countdown += 1;
        if (tween.countdown === 1) {
          endText.setText('Game Design: BlunT76')
        }
        if (tween.countdown === 2) {
          endText.setText(
`
Music & Sounds:
Sound A Head
`
          )
        }
        if (tween.countdown === 3) {
          endText.setText(
`
Graphics:
Sound A Head
BlunT76
`
          )
        }
        if (tween.countdown === 4) {
          endText.setText('Code: BlunT76')
        }
        if (tween.countdown === 5) {
          endText.setText(
`
Submitted on
Metroidvania Month 8
JAM !!!
`
          )
        }
      },
      onComplete: () => {
        endText.setText('Thanks for playing').setAlpha(1);
      },
    });

  }
}
