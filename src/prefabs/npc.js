import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} data 
   * @param {Number} data.id
   * @param {String} data.name
   * @param {String} data.texture
   * @param {Number[]} data.frames
   * @param {Object[]} data.conversation
   * @param {Object} data.body
   * @param {Number} data.body.x
   * @param {Number} data.body.y
   * @param {Number} data.body.radius
   */
  constructor(scene, x, y, data) 
  {
    super(scene, x, y, data.texture);
    scene.physics.add.existing(this);
    this.conversation = data.conversation;
    this.id = data.id;
    this.name = data.name;

    const anims = scene.anims;

    anims.create({
      key: asset + "-idle",
      frames: anims.generateFrameNumbers(asset, { frames:data.frames }),
      frameRate: 6,
      repeat: -1
    });

    this.setScale(2);     
    this.setOffset(data.body.x, data.body.y);
    this.setCircle(data.body.radius);
    this.setFrame(0);
    
    scene.add.existing(this);
    this.anims.play(asset + "-idle", true);
  } 
}
