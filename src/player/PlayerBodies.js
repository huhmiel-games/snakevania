export default class PlayerBodies extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
    this.scene = scene;
    this.target = config.target;
    this.setTexture(config.key)
      .setName(config.name)
      //.setScale(0.5)
      .setDisplaySize(15, 15);
    
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    // Define constants that affect motion
    this.SPEED = 140;
    this.TURN_RATE = 5; // turn rate in degrees/frame
    this.history = [];
    this.HISTORY_LENGTH = 5; //this.scene.player0.inventory.eggs;
    this.MIN_DISTANCE = 400;
    this.MAX_DISTANCE = this.MIN_DISTANCE * 2;
    this.targetMoving = false;
  }

  preUpdate(time) {
    super.preUpdate(time);
    if (!this.active) {
      return;
    }

    this.angle = 90;
    let t = {};
    this.targetMoving = false;

    if (this.target.history !== undefined && this.target.history.length) {
      // This target has a history so go towards that
      t = this.target.history[0];
      this.setTargetAngle();
      if (this.target.body.velocity.x !== 0 || this.target.body.velocity.y !== 0) {
        this.targetMoving = true;
      }
    } else {
      // This target doesn't have a history defined so just
      // follow its current x and y position
      t = { a: this.target.x, b: this.target.y };
      this.setTargetAngle();

      // Calculate distance to target
      // If the position is far enough way then consider it "moving"
      // so that we can get this Follower to move.
      const distance = Phaser.Math.Distance.Between(this.x, this.y, t.a, t.b);

      if (distance > this.MIN_DISTANCE && distance < this.MAX_DISTANCE) {
        this.targetMoving = true;
      }
    }

    // If the distance > MIN_DISTANCE then move
    if (this.targetMoving) {
      // if (distance < this.MIN_DISTANCE - 4) {
      //   this.targetMoving = false;
      //   this.body.setVelocityX(0);
      //   this.body.setVelocityY(0);
      //   return;
      // }
      // Add current position to the end of the history array
      const { x, y } = this;
      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        this.history.push({ a: x, b: y });
      }

      // If the length of the history array is over a certain size
      // then remove the oldest (first) element
      if (this.history.length > this.HISTORY_LENGTH) {
        this.history.shift();
      }

      // Calculate the angle to the target
      const rotation = Phaser.Math.Angle.Between(x, y, t.a, t.b);

      // Calculate velocity vector based on rotation and this.MAX_SPEED
      this.body.velocity.x = Math.cos(rotation) * this.SPEED;
      this.body.velocity.y = Math.sin(rotation) * this.SPEED;

      // Flip the sprite
      // if (this.scene.player0.direction === 'left') {
      //   this.setFlipY(true);
      // } else {
      //   this.setFlipY(false);
      // }
    } else {
      this.body.setVelocityX(0);
      this.body.setVelocityY(0);
    }
  }

  setTargetAngle() {
    const targetAngle = Phaser.Math.Angle.Between(
      this.x, this.y,
      this.target.x, this.target.y,
    );
    
    if (this.rotation !== targetAngle) {
      // Calculate difference between the current angle and targetAngle
      let delta = targetAngle - this.rotation;
      // Keep it in range from -180 to 180 to make the most efficient turns.
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;
      if (delta > 0) {
        // Turn clockwise
        this.angle += this.TURN_RATE;
        this.setFlipY(true)
      } else {
        // Turn counter-clockwise
        this.angle -= this.TURN_RATE;
        this.setFlipY(false)
      }
      // Just set angle to target angle if they are close
      if (Math.abs(delta) < this.TURN_RATE * (Math.PI)) {
        //console.log('here')
        this.rotation = targetAngle;
        if (this.rotation > Math.PI) this.setFlipY(false);
        if (this.rotation < -Math.PI) this.setFlipY(true);
      }
    }
  }




  looseLife(e, bullet) {
    bullet.destroy();
    this.scene.sound.play('hurtBoss', { volume: 0.5 });
    this.scene.boss0.state.life -= this.scene.player.bulletDamage;
    this.scene.playerGroup.forEach((elm, i) => {
      if (i < this.scene.playerGroup.length - 1) {
        elm.setTintFill(0xDDDDDD);
        this.scene.time.addEvent({
          delay: 100,
          callback: () => {
            elm.clearTint();
            if (this.scene && this.scene.boss0.state.life < 8000) {
              this.color = 0x9BFF42;
              elm.setTint(this.color);
              this.SPEED = 45;
            }
            if (this.scene && this.scene.boss0.state.life < 6000) {
              this.color = 0xFFF42D;
              elm.setTint(this.color);
              this.SPEED = 50;
            }
            if (this.scene && this.scene.boss0.state.life < 4000) {
              this.color = 0xFF9F2D;
              elm.setTint(this.color);
              this.SPEED = 55;
            }
            if (this.scene && this.scene.boss0.state.life < 2000) {
              this.color = 0xFF0000;
              elm.setTint(this.color);
              this.SPEED = 60;
            }
          },
        });
      }
    });
  }
}
