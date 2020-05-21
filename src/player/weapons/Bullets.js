import { BULLET_VELOCITY, BULLET_HITPOINT } from '../../constant/playerConstant';
import Player from '../Player';
import ExplosionService from '../../services/ExplosionService';

export default class Bullets extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setTexture('weapons')
      .setFrame('shot-1')
      .setDepth(106)
    this.body
      .setCollideWorldBounds(true)
      .setGravityY(0)
      .setSize(6, 4)
      .setOffset(0, 0);
    this.lifespan = 2000;
    this.hitpoint = BULLET_HITPOINT;
    this.anims.play('bullet', true);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.lifespan -= delta;
    if (this.lifespan <= 0) {
      this.kill(this);
    }
    
  }

  /**
   * Fire a bullet to the right direction
   */
  fireRight(player) {
    this.body.reset(positionX, positionY);
    this.body.setVelocityX(BULLET_VELOCITY + player.body.velocity.x);
    this.anims.play('bullet', true);
  }

  /**
   * Fire a bullet to the left direction
   */
  fireLeft(player) {
    const { positionX, positionY } = player.getGunPosition();
    this.body.reset(positionX, positionY);
    this.body.setVelocityX(-BULLET_VELOCITY + player.body.velocity.x);
    this.anims.play('bullet', true);
  }

  /**
   * Fire a bullet to the up direction
   */
  fireUp(player) {
    const { positionX, positionY } = player.getGunPosition();
    this.setAngle(90);
    this.body.setSize(4, 6)
      .setOffset(1, -1)
      .reset(positionX, positionY - 4);
    this.body.setVelocityY(-BULLET_VELOCITY);
    this.anims.play('bullet', true);
  }

  kill(bullet) {
    ExplosionService.showImpact(this.scene, this.impact, this.body.x, this.body.y, this.flipX, this.angle);
    if (this.active) {
      this.destroy();
    }
  }
}