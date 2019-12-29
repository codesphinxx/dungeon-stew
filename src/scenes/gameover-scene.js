import Phaser from "phaser";
import Button from '../prefabs/hud.button';
import PlayData from '../models/playerData';
import Config from '../settings';

/**
 * Gameover menu scene
 */
export default class GameoverScene extends Phaser.Scene 
{
  constructor() 
  {
    super({key:'gameover', active:false});
  }

  create() 
  {
    this.title = this.add.image(0, 80, 'game-title');
    this.title.setDisplayOrigin(0, 0);
    
    let posx = this.game.config.width * 0.5 - 160;
    let posy = this.game.config.height * 0.5 + 60;
    this.continue = new Button(this, posx, posy, 'ui', 'continue', 'continue_press');
    this.add.existing(this.continue);
    
    this.continue.addInputDownCallback(() => {
      this.scene.start('dungeon');
    }, this);

    posy += this.continue.height + 60;
    this.quit = new Button(this, posx, posy, 'ui', 'quit', 'quit_press');
    this.add.existing(this.quit);

    this.quit.addInputDownCallback(() => {
      this.scene.start('title');
    }, this);
  }
}
