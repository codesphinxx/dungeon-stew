import Phaser from "phaser";
import Button from '../prefabs/hud.button';
import PlayData from '../models/playData';

/**
 * Game main menu scene
 */
export default class TitleScene extends Phaser.Scene 
{
  constructor() 
  {
    super({key:'title', active:false});
  }

  init()
  {
    window.$gameData = {
      progress: null,
      sound: Boolean(JSON.parse(localStorage.getItem('ds-sound') || 'true')),
      vibrate: Boolean(JSON.parse(localStorage.getItem('ds-vibrate')  || 'true'))
    };
    let progress = localStorage.getItem('ds-data');
    if (progress)
    {
      window.$gameData.progress = Object.assign(new PlayData, JSON.parse(progress));
    }
  }

  create() 
  {
    this.background = this.add.image(0, 0, 'title-bg');
    this.title = this.add.image(this.game.config.width * 0.5, 80, 'game-title');
    this.title.setDisplayOrigin(0.5, 0);

    this.credits = new Button(scene, 48, 80, 'ui', 'credits', 'credits_press');
    this.add(this.credits);

    this.credits.addInputDownCallback(() => {
      
    });

    this.settings = new Button(scene, scene.width - 100, 60, 'ui', 'settings', 'settings_press');
    this.add(this.settings);

    this.settings.addInputDownCallback(() => {
      
    });

    this.newgame = new Button(scene, scene.width - 100, 60, 'ui', 'newgame', 'newgame_press');
    this.add(this.newgame);

    this.newgame.addInputDownCallback(() => {
      
    });

    if (window.$gameData.progress)
    {
      this.continue = new Button(scene, scene.width - 100, 60, 'ui', 'continue', 'continue_press');
      this.add(this.continue);

      this.continue.addInputDownCallback(() => {
        
      });
    }
  }
}
