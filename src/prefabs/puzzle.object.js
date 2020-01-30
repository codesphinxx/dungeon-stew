import Phaser from 'phaser';

export default class PuzzleObject
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
    scene.physics.add.existing(this, false);
    scene.add.existing(this);
    
    this.setSize(size.width, size.height);
    this.id = Phaser.Utils.String.UUID();
  }
}
