export default class PowerUp extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
    this.scene = scene;
    this.powerUpState = {
      name: config.name,
      ability: config.ability,
      id: config.id,
      powerup: config.powerup,
    };
    this.setTexture(config.key)
      .setDepth(105)
      //.setScale(1)
      .setOrigin(0, 0);
    if (config.key === 'egg') {
      this.setDisplaySize(8, 11);
    }
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
  }
}
