import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} data 
   * @param {Number} data.id
   * @param {String} data.key
   * @param {String} data.name
   * @param {Object[]} data.conversation
   */
  constructor(scene, x, y, data) 
  {
    super(scene, x, y, data.key);
    scene.physics.add.existing(this);
    this.conversation = data.conversation;
    this.id = data.id;
    this.name = data.name;

    const anims = scene.anims;

    anims.create({
      key: asset + "-idle",
      frames: anims.generateFrameNumbers(asset, { frames:[0,1,2,1] }),
      frameRate: 6,
      repeat: -1
    });

    this.setScale(2);     
    this.setOffset(16, 16);
    this.setCircle(8);
    this.setFrame(0);
    
    scene.add.existing(this);
  } 
}
