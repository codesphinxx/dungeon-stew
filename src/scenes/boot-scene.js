import Phaser from 'phaser';
import Config from '../config';

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

  preload() 
  {
    var url = 'http://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexbbcodetextplugin.min.js';
    this.load.plugin('rexbbcodetextplugin', url, true);
    this.load.image('mask', '../assets/images/mask1.png');
    this.load.image("tiles", "../assets/tilesets/tuxmon-sample-32px-extruded.png");
    this.load.atlas('ui', '../assets/images/ui.png', '../assets/images/ui.json');
    this.load.spritesheet(
      "player",
      "../assets/spritesheets/chara_hero.png",
      {
        frameWidth: 48,
        frameHeight: 48,
        margin: 0,
        spacing: 0
      }
    );
    this.load.spritesheet(
      "slime",
      "../assets/spritesheets/chara_slime.png",
      {
        frameWidth: 48,
        frameHeight: 48,
        margin: 0,
        spacing: 0
      }
    );    
    /*WebFont.load({
      custom: {
          families: [ 'pixelmix', 'Thin Pixel-7' ]
      },
      active: () => { this.fontLoad = true; }
    });*/
  }

  create() 
  {
    this.dungeon = {
      width: 50,
      height: 50,
      doorPadding: 2,
      rooms: {
        width: { min: 7, max: 15, onlyOdd: true },
        height: { min: 7, max: 15, onlyOdd: true }
      },
      maxRooms: 10,
      collectibles:[
        Config.ItemTypes.KEY,
        Config.ItemTypes.LIFE,
        Config.ItemTypes.LIFE,
        Config.ItemTypes.LIFE
      ],
      monsters:3
    };
  }

  update(time, delta) 
  {
    if (!this.loadComplete/* && this.fontReady*/)
    {
      this.loadComplete = true;
      //this.scene.start('boss', {map:'demo'});
      this.scene.start('dungeon');
    }    
  }
}
