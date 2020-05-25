import { Scene } from 'phaser';
import atomicsc from '../assets/fonts/atomicsc.png';
import atomicscXML from '../assets/fonts/atomicsc.xml';
import Constant from '../constant/gameConstant';


export default class HudScene extends Scene {
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
        .setText(`${this.mainScene.player0.inventory.life}/${this.mainScene.player0.inventory.eggs}`);
    });

    this.mainScene.events.on('setHealth', (elm) => {
      this.Health.setText(`${elm.life}/${this.mainScene.player0.inventory.eggs}`);
      if (elm.life <= 2) {
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
