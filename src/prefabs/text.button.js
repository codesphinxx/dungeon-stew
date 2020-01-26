import Phaser from 'phaser';

export default class TextButton extends Phaser.GameObjects.Container
{
    /**
     * @param {Phaser.Scene} scene 
     * @param {Number} x 
     * @param {Number} y 
     * @param {String} texture
     * @param {String} text
     * @param {Phaser.Types.GameObjects.Text.TextStyle} style
     * @param {Number} margin
   */
    constructor(scene, x, y, texture, text, style, margin)
    {
        super(scene, x, y);
        
        this.name = Phaser.Utils.String.UUID();
        this.isDown = false;

        this.label = scene.add.text(0, 0, text || '', style);

        let width = Math.max(this.label.width + margin * 2, 100);
        let height = this.label.height + margin * 2;
        
        this.image = scene.add.nineslice(
            0, 
            0, 
            width, 
            height, 
            texture, 
            [15, 15, 15, 15]
        );
        
        this._resetLayout();        
        this.setSize(width, height); 

        this.image.setInteractive();
        this.image.on('pointerover', this._onpointerover, this);
        this.image.on('pointerout', this._onpointerout, this);
        this.image.on('pointerdown', this._onpointerdown, this);
        this.image.on('pointerup', this._onpointerup, this);

        this.add(this.image);
        this.add(this.label);
        scene.add.existing(this);
    }

    get text()
    {
        return this.label.text;
    }

    set text(value)
    {
        this.label.text = value;
        this._resetLayout();
    }

    _resetLayout()
    {
        let x = ((this.image.width - this.label.width) * 0.5) + this.x;
        let y = ((this.image.height - this.label.height) * 0.5) + this.y;
        this.label.setPosition(x, y);
    }

    /**
     * @param {Number} value 
     */
    _setGlobalScale(value)
    {
        let w = this.image.width * this.scale;
        let h = this.image.height * this.scale;
        let dw = this.image.width * value;
        let dh = this.image.height * value;
        
        this.scale = value;
        
        this.x += (w - dw) * 0.5;
        this.y += (h - dh) * 0.5;
    }

    _onpointerover()
    {
        //console.log('point over:', this.name);
    }

    _onpointerdown()
    {
        //console.log('point down:', this.name);
        this.isDown = true;
        this._setGlobalScale(1.1);
    }

    _onpointerup()
    {
        console.log('point up:', this.name);
        this.isDown = false;
        this._setGlobalScale(1);
    }

    _onpointerout()
    {
        //console.log('point out:', this.name);
        this.isDown = false;
        this._setGlobalScale(1);
    }

    /**
     * @param {Function} fn 
     * @param {Object} context 
     */
    addInputDownCallback(fn, context)
    {
        this.image.on('pointerdown', fn, context);
    }

    /**
     * @param {Function} fn 
     * @param {Object} context 
     */
    removeInputDownCallback(fn, context)
    {
        this.image.off('pointerdown', fn, context);
    }

    /**
     * @param {Function} fn 
     * @param {Object} context 
     */
    addInputUpCallback(fn, context)
    {
        this.image.on('pointerup', fn, context);
    }

    /**
     * @param {Function} fn 
     * @param {Object} context 
     */
    removeInputUpCallback(fn, context)
    {
        this.image.off('pointerup', fn, context);
    }
}