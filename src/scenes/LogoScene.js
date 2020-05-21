import { Scene } from 'phaser';
import Constant from '../constant/gameConstant';

import atomicsc from '../assets/fonts/atomicsc.png';
import atomicscXML from '../assets/fonts/atomicsc.xml';

import progressBar from '../assets/progress-bar.png';
import progressBarBg from '../assets/progress-bar-bg.png';
import whitePixel from '../assets/whitePixel.png';
import background from '../assets/background.png';

export default class CompanyLogoScene extends Scene {
  constructor() {
    super({
      key: Constant.SCENENAME.logo
    });
  }

  init() {
    document.onfullscreenchange = () => {
      if (document.fullscreenElement === null) {
        this.scale.stopFullscreen();
      }
    };
  }

  preload() {
    this.load.bitmapFont('atomic', atomicsc, atomicscXML);
    this.load.image('progressBar', progressBar);
    this.load.image('progressBarBg', progressBarBg);
    this.load.image('whitePixel', whitePixel);
    this.load.image('background', background);
  }

  create() {
  

    const huhmielText = this.add.bitmapText(
      Constant.WIDTH / 2,
      Constant.HEIGHT / 2,
      'atomic',
      'huhmiel games',
      30,
      1
    )
      .setOrigin(0.5, 0.5)
      .setAlpha(0);

    const tweenHuhmielText = this.tweens.add({
      targets: huhmielText,
      ease: 'Sine.easeInOut',
      duration: 2000,
      delay: 1000,
      repeat: 0,
      yoyo: true,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      },
      onComplete: () => {
        this.scene.start(Constant.SCENENAME.loading);
      },
    });

    this.input.keyboard.once('keydown', () => {
      tweenHuhmielText.stop();
      this.scene.start(Constant.SCENENAME.loading);
    });
  }
}
