export default class PowerUp extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
    this.scene = scene;
    this
    
    this.powerUpState = {
      name: config.name,
      ability: config.ability,
      text: config.text,
      id: config.id,
      powerup: config.powerup,
    };
    this.setTexture('various')
      .setFrame('bluePowerUp_0')
      .setDepth(105)
      .setScale(1)
      .setPipeline('DarkerFx')
      .setOrigin(0, 0);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
  }
}
