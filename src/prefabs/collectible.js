import Phaser from 'phaser';
import GameSprite from './gamesprite';

export default class Collectible extends Phaser.GameObjects.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {String} texture
   * @param {String|Number} frame
   * @param {Object} data
   * @param {Number} data.amount
   * @param {Number} data.itemType
   * @param {Number} data.duration
   */
  constructor(scene, data, x, y, texture, frame) 
  {
    super(scene, x, y, texture, frame);
    scene.physics.add.existing(this, false);
    this.body.setCircle(this.width * 0.4);
    scene.add.existing(this);
    
    this.setDataEnabled();
    this.setData(data);
    this.setData('initialY', y);
    this.setData('collected', false);
    this.setName(Phaser.Utils.String.UUID());
  }

  /**
   * @returns {Number}
   */
  get amount()
  {
    return this.data.values.amount;
  }

  /**
   * @param {Number} value
   */
  set amount(value)
  {
    this.data.values.amount = value;
  }

  /**
   * @returns {Boolean}
   */
  get collected()
  {
    return this.data.values.collected;
  }

  /**
   * @param {Boolean} value
   */
  set collected(value)
  {
    this.data.values.collected = value;
  }

  /**
   * @returns {Number}
   */
  get itemType()
  {
    return this.data.values.itemType;
  }

  /**
   * @param {Number} value
   */
  set itemType(value)
  {
    this.data.values.itemType = value;
  }

  /**
   * @returns {Number}
   */
  get duration()
  {
    return this.data.values.duration;
  }

  /**
   * @param {Number} value
   */
  set duration(value)
  {
    this.data.values.duration = value;
  }

  update(time, delta) 
  {
    var speed  = 0.0020;
    var displacement = 16.0;
    this.y = this.data.values.initialY + Math.sin(time * speed) * displacement / 2.0;
    super.update();
  }

  /**
   * @param {GameSprite} sprite 
   */
  collect(sprite)
  {
    if (this.collected) return;
    this.collected = true;
    this.destroy(); 
  }
}
