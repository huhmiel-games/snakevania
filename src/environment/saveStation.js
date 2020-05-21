export default class SaveStation extends Phaser.GameObjects.Sprite {
  // isOverlap: boolean;
  // body: any;
  // saveState: { destination: any; text: string; confirm: boolean; active: boolean; save: boolean; };
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.scene = scene;
    this.saveState = {
      destination: config.destination,
      text: 'press fire to save the game',
      confirm: false,
      active: false,
      save: false,
    };

    this.setAlpha(0)
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.allowGravity = false;
    this.isOverlap = false;
  }

  animate(str) {
    this.anims.play(str, true);
  }

  setIsOverlap() {
    this.isOverlap = true;
  }
}
