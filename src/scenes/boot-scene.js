import Phaser from 'phaser';
import {Assets} from '../settings';
import GameManager from '../game.manager';

/**
 * Scene that loads game assets
 */
export default class BootScene extends Phaser.Scene 
{
  constructor()
  {
    super({key:'boot', active:true});
    this.loadComplete = false;
    this.fontLoad = false;
  }

  init()
  {
    GameManager.init();
  }

  preload() 
  {
    for (var i = 0; i < Assets.Images.length; i++)
    {
      this.load.image(Assets.Images[i].key, Assets.Images[i].value);
    }
    for (i = 0; i < Assets.Atlas.length; i++)
    {
      this.load.atlas(Assets.Atlas[i].key, Assets.Atlas[i].image, Assets.Atlas[i].data);
    }
    for (i = 0; i < Assets.Plugins.length; i++)
    {
      this.load.plugin(Assets.Plugins[i].key, Assets.Plugins[i].url, Assets.Plugins[i].autoStart);
    }
    for (i = 0; i < Assets.Sprites.length; i++)
    {
      this.load.spritesheet(Assets.Sprites[i].key, Assets.Sprites[i].image, Assets.Sprites[i].data);
    }  
    for (var i = 0; i < Assets.Data.length; i++)
    {
      this.load.json(Assets.Data[i].key, Assets.Data[i].path);
    }  
    WebFont.load({
      custom: {
          families: [ 'pixelmix', 'Thin Pixel-7' ]
      },
      active: () => { this.fontLoad = true; console.log('font loaded'); }
    });
  }

  create() 
  {
    for (var i = 0; i < Assets.Data.length; i++)
    {
      window[`$${Assets.Data[i].key.capitalize()}`] = this.cache.json.get(Assets.Data[i].key);
    }
  }

  update(time, delta) 
  {
    if (!this.loadComplete/* && this.fontReady*/)
    {
      this.loadComplete = true;
      //this.scene.start('boss', {map:'demo'});
      this.scene.start('title');
    }    
  }
}
