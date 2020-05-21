import State from '../../utils/state';
import { consoleInfo } from '../../utils/consoleLog';
import ControlsService from '../../services/ControlsService';

export default class HitState extends State {
  enter(scene, player) {
    // Stop player
    player.body.setDragX(0);
    ControlsService.disableInputKeys(scene);
    this.hitTime = scene.time.now;
    player.body.setAcceleration(0, 0);
    if (player.direction === 'right') {
      player.body.setVelocity(-200, -200);
    }
    if (player.direction === 'left') {
      player.body.setVelocity(200, -200);
    }
    consoleInfo('HIT STATE', this.stateMachine.prevState)
  }

  execute(scene, player) {
    const { left, right, up, down, fire, jump, run, select, pause } = scene.keys;
    const { body } = player;

    if (player.body.blocked.down && this.hitTime + 600 < scene.time.now && !player.playerState.isDead) {
      player.body.setVelocity(0, 0);
      player.playerState.isHit = false;
      ControlsService.enableInputKeys(scene);
      this.stateMachine.transition('idle', this.stateMachine.state);
      return;
    }
    

    // Transition to fall if not touching ground
    if (!player.body.blocked.down && this.hitTime + 600 < scene.time.now && !player.playerState.isDead) {
      player.body.setVelocity(0, 0);
      player.playerState.isHit = false;
      ControlsService.enableInputKeys(scene);
      this.stateMachine.transition('fall', this.stateMachine.state);
      return
    }

    // Player is dead, slow down everything while waiting for GameOver scene to start
    if (player.playerState.isDead) {
      if (player.body.blocked.down) {
        player.body.setVelocityX(player.body.velocity.x / 2)
      }
      
      if (scene.physics.world.timeScale < 4) {
        scene.physics.world.timeScale += 0.1;
      }
    }
  }
}