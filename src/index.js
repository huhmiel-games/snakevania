import Phaser from "phaser";
import Constant from './constant/gameConstant';
import LogoScene from './scenes/LogoScene';
import LoadingScene from './scenes/LoadingScene';
import IntroScene from './scenes/IntroScene';
import MainMenuScene from './scenes/MainMenuScene';
import HudScene from './scenes/HudScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';
// import GameEndScene from './scenes/GameEndScene';

const config = {
  type: Phaser.AUTO,
  parent: "gamecanvas",
  width: Constant.WIDTH,
  height: Constant.HEIGHT,
  scale: {
    parent: 'gamecanvas',
    mode: Phaser.Scale.ScaleModes.FIT,
    autoRound: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: Constant.GRAVITY },
      debug: false,
      debugShowBody: true,
      debugShowStaticBody: true,
    },
  },
  scene: [LogoScene, LoadingScene, IntroScene, MainMenuScene, GameScene, HudScene, GameOverScene]//, GameOverScene, GameEndScene],
};

const game = new Phaser.Game(config);

function preload() {

}

function create() {
  
}
