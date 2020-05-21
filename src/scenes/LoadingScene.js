import { Scene } from 'phaser';
import Constant from '../constant/gameConstant';

// Imports here all the needed assets
import snakeHead from '../assets/snake/head.png';
import snakeBody from '../assets/snake/body.png';
import snakeTail from '../assets/snake/tail.png';
import egg from '../assets/egg.png';




// Map
import tiles from '../assets/tileset/tileset.png';
import map1 from '../maps/map1.json';

export default class LoadingScene extends Scene {
  constructor() {
    super({
      key: Constant.SCENENAME.loading,
      //  Splash screen and progress bar textures.
      pack: {
        files: [{
          key: 'background',
          type: 'image'
        }, {
          key: 'progressBar',
          type: 'image'
        }]
      }
    });
  }

  preload() {
    //  Display cover and progress bar textures.
    this.showCover();
    this.showProgressBar();

    // Load all assets here, ex:
    // maps
    this.load.image('tiles', tiles);
    this.load.tilemapTiledJSON('map1', map1);

    // snake
    this.load.image('snakeHead', snakeHead);
    this.load.image('snakeBody', snakeBody);
    this.load.image('snakeTail', snakeTail);
    this.load.image('egg', egg);

  }

  create() {
    // Create all anims here, ex:

    
  }

  /**
   * Display cover
   */
  showCover() {
    // add the background
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      //.setDisplaySize(Constant.WIDTH, Constant.HEIGHT*2);

    // progress bar white background
    this.add.image(Constant.WIDTH / 2, Constant.HEIGHT / 4 * 3 + 18, 'progressBarBg')
      .setDisplaySize(242, 6)
      .setVisible(true);
  }

  /**
   * Display progress bar and percentage text
   */
  showProgressBar() {
    //  Get the progress bar filler texture dimensions.
    const { width: w, height: h } = this.textures.get('progressBar').get();

    //  Place the filler over the progress bar of the splash screen.
    const img = this.add.sprite(Constant.WIDTH / 2, Constant.HEIGHT / 4 * 3 + 16, 'progressBar').setOrigin(0.5, 0);

    // Add percentage text
    const loadingpercentage = this.add.bitmapText(
      Constant.WIDTH / 2,
      Constant.HEIGHT / 4 * 3 - 10,
      'atomic',
      'Loading:',
      Constant.FONTSIZE.small
    ).setOrigin(0.5, 0.5).setAlpha(1)
    
    // Add the title
    const title = this.add.bitmapText(Constant.WIDTH / 2, Constant.HEIGHT / 3 + 20, 'atomic', 'SnakeVania', 0)
      .setOrigin(0.5, 0.5)
      .setLetterSpacing(8)
      .setFontSize(30);

    //  Crop the filler along its width, proportional to the amount of files loaded.
    this.load.on('progress', (progress) => {
      loadingpercentage.text = `Loading: ${Math.round(progress * 100)}%`;
      img.setCrop(0, 0, Math.ceil(progress * w), h);
    }).on('complete', () => {
      this.startNextScene(title);
    });
  }


  /**
   * Show the start text with fade in/out tween.\
   * Handle inputs keys.\
   * Launch the next scene.
   * @param {*} title 
   */
  startNextScene(title) {
    const startText = this.add.bitmapText(
      Constant.WIDTH / 2,
      Constant.HEIGHT - Constant.HEIGHT / 12,
      Constant.FONTNAME,
      'Press any key to start',
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
      delay: 0,
      repeat: -1,
      yoyo: true,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      }
    });

    this.input.keyboard.once('keydown', () => {
      tweenStartText.stop();
      startText.setAlpha(0);
      this.scene.start(Constant.SCENENAME.intro);
    });
  }
}