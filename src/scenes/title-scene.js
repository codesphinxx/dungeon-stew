import Phaser from "phaser";
import Button from '../prefabs/hud.button';
import GameManager from '../game.manager';
import Config from '../settings';

/**
 * Game main menu scene
 */
export default class TitleScene extends Phaser.Scene 
{
  constructor() 
  {
    super({key:'title', active:false});
  }

  create() 
  {
    this.background = this.add.image(0, 0, 'title-bg');
    this.background.setDisplayOrigin(0, 0);

    this.title = this.add.image(0, 80, 'game-title');
    this.title.setDisplayOrigin(0, 0);
    
    this.version = this.add.text(0, 0, `v${__VERSION__}`, {font: "16px pixelmix", fill: "#ffffff", stroke:"#000000", strokeThickness:2}); 
    this.version.x = this.game.config.width - (this.version.width + Config.DEFAULT_MARGIN);
    this.version.y = this.game.config.height - (this.version.height + Config.DEFAULT_MARGIN);

    /*this.credits = new Button(scene, 48, 80, 'ui', 'credits', 'credits_press');
    this.add(this.credits);

    this.credits.addInputDownCallback(() => {
      
    });

    this.settings = new Button(scene, scene.width - 100, 60, 'ui', 'settings', 'settings_press');
    this.add(this.settings);

    this.settings.addInputDownCallback(() => {
      
    });*/
    
    let posx = this.game.config.width * 0.5 - 160;
    let posy = this.game.config.height * 0.5 + 60;
    this.newgame = new Button(this, posx, posy, 'ui', 'newgame', 'newgame_press');
    this.add.existing(this.newgame);
    
    this.newgame.addInputDownCallback(() => {
      this.scene.start('dungeon');
    }, this);

    if (GameManager.$gameData.progress)
    {
      posy += this.newgame.height + 60;
      this.continue = new Button(this, posx, posy, 'ui', 'continue', 'continue_press');
      this.add.existing(this.continue);

      this.continue.addInputDownCallback(() => {
        
      });
    }
  }
}
