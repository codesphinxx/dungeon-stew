import Phaser from 'phaser';
import GameManager from '../game.manager';

export default class WindowBase extends Phaser.Scene
{
  /**
   * @param {String} key 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} width
   * @param {Number} height
   * @param {String} texture
   */
    constructor(key, x, y, width, height, texture)
    {
        super({key:key, active:false});

        this.config = {x:x, y:y, width:width, height:height, texture:texture};
        
        this.manager = GameManager;
    }

    create()
    {
        this.texture = this.add.nineslice(
            this.config.x, 
            this.config.y, 
            this.config.width, 
            this.config.height, 
            this.config.texture, 
            [35, 15, 15, 15]
        );
    }

    show()
    {
        this.scene.bringToTop();
    }

    hide()
    {
        this.scene.sendToBack();
    }
}