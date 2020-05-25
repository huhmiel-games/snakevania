import ControlsService from "../services/ControlsService";
import StateMachine from '../utils/stateMachine';
import IdleState from './states/idleState';
import MoveState from './states/moveState';
import JumpState from './states/jumpState';
import FallState from './states/fallState';
import UpState from './states/upState';
import HitState from './states/hitState';
import AttackState from './states/attackState';

import CameraService from "../services/CameraService";
import Constant from '../constant/gameConstant';
import { ACCELERATION_X_RUN, DRAG_FORCE, VENOM_FIRERATE, VENOM_VELOCITY } from '../constant/playerConstant';

// import Bullets from "./weapons/Bullets";
// import WeaponService from "../services/WeaponService";



export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
    this.scene = scene;
    this.keys = scene.keys;
    this.setDepth(105)
      .setName('Player')
      .setTexture('snakeHead')
      //.setScale(0.5)
      .setDisplaySize(16, 16);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setCollideWorldBounds(true)
      .setDragX(0)
      .setGravityY(0);
    this.body.maxVelocity.x = 100;
    this.body.maxVelocity.y = 100;

    this.inventory = {
      lifeEnergyBlock: 1,
      eggs: 3,
      eatedEggs: [],
      life: 3,
      savedPositionX: 52,
      savedPositionY: 186,
      map: 'map1',
      selectableMelody: [],
      selectedMelody: 0,
      venom: true,
      flute: false,
      powerUp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      visitedRooms: ['map1'],
    };

    // Some flags about player state
    this.playerState = {
      isTouchingClosedDoor: false,
      selectedWeapon: 0,
      lastFired: 0,
      isHit: false,
      isHitMomentum: false,
      isDead: false,
      attackRate: 2000,
      lastAttack: 0,
    };

    // The state machine managing the player
    this.stateMachine = new StateMachine('idle', {
      up: new UpState(),
      idle: new IdleState(),
      move: new MoveState(),
      jump: new JumpState(),
      fall: new FallState(),
      hit: new HitState(),
      attack: new AttackState(),
    }, [this.scene, this]);

    this.direction = 'right';
    this.lastDirection = 'right';
    this.weaponToggleTimer = 0;

    this.history = [{ a: x, b: y }];
    this.HISTORY_LENGTH = 5;

    // for future player sounds
    // this.on('animationupdate', (currentAnim) => {
    //   // if (currentAnim.key === 'player-startJump') {
    //   //   console.log(currentAnim)
    //   //   this.anims.play('player-jump', true);
    //   // }
    // });
    console.log(this)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.stateMachine.step();
    const absSpeedX = Math.abs(this.body.velocity.x);
    const { left, right, up, down, fire, jump, run, select, pause } = this.scene.keys;

    // Handle the camera X axis panning other the player
    if (this.direction !== this.lastDirection
      && Math.abs(this.body.velocity.x) > 95
    ) {
      this.lastDirection = this.direction;
      CameraService.handleOffSetX(this.scene, this.direction);
    }

    // Handle snake head angle when jumping
    if (!this.body.blocked.down && (this.body.velocity.x !== 0 || this.body.velocity.y !== 0)) {
      this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      this.flipX = false;
      if (this.direction === 'right' && this.rotation !== -Math.PI) {
        this.flipY = false;
      } 
      if (this.direction === 'left' && this.rotation !== 0) {
        this.flipY = true;
      }
    }
    // Handle snake head when touching ground
    if (this.body.blocked.down) {
      this.rotation = 0;
      this.flipY = false;
      if (this.direction === 'right') {
        this.flipX = false;
      } else {
        this.flipX = true;
      }
    }

    // Positions history for the bodies
    if (Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0) {
      const { x, y } = this;
      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        this.history.push({ a: x, b: y });
      }

      // If the length of the history array is over a certain size
      // then remove the oldest (first) element
      if (this.history.length > this.HISTORY_LENGTH) {
        this.history.shift();
      }
    }

    // Handle venom lifespan
    if (this.venoms.children.entries.length) {
      const venomArrayLength = this.venoms.children.entries.length;
      const { now } = this.scene.time;
      for (let i = 0; i < venomArrayLength; i += 1) {
        const venom = this.venoms.children.entries[i];
        console.log(venom)
        if (venom.time + venom.lifespan < now) {
          venom.destroy();
        }
      }
    }
  }

  /**
   * Move and stop with acceleration
   */
  move(inJump = false) {
    const { left, right } = this.keys;
    // Move with acceleration to the right
    if (right.isDown && !left.isDown) {
      this.body.setDragX(0);
      this.body.setAccelerationX(ACCELERATION_X_RUN);
      this.direction = 'right';
    }

    // Move with acceleration to the left
    if (left.isDown && !right.isDown) {
      this.body.setDragX(0);
      this.body.setAccelerationX(-ACCELERATION_X_RUN);
      this.direction = 'left';
    }

    // Decelerate with Drag
    if (!(left.isDown || right.isDown)) {
      this.body.setAccelerationX(0);
      this.body.setDragX(DRAG_FORCE);
    }
  }

  /**
   * Player is hit, stop the inputs and lower helth
   */
  playerIsHit() {
    // if already hit leave
    if (this.playerState.isHit || this.playerState.isHitMomentum) {
      return;
    }

    // declare player is hit
    this.playerState.isHit = true;
    // make player invulnerable
    this.playerState.isHitMomentum = true;
    // calculate new health
    const newLife = this.inventory.life - 1;
    // flash the player sprite to red
    const timer = this.scene.time.addEvent({
      delay: 250,
      repeat: 6,
      callback: () => {
        const repeat = timer.getRepeatCount();
        this.scene.playerGroup.forEach(elm => {
          if (!elm.isTinted && repeat) {
            elm.setTint(0xFF0000);
          } else {
            elm.clearTint();
          }
        });
        if (repeat === 0) {
          this.playerState.isHitMomentum = false;
        }
      }
    });
    // check if dead
    if (newLife <= 0) {
      this.playerState.isDead = true;
      this.scene.events.emit('setHealth', { life: 0 });
      this.playerIsDead();
      return;
    } else {
      // lowers player's health
      this.inventory.life = newLife;
      this.scene.events.emit('setHealth', { life: Math.round(this.inventory.life) });
    }
  }

  /**
   * Player is dead, launch dead scene
   */
  playerIsDead() {
    ControlsService.disableInputKeys(this.scene);
    // const blackScreen = this.scene.add.image(0, 0, 'blackPixel')
    //   .setOrigin(0, 0)
    //   .setDisplaySize(this.scene.map.widthInPixels, this.scene.map.heightInPixels)
    //   .setAlpha(0)
    //   .setDepth(2000);
    
    this.scene.playerGroup.forEach(e=> e.body.checkCollision.none = true);
    this.scene.physics.world.setBounds(0, 0, this.scene.map.widthInPixels * 2, this.scene.map.heightInPixels * 2);

    // this.scene.tweens.add({
    //   targets: blackScreen,
    //   duration: 3000,
    //   alpha: 1
    // });
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        this.scene.mainMusic.stop();
        this.scene.scene.start(Constant.SCENENAME.gameOver);
      }
    });
  }

  /**
   * Get loot
   * @param loot
   */
  getLoot(loot) {
    // Health loot
    if (loot.lootType === 'health') {
      if (this.inventory.life + loot.health < this.inventory.lifeEnergyBlock * 100) {
        this.inventory.life += loot.health;
      } else {
        this.inventory.life = this.inventory.lifeEnergyBlock * 100;
      }
      //this.scene.sound.play('getLife', { volume: 0.05 });
      loot.destroy();
      this.scene.events.emit('setHealth', { life: this.inventory.life });
    }
  }

  /**
   * Spit venom
   */
  fire() {
    if (!this.inventory.venom) {
      return;
    }
    const timeNow = this.scene.time.now;
    if (timeNow > this.playerState.lastFired) {
      const venom = this.venoms.getFirstDead(true, this.body.x, this.body.y + 8, 'snakeShoot', null, true);
      if (venom) {
        this.playerState.lastFired = timeNow + VENOM_FIRERATE;
        venom.visible = true;
        venom.lifespan = 300;
        venom.time = timeNow;
        venom.anims.play('spitVenom', true);
        venom.setDepth(99);
        // venom sound
        //this.scene.sound.play('venom', { volume: 0.08 });
        if (this.direction === 'left') {
          venom.setFlipX(true);
          venom.body.velocity.x = -VENOM_VELOCITY;
          return;
        }
        if (this.direction === 'right') {
          venom.setFlipX(false);
          venom.body.velocity.x = VENOM_VELOCITY;
        }
      }
    }
  }

  isBodiesOnGround() {
    const bool = this.scene.playerGroup.some(elm => elm && elm.body.blocked.down);
    console.log(bool)
    return bool;
  }

  
}
