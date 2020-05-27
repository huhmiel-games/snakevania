import { Scene } from 'phaser';
import Constant from '../constant/gameConstant';

// Imports here all the needed assets
import snakeHead from '../assets/snake/head.png';
import snakeHeadAttack from '../assets/snake/headAttack.png';
import snakeBody from '../assets/snake/body.png';
import snakeTail from '../assets/snake/tail.png';
import egg from '../assets/egg.png';
import snakeShoot1 from '../assets/snake/snake_shoot_1.png';
import snakeShootSpritesheet from '../assets/snake/snake_shoot_spritesheet.png';
import saveStation from '../assets/savestation.png';
import spike from '../assets/spike.png';
import heart from '../assets/heart.png';

// Musics
import snakeJazz from '../assets/music/snake_jazz.ogg';



// Map
import tiles from '../assets/tileset/tileset.png';
import map0 from '../maps/map0.json';
import map1 from '../maps/map1.json';
import map2 from '../maps/map2.json';
import map3 from '../maps/map3.json';
import map4 from '../maps/map4.json';
import map5 from '../maps/map5.json';
import map6 from '../maps/map6.json';
import map7 from '../maps/map7.json';
import map8 from '../maps/map8.json';
import map9 from '../maps/map9.json';
import map10 from '../maps/map10.json';
import map11 from '../maps/map11.json';
import map12 from '../maps/map12.json';
import map13 from '../maps/map13.json';
import map14 from '../maps/map14.json';
import map15 from '../maps/map15.json';
import map16 from '../maps/map16.json';


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
    this.load.tilemapTiledJSON('map0', map0);
    this.load.tilemapTiledJSON('map1', map1);
    this.load.tilemapTiledJSON('map2', map2);
    this.load.tilemapTiledJSON('map3', map3);
    this.load.tilemapTiledJSON('map4', map4);
    this.load.tilemapTiledJSON('map5', map5);
    this.load.tilemapTiledJSON('map6', map6);
    this.load.tilemapTiledJSON('map7', map7);
    this.load.tilemapTiledJSON('map8', map8);
    this.load.tilemapTiledJSON('map9', map9);
    this.load.tilemapTiledJSON('map10', map10);
    this.load.tilemapTiledJSON('map11', map11);
    this.load.tilemapTiledJSON('map12', map12);
    this.load.tilemapTiledJSON('map13', map13);
    this.load.tilemapTiledJSON('map14', map14);
    this.load.tilemapTiledJSON('map15', map15);
    this.load.tilemapTiledJSON('map16', map16);

    // snake
    this.load.image('snakeHead', snakeHead);
    this.load.image('snakeHeadAttack', snakeHeadAttack);
    this.load.image('snakeBody', snakeBody);
    this.load.image('snakeTail', snakeTail);
    this.load.image('egg', egg);
    this.load.image('saveStation', saveStation);
    this.load.image('spike', spike);
    this.load.image('heart', heart);
    this.load.spritesheet('snakeShoot', snakeShootSpritesheet, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // music
    this.load.audio('snakeJazz', snakeJazz)

  }

  create() {
    // Create all anims here, ex:
    this.anims.create({
      key: 'spitVenom',
      frames: this.anims.generateFrameNumbers('snakeShoot', { start: 0, end: 2, first: 0 }),
      frameRate: 4,
      repeat: 0,
    });

    // music
    this.sound.add('snakeJazz', { volume: 1, loop: true });
    
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