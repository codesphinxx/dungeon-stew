import Phaser from 'phaser';
import Config from '../config';

export default class GameSprite extends Phaser.Physics.Arcade.Sprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {String} asset
   */
  constructor(scene, x, y, asset) 
  {
    super(scene, x, y, asset);
    scene.physics.add.existing(this);

    this._strength = 1;
    this.speed = 0;
    this._health = 0;
    this.key = asset;
    this.state = Config.PlayerStates.IDLE;    
    this.id = Phaser.Utils.String.UUID();
    this.flash = {active:false, counter:0, duration:15, color:0xff3300};
    
    const anims = scene.anims;

    anims.create({
      key: asset + "-idle",
      frames: anims.generateFrameNumbers(asset, { frames:[0,1,2,1] }),
      frameRate: 6,
      repeat: -1
    });
    anims.create({
      key: asset + "-pose",
      frames: anims.generateFrameNumbers(asset, { frames:[4,5,6,4] }),
      frameRate: 5
    });
    anims.create({
      key: asset + "-down",
      frames: anims.generateFrameNumbers(asset, { frames:[8,9,10,11] }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: asset + "-side",
      frames: anims.generateFrameNumbers(asset, { frames:[12,13,14,15] }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: asset + "-up",
      frames: anims.generateFrameNumbers(asset, { frames:[16,17,18,19] }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: asset + "-down-attack",
      frames: anims.generateFrameNumbers(asset, { frames:[20,21,22,23] }),
      frameRate: 10
    });
    anims.create({
      key: asset + "-side-attack",
      frames: anims.generateFrameNumbers(asset, { frames:[24,25,26,27] }),
      frameRate: 10
    });
    anims.create({
      key: asset + "-up-attack",
      frames: anims.generateFrameNumbers(asset, { frames:[28,29,30,31] }),
      frameRate: 10
    });    
    anims.create({
      key: asset + "-down-hit",
      frames: anims.generateFrameNumbers(asset, { frames:[32,33,34,33,34,32] }),
      frameRate: 10
    });
    anims.create({
      key: asset + "-side-hit",
      frames: anims.generateFrameNumbers(asset, { frames:[36,37,38,37,38,36] }),
      frameRate: 10
    });
    anims.create({
      key: asset + "-up-hit",
      frames: anims.generateFrameNumbers(asset, { frames:[40,41,42,41,42,40] }),
      frameRate: 10
    });     
    
    this._direction = Config.Directions.DOWN;
    this._prevDirection = Config.Directions.DOWN;
    this.on('animationcomplete', this._onAttackComplete, this);

    this.setScale(2);     
    this.setOffset(16, 16);
    this.setCircle(8);
    this.setFrame(0);

    this.title = scene.add.text(x, y, '', { fontFamily:'pixelmix', fontSize:10, color:'#ffffff' });
    this.title.setDisplayOrigin(0.5);
    
    scene.add.existing(this);
  }

  get alive()
  {
    return this._health > 0;
  }

  get health()
  {
    return this._health;
  }

  set health(value)
  {
    this._health = Math.max(0, Math.min(Config.MAX_HEALTH, value));
  }

  get strength()
  {
    return this._strength;
  }

  set strength(value)
  {
    this._strength = Math.max(1, Math.min(Config.MAX_STRENGTH, value));
  }

  get direction()
  {
    return this._direction;
  }

  /**
   * @param {Number} value
   */
  set direction(value)
  {
    if (!Number.isSafeInteger(value)) return;
    this._prevDirection = this._direction;
    this._direction = value;
  }

  /**
   * @param {String} displayName 
   */
  setTitle(displayName)
  {
    this.title.text = displayName;
  }
  
  _onAttackComplete(animation, frame)
  {
    if (animation && (animation.key.indexOf('attack') != -1 || animation.key.indexOf('hit') != -1))
    {
      if (this._health == 0)
      {        
        this.onDeath();
      }
      else
      {
        this.state = Config.PlayerStates.MOVE;
      }
      this._onPostAttackComplete(animation.key);
    }
  }

  /**
   * @param {String} animKey 
   */
  _onPostAttackComplete(animKey)
  {
    
  }

  attack()
  {
    if (this.state == Config.PlayerStates.ATTACK || this.state == Config.PlayerStates.DAMAGE) return;

    this.state = Config.PlayerStates.ATTACK;
    switch(this.direction)
    {
      case Config.Directions.DOWN:
        this.anims.play(this.key + "-down-attack", true);
      break;
      case Config.Directions.LEFT:
      case Config.Directions.RIGHT:
        this.anims.play(this.key + "-side-attack", true);
      break;
      case Config.Directions.UP:
        this.anims.play(this.key + "-up-attack", true);
      break;
    }
  }

  /**
   * @param {Phaser.GameObjects.Sprite} enemy 
   * @param {Number} dmg 
   */
  damage(enemy, dmg = 1)
  {
    if (this.state == Config.PlayerStates.DAMAGE || this._health == 0) return;
    if (enemy.state == Config.PlayerStates.DAMAGE || enemy.health == 0) return;
  
    this.health -= dmg;
    this.state = Config.PlayerStates.DAMAGE;
    switch(this.direction)
    { 
      case Config.Directions.DOWN:
        this.anims.play(this.key + "-down-hit", true);
      break;
      case Config.Directions.LEFT:
      case Config.Directions.RIGHT:
        this.anims.play(this.key + "-side-hit", true);
      break;
      case Config.Directions.UP:
        this.anims.play(this.key + "-up-hit", true);
      break;
    }
    
    //Set sprite single flash
    this.flash.active = true;
    this.flash.counter = this.flash.duration;

    let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.x, this.y);

    let dx = this.x + (Config.KNOCKBACK_INFLUENCE * Math.sign(angle));
    let dy = this.y + (Config.KNOCKBACK_INFLUENCE * Math.sign(angle));

    this.scene.physics.moveTo(this, dx, dy, 0, 25);    
  }

  onDeath()
  {
    this.state = Config.PlayerStates.CORPSE;
    var tween = this.scene.tweens.add({
        targets: this,
        alpha: 0,
        ease: 'Linear',
        duration: 100,
        yoyo: true,
        repeat: 2,
        onComplete: () => { 
          this.destroy();  
        }
    });
  }

  freeze() 
  {
    this.body.moves = false;
  }

  update(time, delta) 
  {
    this.title.x = this.getCenter().x;
    this.title.y = this.y - (this.height * 0.5);
    super.update();
  }

  updateFlash()
  {
    if (!this.flash.active) return;
    if(this.flash.counter % 5 == 0)
    {
      if(this.flash.color != this.tint)
      {
        this.tint = this.flash.color;
      }
      else
      {
        this.tint = 0xffffff;
      }
    }
    this.flash.counter--;
    if (this.flash.counter === 0)
    {
        this.tint = 0xffffff;
    }
    this.flash.active = this.flash.counter != 0;        
  }

  destroy() 
  {    
    this.title.destroy();
    super.destroy();
  }
}
