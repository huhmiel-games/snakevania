import State from '../../utils/state';
import { consoleInfo } from '../../utils/consoleLog';

export default class UpState extends State {
  enter(scene, player) {
    player.body.setAcceleration(0);
    player.body.setDragX(19000 * (10 / Math.abs(player.body.velocity.x)))
    const {rightWallJump, leftWallJump} = scene.player0.playerState;
    consoleInfo('UP STATE', this.stateMachine.prevState);
  }

  execute(scene, player) {
    const { left, right, up, down, fire, jump, run, select, pause } = scene.keys;
    const { playerState } = player;

    if (up.isDown && left.isDown) {
      player.direction = 'left';
    } else if (up.isDown && right.isDown) {
      player.direction = 'right';
    }

    // Fire
    if (fire.isDown) {
      //player.fire(true);
    }

    // Player is hit by enemy
    if (player.playerState.isHit) {
      this.stateMachine.transition('hit', this.stateMachine.state);
      return;
    }

    // Transition to jump if pressing jump
    if (jump.isDown && jump.getDuration() < 250) {
      this.stateMachine.transition('jump', this.stateMachine.state);
      return;
    }

    // Transition to move if pressing a movement key
    if (!up.isDown && (left.isDown || right.isDown)) {
      this.stateMachine.transition('move', this.stateMachine.state);
      return;
    }

    // Transition to idle
    if(!up.isDown) {
      this.stateMachine.transition('idle', this.stateMachine.state);
      return;
    }

    // If falling while shoot-up, transition to fall
    if (!player.body.blocked.down) {
      this.stateMachine.transition('fall', this.stateMachine.state);
      return;
    }

    // transition to attack if run is pressed
    if (run.isDown) {
      this.stateMachine.transition('attack', this.stateMachine.state);
      return;
    }
  }
}