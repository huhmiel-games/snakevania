export default class MovingSpike extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
    this.scene = scene;
    this.name = config.name;
    this.duration = config.duration;
    this.directionType = config.directionType;
    this.state = {
      damage: 20,
    }
    this.setDepth(101);

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false).setImmovable(true);

    this.durationTimer = 4000;
    this.fallTimer = null;
    this.riseTimer = null;
    this.tween = this.scene.tweens.addCounter({
      from: -75,
      to: 75,
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true
  });

  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.body.velocity.y = this.tween.getValue()
    // if (this.body.onFloor()) {
    //   const distance = Phaser.Math.Distance.Between(this.scene.player.x, this.scene.player.y, this.x, this.y);
    //   if (distance < 350) {
    //     this.scene.shakeCamera(200);
    //     this.playSpikeSound();
    //   }
    // }
  }

  

  fall() {
    if (!this.active) {
      return;
    }
    this.fallTimer = this.scene.time.addEvent({
      delay: this.duration,
      callback: () => {
        if (!this.active) {
          return;
        }
        this.body.setVelocityY(600);
        this.rise();
      }
    });
  }

  rise() {
    if (!this.active) {
      return;
    }
    this.riseTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (!this.active) {
          return;
        }
        this.body.setVelocityY(-100);
        this.fall();
      }
    });
  }

  checkCollision(d) {
    if (d.type === 'Sprite') {
      if (this.state.directionX > 0) {
        this.state.directionX = -30;
      } else {
        this.state.directionX = 30;
      }
    }
  }

  explode(bullet) {
    
  }
}
