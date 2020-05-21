// import Constant from '../constant/gameConstant';
// import SaveLoadService from './SaveLoadService';
// import Doors from '../environment/Doors';
// import LayerService from './LayerService';
import Player from '../player/Player';

export default class CameraService {
  /**
   * Handle the camera
   */
  static handleCamera(scene) {
    scene.cameras.main
      .fadeIn(300)
      .setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels)
      .setPipeline('motionBlurFx')
      .setRoundPixels(true);
  }

  /**
   * Set the bounds of each Cameras to the size of the map
   */
  static setBounds(scene) {
    scene.cameras.cameras.forEach((camera) => {
      camera.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
    });
  }

  /**
   * Camera starts following player
   */
  static startFollowPlayer(scene) {
    scene.cameras.cameras.forEach((camera) => {
      camera.startFollow(scene.player0, true, 0.3, 0.8);
    });
  }

  /**
   * Camera stops following player
   */
  static stopFollowPlayer(scene) {
    scene.cameras.cameras.forEach((camera) => {
      camera.stopFollow();
    });
  }

  /**
   * Pan the camera on X axis when player moves
   */
  static handleOffSetX(scene, direction) {
    const tweenDuration = 2000; // * 100 / Math.abs(scene.player.body.velocity.x);

    if (direction === 'right') {
      const offSetValue = scene.tweens.add({
        targets: [scene.cameras.main.followOffset],
        ease: 'Sine.easeInOut',
        duration: tweenDuration,
        delay: 0,
        repeat: 0,
        yoyo: false,
        x: { from: scene.cameras.main.followOffset.x, to: -51 },
      });
    }

    if (direction === 'left') {
      const offSetValue = scene.tweens.add({
        targets: [scene.cameras.main.followOffset],
        ease: 'Sine.easeInOut',
        duration: tweenDuration,
        delay: 0,
        repeat: 0,
        yoyo: false,
        x: { from: scene.cameras.main.followOffset.x, to: 51 },
      });
    }
  }
}