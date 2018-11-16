import Phaser from 'phaser';
import Utilx from '../helpers/utilx';

export default class HealthBar 
{
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} mhp 
     * @param {Object} style
     */
    constructor (scene, x, y, mhp, style)
    {
        this.x = x;
        this.y = y;
        this.minimum = 0;
        this._value = mhp || 100;
        this.maximum = mhp || 100;
        this.sprite = scene.add.graphics({x: this.x, y: this.y});
        this.style = Utilx.MergeObject({width:60,height:4,stroke:1,background:0xffffff,foreground:0xff0000,strokeColor:0x000000}, style);

        this.render();

        scene.add.existing(this.sprite);
    }

    get width()
    {
        return this.style.width;
    }

    get height()
    {
        return this.style.height;
    }

    get spriteX()
    {
        return this.sprite.x;
    }

    set spriteX(value)
    {
        this.x = value;
        this.sprite.x = value;
    }

    get spriteY()
    {
        return this.sprite.y;
    }

    set spriteY(value)
    {
        this.y = value;
        this.sprite.y = value;
    }

    get value()
    {
        return this._value;
    }

    set value(a)
    {
        this._value = Math.max(this.minimum, Math.min(this.maximum, a));
        this.render();
    }

    render ()
    {
        this.sprite.clear();

        //stroke
        this.sprite.fillStyle(this.style.strokeColor);
        this.sprite.fillRect(this.style.stroke, this.style.stroke, this.style.width, this.style.height);

        //  BG
        this.sprite.fillStyle(this.style.background);
        this.sprite.fillRect(0, 0, this.style.width, this.style.height);

        //  Health
        this.sprite.fillStyle(this.style.foreground);

        var width = (this._value/this.maximum) * this.style.width;

        this.sprite.fillRect(0, 0, width, this.style.height);
    }

    destroy()
    {
        this.sprite.destroy();
    }
}