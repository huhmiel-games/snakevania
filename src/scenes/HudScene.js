import { Scene } from 'phaser';
import atomicsc from '../assets/fonts/atomicsc.png';
import atomicscXML from '../assets/fonts/atomicsc.xml';
import Constant from '../constant/gameConstant';


export default class HudScene extends Scene {
  // mainScene: any;
  // lifeText: any;
  // fullscreenBtn: any;
  // Health: any;
  // bullet: any;
  // missile: any;
  constructor() {
    super({
      key: Constant.SCENENAME.hud,
      active: true,
    });
  }

  init() {

  }

  preload() {
    this.load.bitmapFont('atomic', atomicsc, atomicscXML);
  }

  create() {
    this.mainScene = this.scene.get(Constant.SCENENAME.gameScene);
    this.cameras.main
      .setPosition(0, 0)
      .setSize(Constant.WIDTH, 24)
      .setAlpha(0)

    this.add.image(2, 2, 'contourUi').setOrigin(0, 0).setDisplaySize(80, 16)

    this.lifeText = this.add.bitmapText(4, 0, 'atomic', 'Health')
      .setFontSize(20)
      .setAlpha(0);
    
    this.Health = this.add.bitmapText(4, 4, 'atomic', '')
      .setFontSize(14)
      .setText('')
      .setAlpha(1);

    // loading
    this.mainScene.events.on('loadingDone', () => {
      this.lifeText.setAlpha(0);
      //this.fullscreenBtn.setAlpha(0);
      this.cameras.main.setAlpha(1);

      this.Health
        .setAlpha(1)
        .setText(`${this.mainScene.player0.inventory.life}/${this.mainScene.player0.inventory.lifeEnergyBlock * 100}`);

      if (this.mainScene.player0.inventory.gun) {
        this.bullet.setAlpha(1);
      }
      if (this.mainScene.player0.inventory.missile) {
        this.missile.setAlpha(1);
      }
      // if (this.mainScene.player.inventory.laser) {
      //   this.laser.setAlpha(1);
      // }
      // if (this.mainScene.player.inventory.swell) {
      //   this.swell.setAlpha(1);
      // }
      console.log(this)
    });

    this.mainScene.events.on('setHealth', (elm) => {
      this.Health.setText(`${elm.life}/${this.mainScene.player0.inventory.lifeEnergyBlock * 100}`);
      if (elm.life <= 30) {
        this.alertLife(true);
      } else {
        this.alertLife(false);
      }
    });

  }

  alertLife(lowLevelBool) {
    if (lowLevelBool) {
      this.Health.setTintFill(0xFF0000);
    }
    if (!lowLevelBool) {
      this.Health.clearTint();
    }
  }
}
