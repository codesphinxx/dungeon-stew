import Phaser from 'phaser';
import Conversation from '../models/npc.conversation';

export default class NPC extends Phaser.Physics.Arcade.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} data 
   * @param {Number} data.id
   * @param {String} data.name
   * @param {Boolean} data.xFlip
   * @param {String} data.texture
   * @param {Object[]} data.animations
   * @param {String} data.animations.key
   * @param {String} data.animations.prefix
   * @param {Number} data.animations.start
   * @param {Number} data.animations.end
   * @param {Number} data.animations.zeroPad
   * @param {Number} data.animations.frameRate
   * @param {Number} data.animations.repeat
   * @param {Object} data.body
   * @param {Object} data.body.offset
   * @param {Number} data.body.offset.x
   * @param {Number} data.body.offset.y
   * @param {Number} data.body.radius
   * @param {Object[]} data.conversation
   */
  constructor(scene, x, y, data) 
  {
    super(scene, x, y, data.texture);
    scene.physics.add.existing(this, true);
    this.id = data.id;
    this.name = data.name;
    /**
     * @type {Conversation}
     */
    this.conversation = Object.assign(new Conversation, data.conversation);
    
    const anims = scene.anims;

    for (var i = 0; i < data.animations.length; i++)
    {
      anims.create({
        key: data.animations[i].key,
        frames: anims.generateFrameNames(data.texture, { 
          prefix: data.animations[i].prefix,
          start: data.animations[i].start,
          end: data.animations[i].end,
          zeroPad: data.animations[i].zeroPad
        }),
        frameRate: data.animations[i].frameRate,
        repeat: data.animations[i].repeat
      });
    }

    this.setSize(data.body.width, data.body.height);
    this.setOffset(data.body.offset.x, data.body.offset.y);
    this.setFlipX(data.xFlip);
    
    scene.add.existing(this);
    this.anims.play(data.animations[0].key, true);
  } 

  get bounds()
  {
    return new Phaser.Geom.Rectangle(this.body.x, this.body.y, this.body.width, this.body.height);
  }
}
