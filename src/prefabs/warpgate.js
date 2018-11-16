import Phaser from 'phaser';

export default class WarpGate extends Phaser.GameObjects.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {String} texture
   * @param {String|Number} frame
   * @param {Object} data
   * @param {Number} data.moveX
   * @param {Number} data.moveY
   */
  constructor(scene, data, x, y, texture, frame) 
  {
    super(scene, x, y, texture, frame);
    scene.physics.add.existing(this, false);
    this.body.setCircle(this.width * 0.5);
    scene.add.existing(this);
    
    this.setDataEnabled();
    this.setData(data);
    this.id = Phaser.Utils.String.UUID();
  }

  /**
   * @returns {Number}
   */
  get moveX()
  {
    return this.data.values.moveX;
  }

  /**
   * @param {Number} value
   */
  set moveX(value)
  {
    this.data.values.moveX = value;
  }

  /**
   * @returns {Number}
   */
  get moveY()
  {
    return this.data.values.moveY;
  }

  /**
   * @param {Number} value
   */
  set moveY(value)
  {
    this.data.values.moveY = value;
  }

  update(time, delta) 
  {

  }

  /**
   * @param {Phaser.Physics.Arcade.Sprite} sprite 
   */
  warp(sprite)
  {

  }
}
