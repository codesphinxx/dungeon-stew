import Phaser from 'phaser';
import Player from './player';

export default class Collectible extends Phaser.GameObjects.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} data
   * @param {Number} data._key
   * @param {String} data.name
   * @param {Number} data.amount
   * @param {Number} data.itemType
   * @param {Number} data.duration
   * @param {String} data.texture
   * @param {String|Number} data.frame
   * @param {String} id
   */
  constructor(scene, x, y, data, id) 
  {
    super(scene, x, y, data.texture, data.frame);
    scene.physics.add.existing(this, false);
    this.body.setCircle(this.width * 0.4);
    scene.add.existing(this);
    
    this.id = id;
    this.key = data._key;
    this.setDataEnabled();
    this.setData('initialY', y);
    this.setData('collected', false);
    this.setData('amount', data.amount);
    this.setData('duration', data.duration);
    this.setData('itemType', data.itemType);
    this.setName(data.name);
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
    var speed  = 0.0040;
    var displacement = 8.0;
    this.y = this.data.values.initialY + Math.sin(time * speed) * delta/displacement;
    super.update();
  }

  /**
   * @param {Player} sprite 
   */
  collect(sprite)
  {
    if (this.collected) return;
    this.collected = true;
    if (sprite && sprite.alive) sprite.collectItem(this.key, this.itemType, this.amount, this.duration);
    this.destroy();
  }
}
