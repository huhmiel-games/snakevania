import State from '../../utils/state';
import CameraService from '../../services/CameraService';
import { consoleLog, consoleInfo } from '../../utils/consoleLog';

export default class FallState extends State {
  constructor() {
    super()
    this.fallingTimestamp = 0;
  }
  enter(scene, player) {
    // Decrease in gravity at maximum jump height during 250ms
    player.body.setGravityY(500);
    // Gravity timer (--> need to be changed with timestamp?)
    if (!player.body.blocked.up) {
      this.gravityCooldownTimer = scene.time.addEvent({
        delay: 350,
        callback: () => {
          player.body.setGravityY(1000);
        },
      });
    }
    consoleInfo('FALL STATE', this.stateMachine.prevState)
  }

  execute(scene, player) {
    const { left, right, up, down, fire, jump, run, select, pause } = scene.keys;
    const { playerState, body, wallJumpMomentum, wallJumpSide } = player;
    const { blockedDownTimestamp, rightWallJump, leftWallJump, isMorph } = playerState;
    const { prevState } = this.stateMachine;

    // Fire
    if (fire.isDown && player.anims.currentAnim.key === 'player-jumpVertical') {
      // player.fire();
    }

    // Player is hit by enemy
    if (player.playerState.isHit) {
      this.stateMachine.transition('hit', this.stateMachine.state);
      return;
    }
    // Move with acceleration
    player.move();

    // Start falling
    if (!body.blocked.down) {
      player.body.setAccelerationY(0);
    }

    // Ghost Jumping
    const ghostJumpDelay = scene.keys.run.isDown ? 25 : 60;
    if (blockedDownTimestamp + ghostJumpDelay > scene.time.now
      && jump.isDown
      && jump.getDuration() < 250
    ) {
      console.log('GHOST JUMP')
      this.stateMachine.transition('jump', this.stateMachine.state);
      return;
    }

    

    // Transition to move if touching ground
    if (body.blocked.down) {
      console.log('TOUCHING GROUND')
      run.isDown ? player.body.maxVelocity.x = 180 : player.body.maxVelocity.x = 100;
      this.gravityCooldownTimer.remove();
      player.body.setAccelerationY(0);
      player.verticalDirection = 'up';
      this.stateMachine.transition('move', this.stateMachine.state);
      return;
    }
  }
}