import Phaser from "phaser";
import Button from '../prefabs/hud.button';

/**
 * Gameover menu scene
 */
export default class GameoverScene extends Phaser.Scene 
{
  constructor() 
  {
    super({key:'gameover', active:false});
  }

  init()
  {    
    this.purge = false;
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
      this.scene.start('title'); //TODO: fix bug where hud-scene failes after consecutive gameover
    }, this);
  }

  /**
   * @param {Number} time 
   * @param {Number} delta 
   */
  update(time, delta)
  {
    if (!this.purge)
    {
      this.purge = true;
      this.scene.remove('hud');     
    }
  }
}
