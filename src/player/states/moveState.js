import State from '../../utils/state';
import { ACCELERATION_X_RUN, MAX_VELOCITY_X_RUN, MAX_VELOCITY_X_SPRINT } from '../../constant/playerConstant';
import { consoleInfo } from '../../utils/consoleLog';

export default class MoveState extends State {
  constructor() {
    super()
    this.blockedDownTimestamp = 0;
    this.isFiring = 0;
    this.runTimeDown = 0;
    this.lastDirection = '';
  }

  enter(scene, player) {
    player.body.setDragX(0);
    player.playerState.isMorph = false;
    if (scene.keys.run.isDown) {
      this.runTimeDown = scene.time.now;
    } else {
      this.runTimeDown = 0;
    }
    this.lastDirection = player.direction;

    // Undo walljumps
    player.playerState.rightWallJump = false;
    player.playerState.leftWallJump = false;
    player.body.setAccelerationY(0);
    consoleInfo('MOVE STATE', this.stateMachine.prevState)
  }

  execute(scene, player) {
    const { left, right, up, down, fire, jump, run, select, pause } = scene.keys;
    const { playerState, body } = player;
    const absSpeed = Math.abs(body.velocity.x);

    // Move with acceleration
    player.move(false);

    // Fire
    // if (fire.isDown) {
    //   player.fire();
    //   this.isFiring = scene.time.now;
    // }

    // Player is hit by enemy
    if (player.playerState.isHit) {
      this.stateMachine.transition('hit', this.stateMachine.state);
      return;
    }

    // Transition to jump if pressing jump
    if (jump.isDown && jump.getDuration() < 250 && body.blocked.down) {
      this.stateMachine.transition('jump', this.stateMachine.state);
      return;
    }

    // Transition to idle if not pressing movement keys
    if (!(left.isDown || right.isDown || down.isDown)) {
      this.stateMachine.transition('idle', this.stateMachine.state);
      return;
    }

    // Transition to idle if no velocity x
    if (absSpeed === 0 && ((body.blocked.right || body.blocked.left) || (body.touching.right || body.touching.left))) {
      this.stateMachine.transition('idle', this.stateMachine.state);
      return;
    }

    // Transition to up if up is pressed
    if (up.isDown) {
      this.stateMachine.transition('up', this.stateMachine.state);
      return;
    }

    // Transition to fall if not touching ground after an elapsed time
    if (!body.blocked.down) {
      this.stateMachine.transition('fall', this.stateMachine.state);
      return;
    }

    // transition to attack if run is pressed
    if (run.isDown && player.playerState.lastAttack < scene.time.now) {
      this.stateMachine.transition('attack', this.stateMachine.state);
      return;
    }
  }
}