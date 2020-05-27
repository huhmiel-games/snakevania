import State from '../../utils/state';
import { consoleInfo } from '../../utils/consoleLog';

export default class JumpState extends State {
  constructor() {
    super();
    this.isJumping = false;
  }
  enter(scene, player) {
    // Initialize the jump
    const { left, right, up, down, fire, jump, run, select, pause } = scene.keys;
    const { playerState, inventory } = player;

    // Flag
    this.isJumping = true;

    // Limit vertical speed 
    player.body.maxVelocity.y = 100;
    player.body.setGravityY(0);

    // Jump timer
    this.jumpCooldownTimer = scene.time.addEvent({
      delay: 60 * player.inventory.eggs,
      callback: () => {
        this.isJumping = false;
      },
    });
    consoleInfo('JUMP STATE', this.stateMachine.prevState)
  }

  execute(scene, player) {
    const { left, right, up, down, fire, jump, run, select, pause } = scene.keys;
    const { playerState, body } = player;

    // Move with acceleration
    player.move(true);

    // Fire
    // if (fire.isDown && player.anims.currentAnim.key === 'player-jumpVertical') {
    //   player.fire();
    // }

    // Player is hit by enemy
    if (player.playerState.isHit) {
      this.stateMachine.transition('hit', this.stateMachine.state);
      return;
    }

    // Jump now
    if (jump.isDown && this.isJumping) {
      player.body.setVelocityY(-10 * player.inventory.eggs);
    }

    // End of jump, Transition to fall state
    if (!this.isJumping || !jump.isDown) {
      this.jumpCooldownTimer.remove();
      this.isJumping = false;
      this.stateMachine.transition('fall', this.stateMachine.state);
      return;
    }

    // If touching the ceiling
    if (body.blocked.up) {
      this.jumpCooldownTimer.remove();
      this.isJumping = false;
      this.stateMachine.transition('fall', this.stateMachine.state);
      return;
    }
  }
}