import State from '../../utils/state';
import { consoleInfo } from '../../utils/consoleLog';

export default class IdleState extends State {
  enter(scene, player) {
    // Stop player
    player.body.setDragX(3000);
    consoleInfo('IDLE STATE', this.stateMachine.prevState)
  }

  execute(scene, player) {
    const { left, right, up, down, fire, jump, run, select, pause } = scene.keys;
    const { body } = player;

    // Fire
    if (fire.isDown) {
      player.fire();
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

    // Transition to move if pressing left or right key and not blocked
    if (right.isDown && !(body.blocked.right || body.touching.right)) {
      this.stateMachine.transition('move', this.stateMachine.state);
      return;
    }
    if (left.isDown && !(body.blocked.left || body.touching.left)) {
      this.stateMachine.transition('move', this.stateMachine.state);
      return;
    }

    // Transition to up if up is pressed
    if (up.isDown) {
      this.stateMachine.transition('up', this.stateMachine.state);
      return;
    }

    // Transition to fall if not touching ground
    if (!player.body.blocked.down) {
      this.stateMachine.transition('fall', this.stateMachine.state);
    }
  }
}