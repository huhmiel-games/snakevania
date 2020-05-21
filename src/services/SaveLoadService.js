import Constant from '../constant/gameConstant';
// import SaveStation from '../environment/saveStation';
// import Player from '../player/Player';
// import { Scene } from 'phaser';

/**
 * @static setNewSavedGame(): void
 * @static getSavedGame
 * @static getSavedGameTimeToString()
 * @static getSavedGameTime()
 * @static setSavedGameTime(time: number): void
 * @static deleteSavedGame(): void
 */
export default class SaveLoadService {

    /**
     * Set a new game save on localstorage
     */
    static setNewSavedGame(data) {
        try {
            if (!localStorage.getItem(`${Constant.GAMENAME}_playerDeathCount`)) {
                localStorage.setItem(`${Constant.GAMENAME}_playerDeathCount`, JSON.stringify(0));
            }
            if (!localStorage.getItem(`${Constant.GAMENAME}_enemiesDeathCount`)) {
                localStorage.setItem(`${Constant.GAMENAME}_enemiesDeathCount`, JSON.stringify(0));
            }
            if (!localStorage.getItem(`${Constant.GAMENAME}_data`)) {
                localStorage.setItem(`${Constant.GAMENAME}_data`, JSON.stringify(data));
            }
            if (!localStorage.getItem(`${Constant.GAMENAME}_time`)) {
                localStorage.setItem(`${Constant.GAMENAME}_time`, JSON.stringify(0));
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Save the game on localstorage
     */
    static saveGame(scene, player, savestation) {
      if (player === scene.player0 && !savestation.isOverlap) {
        savestation.setIsOverlap();
        scene.player0.inventory.savedPositionX = scene.player0.x;
        scene.player0.inventory.savedPositionY = scene.player0.y;
        scene.player0.inventory.map = savestation.saveState.destination;
        const s = JSON.stringify(scene.player0.inventory);
        localStorage.setItem(`${Constant.GAMENAME}_data`, s);
//////        scene.sound.play('melo');
        scene.msgText = scene.add.bitmapText(scene.cameras.main.worldView.x + 200, scene.cameras.main.worldView.y + 128, 'atomic', 'Game Saved', 30, 1)
          .setOrigin(0.5, 0.5)
          .setAlpha(1)
          .setDepth(110);
//////        this.countTime();
        scene.time.addEvent({
          delay: 1000,
          callback: () => {
            scene.msgText.setAlpha(0);
          },
        });
      }
  }

    /**
     * Return the saved game data
     */
    static getSavedGameData() {
        try {
            const storedGame = localStorage.getItem(`${Constant.GAMENAME}_data`);
            if (storedGame !== null) {
                return storedGame;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Return the saved game time to string
     */
    static getSavedGameTimeToString() {
        const storedTime = localStorage.getItem(`${Constant.GAMENAME}_time`);
        if (storedTime !== null) {
            return new Date(JSON.parse(storedTime)).toISOString().substr(11, 8);
        }
    }

    /**
     * Return the saved game time in seconds
     */
    static getSavedGameTime() {
        const s = localStorage.getItem(`${Constant.GAMENAME}_time`);
        if (s !== null) {
            return Number(s);
        } else {
            return 0;
        }
    };

    /**
     * Save the total time on game
     * @param time need to be seconds: new Date().valueOf() / 1000;
     */
    static setSavedGameTime(time) {
        const timestampNow = new Date().valueOf() / 1000;
        const currentSessionTime = timestampNow - time;
        const pastSessionTime = SaveLoadService.getSavedGameTime();
        localStorage.setItem(`${Constant.GAMENAME}_time`, JSON.stringify(pastSessionTime + currentSessionTime));
    }

    /**
     * Delete the saved game
     */
    static deleteSavedGame() {
        localStorage.removeItem(`${Constant.GAMENAME}_data`);
        localStorage.removeItem(`${Constant.GAMENAME}_time`);
        localStorage.removeItem(`${Constant.GAMENAME}_playerDeathCount`);
        localStorage.removeItem(`${Constant.GAMENAME}_enemiesDeathCount`);
    }

}