export default class Doors extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
    this.scene = scene;
    this.state = {
      key: config.key,
      side: config.side,
      destination: config.destination,
      playerX: config.playerX,
      playerY: config.playerY,
      openWith: config.openWith,
    };
    //this.setTexture('various')
    

    this.setDepth(107)
      .setOrigin(0, 0)
    
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.allowGravity = false;
    this.body
      .setSize(16, 16)
      .setVelocity(0, 0)
      .setImmovable(true);
    this.body.mass = 20;
    this.isOpen = false;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  animate(str) {
    this.anims.play(str, true).on('animationcomplete', () => {
      this.setAlpha(0);
    });
  }

  destroyDoor() {
    this.destroy(true);
  }

  openDoor(door, bullet) {
    if (this.isOpen) {
      //bullet.kill();
      return;
    }
    this.isOpen = true;
    //bullet.kill();
   // this.scene.sound.play('door', { rate: 2 });
    // this.anims.play(`open${this.state.key}`, true).on('animationcomplete', () => {
    //   this.setAlpha(0.1);
    //   if (this.state.side === 'left') {
    //     this.x = this.x + 32;
    //   } else if (this.state.side === 'right') {
    //     this.x = this.x - 32;
    //   }
    // });
  }

  setDoorPosition(x, y) {
    this.body.reset(x, y);
  }
}
