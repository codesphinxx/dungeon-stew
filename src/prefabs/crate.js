import Phaser from 'phaser';

export default class Crate extends Phaser.GameObjects.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {String} texture
   * @param {String|Number} frame
   * @param {Object} size
   * @param {Number} size.width
   * @param {Number} size.height
   */
  constructor(scene, x, y, size, texture, frame) 
  {
    super(scene, x, y, texture, frame);
    this.id = Phaser.Utils.String.UUID();
    scene.physics.add.existing(this, false);
    scene.add.existing(this);
    
    this.setSize(size.width, size.height);
  }
}
