import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Image
{
    /**
     * @param {Phaser.Scene} scene 
     * @param {Number} x 
     * @param {Number} y 
     * @param {String} texture
     * @param {String} frame
     * @param {String} pressFrame
   */
    constructor(scene, x, y, texture, frame, pressFrame)
    {
        super(scene, x, y);
        this.isDown = false;
        this.key = frame;
        this.pressKey = pressFrame;
        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;
        this.on('pointerover', this._onpointerover, this);
        this.on('pointerout', this._onpointerout, this);
        this.on('pointerdown', this._onpointerdown, this);
        this.on('pointerup', this._onpointerup, this);
    }

    _onpointerover()
    {
        console.log('point over');
    }

    _onpointerdown()
    {
        console.log('point down');
        this.isDown = true;
        if (this.pressKey) this.setFrame(this.pressKey);
    }

    _onpointerup()
    {
        console.log('point up');
        this.isDown = false;
        if (this.key) this.setFrame(this.key);
    }

    _onpointerout()
    {
        console.log('point out');
        this.isDown = false;
        if (this.key) this.setFrame(this.key);
    }

    /**
     * @param {Function} fn 
     * @param {Object} context 
     */
    addInputDownCallback(fn, context)
    {
        this.on('pointerdown', fn, context);
    }

    /**
     * @param {Function} fn 
     * @param {Object} context 
     */
    removeInputDownCallback(fn, context)
    {
        this.off('pointerdown', fn, context);
    }

    /**
     * @param {Function} fn 
     * @param {Object} context 
     */
    addInputUpCallback(fn, context)
    {
        this.on('pointerup', fn, context);
        this.on('pointerout', fn, context);
    }

    /**
     * @param {Function} fn 
     * @param {Object} context 
     */
    removeInputUpCallback(fn, context)
    {
        this.off('pointerup', fn, context);
        this.off('pointerout', fn, context);
    }
}