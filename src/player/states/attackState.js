import State from '../../utils/state';
import { consoleInfo } from '../../utils/consoleLog';
import ControlsService from '../../services/ControlsService';

export default class AttackState extends State {
  enter(scene, player) {
    // if (player.playerState.lastAttack < scene.time.now) {
    //   this.stateMachine.transition('idle', this.stateMachine.state);
    //   return;
    // }
    this.attackTime = scene.time.now;
    player.playerState.lastAttack = scene.time.now + player.playerState.attackRate;
    player.setTexture('snakeHeadAttack');
    player.body.setSize(player.texture.width, player.texture.height).setOffset(0, 0);
    scene.playerGroup.forEach(e => {
      e.history = [];
      e.SPEED = 150;
      e.targetMoving = true;
    });
    
    consoleInfo('ATTACK STATE', this.stateMachine.prevState)
  }

  execute(scene, player) {
    const { left, right, up, down, fire, jump, run, select, pause } = scene.keys;
    const { body } = player;


    if (this.attackTime + 500 < scene.time.now) {
      player.body.maxVelocity.x = 100;
      scene.playerGroup.forEach(element => {
        element.SPEED = 140
      });
      player.setTexture('snakeHead');
      player.body.setSize(player.texture.width, player.texture.height).setOffset(0, 0);
      this.stateMachine.transition('idle', this.stateMachine.state);
      return;
    }

    if (player.body.maxVelocity.x === 100) {
      console.log('here')
      player.body.maxVelocity.x *= 2;
      
      
    }
    const newSpeed = Math.abs(player.body.velocity.x) + 80;
    for (let i = 1; i < scene.playerGroup.length; i += 1) {
      scene.playerGroup[i].SPEED = 280;
    }
    // scene.playerGroup.forEach(element => {
    //   console.log(element)
    //   element.SPEED = Math.abs(player.body.velocity.x) + 80;//280;
    // });
    console.log(player.body.velocity.x)

    
  }
}