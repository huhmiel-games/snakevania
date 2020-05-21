import { Scene } from 'phaser';
import Constant from '../constant/gameConstant';


export default class IntroScene extends Scene {
  constructor() {
    super({
      key: Constant.SCENENAME.intro
    });
  }

  create() {
    this.add.image(0, -256, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(Constant.WIDTH, Constant.HEIGHT * 2);

      Constant.INTROTEXT

    // Add the title
    const title = this.add.bitmapText(Constant.WIDTH / 2, Constant.HEIGHT / 3 + 20, 'atomic', Constant.INTROTEXT, 0)
      .setOrigin(0.5, 0.5)
      .setLetterSpacing(8)
      .setFontSize(15);

    const startText = this.add.bitmapText(
      Constant.WIDTH / 2,
      Constant.HEIGHT / 10 * 9,
      Constant.FONTNAME,
      'Press any key to skip intro',
      Constant.FONTSIZE.small,
      1
    )
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setDepth(1);

    const tweenStartText = this.tweens.add({
      targets: startText,
      ease: 'Sine.easeInOut',
      duration: 1600,
      delay: 2000,
      repeat: -1,
      yoyo: true,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      }
    });

    // fade the texts
    this.tweens.add({
      targets: [startText, title],
      duration: 4000,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      }
    });

    // start the next scene
    this.input.keyboard.once('keydown', () => {
      this.scene.start(Constant.SCENENAME.mainMenu);
    });
  }
}
