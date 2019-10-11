import Phaser from 'phaser';

export default class ImagePanel extends Phaser.GameObjects.RenderTexture
{
    /**
     * @param {Phaser.Scene} scene 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(scene, x, y, width, height)
    {
        super(scene, x, y, width, height);
        
        scene.add.existing(this);
    }
}