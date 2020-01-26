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

        this.config = {x:x, y:y, width:width, height:height, texture:texture, key:key};
        
        this.manager = GameManager;

        this.active = false;
    }

    create()
    {
        this.panel = this.add.nineslice(
            this.config.x, 
            this.config.y, 
            this.config.width, 
            this.config.height, 
            this.config.texture, 
            [40, 40, 40, 40]
        );

        this.keys = this.input.keyboard.addKeys({
            X: Phaser.Input.Keyboard.KeyCodes.X
        });

        this.scene.setActive(false);
        this.scene.setVisible(false);
    }

    show()
    {
        this.active = true;
        this.scene.setActive(true);
        this.scene.setVisible(true);
        this.game.events.emit('active.scene', this.config.key, false);
    }

    hide()
    {
        this.active = false;
        this.scene.setActive(false);
        this.scene.setVisible(false);
        this.game.events.emit('active.scene', this.config.key, true);
    }
}