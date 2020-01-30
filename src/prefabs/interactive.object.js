import Phaser from 'phaser';

export default class InteractiveObject extends Phaser.Physics.Arcade.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} data 
   * @param {Number} data.id
   * @param {String} data.type
   * @param {String} data.texture
   * @param {String} data.frame
   * @param {Object} data.body
   * @param {Number} data.body.width
   * @param {Number} data.body.height
   * @param {Object} data.animations
   * @param {String} data.animations.key
   * @param {String} data.animations.prefix
   * @param {Number} data.animations.start
   * @param {Number} data.animations.end
   * @param {Number} data.animations.zeroPad
   * @param {Number} data.animations.frameRate
   * @param {Number} data.animations.repeat
   */
  constructor(scene, x, y, data) 
  {
    super(scene, x, y, data.texture, data.frame);
    scene.physics.add.existing(this, true);
    this.id = data.id;
    this.name = `${data.type}.${data.id}`;
    this.type = data.type
    
    const anims = scene.anims;

    anims.create({
      key: data.animations.key,
      frames: anims.generateFrameNames(data.texture, { 
        prefix: data.animations.prefix,
        start: data.animations.start,
        end: data.animations.end,
        zeroPad: data.animations.zeroPad
      }),
      frameRate: data.animations.frameRate,
      repeat: data.animations.repeat
    });

    this.setSize(data.body.width, data.body.height);
    this.setOffset(data.body.offset.x, data.body.offset.y);
    this.setFrame(0);
    
    scene.add.existing(this);
  } 

  get bounds()
  {
    return new Phaser.Geom.Rectangle(this.body.x, this.body.y, this.body.width, this.body.height);
  }
}
