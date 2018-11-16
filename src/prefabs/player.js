import Phaser from 'phaser';
import Config from '../config';
import GameSprite from './gamesprite';
import Collectible from './collectible';

export default class Player extends GameSprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {String} key
   */
  constructor(scene, x, y, key) 
  {
    super(scene, x, y, key);
    this._buffTimer = {};
    this._invulnerable = false;
    this.health = Config.BASE_HEALTH;
    this.speed = Config.PLAYER_MOVE_SPEED;

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      Z: Phaser.Input.Keyboard.KeyCodes.Z
    });

    this.gamepad = {
      up: false,
      down: false,
      left: false,
      right: false,
      A: false
    };
  } 

  get health()
  {
    return super.health;
  }

  set health(value)
  {    
    super.health = value;
    this.emit('healthchange');
  }

  get invulnerable()
  {
    return this._invulnerable;
  }

  /**
   * @param {Boolean} value
   */
  set invulnerable(value)
  {
    this._invulnerable = value;
    //TODO: initialize invulnerable graphics
  }

  update(time, delta) 
  {     
    if (this.state == Config.PlayerStates.CORPSE) return;
    
    var keys = this.keys;

    if (this.state == Config.PlayerStates.IDLE || this.state == Config.PlayerStates.MOVE)
    {
      //set look direction if not attacking or damage
      let pointer = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main)
      let dx = Math.abs(pointer.x - this.body.x);
      let dy = Math.abs(pointer.y - this.body.y);

      if (dx > dy)
      {
        this.direction = (pointer.x > this.x) ? Config.Directions.RIGHT : Config.Directions.LEFT;
      }
      else
      {
        this.direction = (pointer.y > this.y) ? Config.Directions.DOWN : Config.Directions.UP;
      }
      if (Phaser.Input.Keyboard.JustDown(keys.Z)) 
      {
        this.attack();
      }
    }

    if (this.state != Config.PlayerStates.DAMAGE) //No tweaking of velocity while playing knockback
    {
      // Stop any previous movement from the last frame
      this.body.setVelocity(0);
      
      if (this.direction == Config.Directions.LEFT)
      {
        this.setFlipX(true);
      }
      else if (this.direction == Config.Directions.RIGHT)
      {
        this.setFlipX(false);
      }

      // Horizontal movement
      if (keys.left.isDown || keys.A.isDown || this.gamepad.left) 
      {
        this.body.setVelocityX(-this.speed);
      } 
      else if (keys.right.isDown || keys.D.isDown || this.gamepad.right) 
      {
        this.body.setVelocityX(this.speed);
      }

      // Vertical movement
      if (keys.up.isDown || keys.W.isDown || this.gamepad.up) 
      {
        this.body.setVelocityY(-this.speed);
      } 
      else if (keys.down.isDown || keys.S.isDown || this.gamepad.down) 
      {
        this.body.setVelocityY(this.speed);
      }

      // Normalize and scale the velocity so that sprite can't move faster along a diagonal
      this.body.velocity.normalize().scale(this.speed);      
    }

    if (this.state == Config.PlayerStates.IDLE || this.state == Config.PlayerStates.MOVE)
    {      
      if (this.body.velocity.x != 0 || this.body.velocity.y != 0)
      {
        this.state = Config.PlayerStates.MOVE;
        // Update the animation last and give left/right animations precedence over up/down animations 
        if (this.direction == Config.Directions.LEFT || this.direction == Config.Directions.RIGHT)
        {
          this.anims.play(this.key + "-side", true);
        } 
        else if (this.direction == Config.Directions.DOWN)
        {
          this.anims.play(this.key + "-down", true);
        } 
        else if (this.direction == Config.Directions.UP) 
        {
          this.anims.play(this.key + "-up", true);
        }
      }
      else
      {
        this.state = Config.PlayerStates.IDLE;

        this.anims.stop();
        if (this.direction == Config.Directions.DOWN)
          this.setFrame(0);
        else if (this.direction == Config.Directions.UP)
          this.setFrame(43);
        else if (this.direction == Config.Directions.LEFT || this.direction == Config.Directions.RIGHT)
          this.setFrame(39);
      }
    }
    
    super.update();
    this.updateFlash();
    this.updateBuff(delta);
  }

  /**
   * @param {Number} delta 
   */
  updateBuff(delta)
  {
    for (var id in this._buffTimer)
    {
      this._buffTimer[id] -= delta;
      if (this._buffTimer[id] <= 0)
      {
        this._buffTimer[id] = null;
        delete this._buffTimer[id];
        if (id == Config.ItemTypes.INVULNERABLE)
        {
          this.invulnerable = false;
        }
        else if (id == Config.ItemTypes.DAMAGE_UP)
        {
          this.strength--;
        }
        else if (id == Config.ItemTypes.STEALTH)
        {
          this.alpha = 1;
        }
      }
    }
  }

  /**
   * @param {Collectible} item 
   */
  collectItem(item)
  {
    switch(item.itemType)
    {
      case Config.ItemTypes.INVULNERABLE:
        this.invulnerable = true; 
        this._buffTimer[item.itemType] = item.duration;       
      break;
      case Config.ItemTypes.DAMAGE_UP:
        this.strength += item.amount; 
        this._buffTimer[item.itemType] = item.duration; 
      break;
      case Config.ItemTypes.STEALTH:
        this.alpha = item.amount; 
        this._buffTimer[item.itemType] = item.duration; 
      break;
    }
  }
}
