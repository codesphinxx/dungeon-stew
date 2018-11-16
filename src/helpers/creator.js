import Phaser from 'phaser';
import Player from '../prefabs/player';
import Monster from '../prefabs/monster';
import Collectible from "../prefabs/collectible";
import Config from '../config';

export default class Creator
{
    constructor()
    {
        throw new Error('Statis class cannot be initialized');
    }

    /**
   * @param {Phaser.Scene} scene 
   * @param {Phaser.Physics.Arcade.Group} physicsGroup
   * @param {String} itemType
   * @param {Number} x 
   * @param {Number} y 
   * @param {String} texture
   * @param {String|Number} frame
   */
    static createItem(scene, physicsGroup, itemType, x, y, texture, frame)
    {
        if (itemType == Config.ItemTypes.NONE) return;
        if (frame==null || frame==undefined) frame = itemType;
        
        var data = { amount:0, itemType:itemType, duration:0 };
        switch(itemType)
        {
            case Config.ItemTypes.LIFE:
                data.amount = 1;
            break;
            case Config.ItemTypes.INVULNERABLE:
                data.amount = 1;
                data.duration = 10000;
            break;
            case Config.ItemTypes.STEALTH:
                data.amount = 0.5;
                data.duration = 10000;
            break;
            case Config.ItemTypes.DAMAGE_UP:
                data.amount = 1;
                data.duration = 10000;
            break;
        }
        var item = new Collectible(scene, data, x, y, texture, frame);
        if (physicsGroup != null && physicsGroup != undefined)
        {
            physicsGroup.add(item);
        }
        return item;
    }    

    /**
   * @param {Phaser.Scene} scene 
   * @param {Phaser.Physics.Arcade.Group} physicsGroup
   * @param {Number} x 
   * @param {Number} y 
   * @param {String} texture
   * @param {Number} mhp
   * @param {String} title
   */
  static createMonster(scene, physicsGroup, x, y, texture, mhp, title)
  {
      var monster = new Monster(scene, x, y, texture, mhp);
      if (physicsGroup != null && physicsGroup != undefined)
      {
          physicsGroup.add(monster);
      }
      if (title != null && title != undefined)
      {
        monster.setTitle(title);
      }
      return monster;
  }
  
    /**
     * @param {Phaser.Scene} scene 
     * @param {Phaser.Physics.Arcade.Group} physicsGroup
     * @param {Number} x 
     * @param {Number} y 
     * @param {String} texture
     * @param {String} title
     */
    static createPlayer(scene, physicsGroup, x, y, texture, title)
    {
        var player = new Player(scene, x, y, texture);
        if (physicsGroup != null && physicsGroup != undefined)
        {
            physicsGroup.add(player);
        }
        if (title != null && title != undefined)
        {
        player.setTitle(title);
        }
        return player;
    }
}