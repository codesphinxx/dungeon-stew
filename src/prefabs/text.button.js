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
        
        this.isDown = false;

        this.content = scene.add.text(0, 0, text || '', style);

        let width = Math.max(this.content.width + margin * 2, 100);
        let height = this.content.height + margin * 2;
        
        this.image = scene.add.nineslice(
            0, 
            0, 
            width, 
            height, 
            texture, 
            [15, 15, 15, 15]
        );
        
        this.add(this.image);
        this.add(this.content);
        this._resetLayout();
        
        this.setSize(width, height);
        this.setInteractive();
        this.on('pointerover', this._onpointerover, this);
        this.on('pointerout', this._onpointerout, this);
        this.on('pointerdown', this._onpointerdown, this);
        this.on('pointerup', this._onpointerup, this);
        scene.add.existing(this);
    }

    get text()
    {
        return this.content.text;
    }

    set text(value)
    {
        this.content.text = value;
        this._resetLayout();
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w 
     */
    setPosition(x, y, z, w)
    {
        super.setPosition(x, y, z, w);
        
    }

    _resetLayout()
    {
        let x = ((this.image.width - this.content.width) * 0.5) + this.x;
        let y = ((this.image.height - this.content.height) * 0.5) + this.y;
        this.content.setPosition(x, y);
    }

    _onpointerover()
    {
        console.log('point over');
    }

    _onpointerdown()
    {
        console.log('point down');
        this.isDown = true;
        this.scale = 1.1;
    }

    _onpointerup()
    {
        console.log('point up');
        this.isDown = false;
        this.scale = 1;
    }

    _onpointerout()
    {
        console.log('point out');
        this.isDown = false;
        this.scale = 1;
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