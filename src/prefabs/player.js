import Phaser from 'phaser';
import Config from '../settings';
import GameSprite from './gamesprite';

export default class Player extends GameSprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} data
   * @param {String} data.id
   * @param {String} data.key
   * @param {String} data.name
   * @param {Number} data.speed
   * @param {Number} data.health
   */
  constructor(scene, x, y, data) 
  {
    super(scene, x, y, data.key, data.id);
    this._buffTimer = {};
    this._invulnerable = false;
    this.health = Config.BASE_HEALTH;
    this.speed = Config.PLAYER_MOVE_SPEED;
    this.setName(data.name);

    this.weapon = -1;
    this.armor = -1;

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      Z: Phaser.Input.Keyboard.KeyCodes.Z,
      X: Phaser.Input.Keyboard.KeyCodes.X,
      C: Phaser.Input.Keyboard.KeyCodes.C
    });

    this.gamepad = {
      up: false,
      down: false,
      left: false,
      right: false,
      A: false,
      B: false,
      C: false
    };

    if (!scene.isMobile())
    {
      scene.input.on('pointerdown', (pointer) => {
          if (!this.alive) return;
          if (pointer.rightButtonDown())
          {
              //TODO: action button event
          }
          else
          {
              this.attack();
          }                
      });

      scene.input.gamepad.once('down', (pad) => {
        /**
         * @type {Phaser.Input.Gamepad.Gamepad}
         */
          this.controller = pad;
      });
    }
  } 

  get health()
  {
    return super.health;
  }

  set health(value)
  {    
    super.health = value;
    this.emit('health.change');
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
  
  _onPostDamageComplete()
  {
    if (!this.alive) return;
    this.state = Config.PlayerStates.IDLE;
  }

  _onAttackComplete(animation, frame)
  {
    this.state = Config.PlayerStates.MOVE;
  }

  /**
   * @param {Number} time 
   * @param {Number} delta 
   */
  update(time, delta) 
  {     
    if (!this.scene) return;
    if (this.state == Config.PlayerStates.CORPSE) return;

    if (this.alive)
    {
      var keys = this.keys;

      if (this.state == Config.PlayerStates.IDLE || this.state == Config.PlayerStates.MOVE)
      {
        //set look direction if not attacking or damage
        /*let pointer = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main)
        let dx = Math.abs(pointer.x - this.body.x);
        let dy = Math.abs(pointer.y - this.body.y);

        if (dx > dy)
        {
          this.direction = (pointer.x > this.x) ? Config.Directions.RIGHT : Config.Directions.LEFT;
        }
        else
        {
          this.direction = (pointer.y > this.y) ? Config.Directions.DOWN : Config.Directions.UP;
        }*/
        if (!this.scene.isMobile())
        {
          if (Phaser.Input.Keyboard.JustDown(keys.Z)) 
          {
            this.attack();
          }
          else if (Phaser.Input.Keyboard.JustDown(keys.X)) 
          {
            //TODO: trigger interaction
          }
          else if (Phaser.Input.Keyboard.JustDown(keys.C)) 
          {
            //TODO: call inventory
          }
          if (this.controller)
          {
            if (this.controller.A)
            {
              this.attack();
            }
            else if (this.controller.X)
            {
              //TODO: trigger interaction
            }
            else if (this.controller.Y)
            {
              //TODO: call inventory
            }
          }
        }
      }
   
      //if (this.state != Config.PlayerStates.DAMAGE) 
      {
        // Stop any previous movement from the last frame
        this.body.setVelocity(0);

        if (!this.scene.isMobile())
        {
          // Horizontal movement
          if (keys.left.isDown || keys.A.isDown || this.gamepad.left || (this.controller && this.controller.left))
          {
            this.direction = Config.Directions.LEFT;
            this.body.setVelocityX(-this.speed);
          } 
          else if (keys.right.isDown || keys.D.isDown || this.gamepad.right || (this.controller && this.controller.right)) 
          {
            this.direction = Config.Directions.RIGHT;
            this.body.setVelocityX(this.speed);
          }

          // Vertical movement
          if (keys.up.isDown || keys.W.isDown || this.gamepad.up || (this.controller && this.controller.up))
          {
            this.direction = Config.Directions.UP;
            this.body.setVelocityY(-this.speed);
          } 
          else if (keys.down.isDown || keys.S.isDown || this.gamepad.down || (this.controller && this.controller.down))
          {
            this.direction = Config.Directions.DOWN;
            this.body.setVelocityY(this.speed);
          }
        }
        else
        {
          // Horizontal movement
          if (this.gamepad.left) 
          {
            this.direction = Config.Directions.LEFT;
            this.body.setVelocityX(-this.speed);
          } 
          else if (this.gamepad.right) 
          {
            this.direction = Config.Directions.RIGHT;
            this.body.setVelocityX(this.speed);
          }

          // Vertical movement
          if (this.gamepad.up) 
          {
            this.direction = Config.Directions.UP;
            this.body.setVelocityY(-this.speed);
          } 
          else if (this.gamepad.down) 
          {
            this.direction = Config.Directions.DOWN;
            this.body.setVelocityY(this.speed);
          }
        }
        
        if (this.direction == Config.Directions.LEFT)
        {
          this.setFlipX(true);
        }
        else if (this.direction == Config.Directions.RIGHT)
        {
          this.setFlipX(false);
        }

        // Normalize and scale the velocity so that sprite can't move faster along a diagonal
        this.body.velocity.normalize().scale(this.speed);      
      }
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
   * Adds item to player's inventory.
   * @param {Number} id 
   * @param {Number} type 
   * @param {Number} qty
   */
  inventoryAdd(id, type, qty)
  {
    var entry = this.inventory.find(a => a.id == id && a.itemType == type);
    if (entry)
    {
      entry.quantity += qty;
    }
    else
    {
      this.inventory.push({id:id, type:type,quantity:qty});
    }
  }

  /**
   * Reduces an item quantity in player's inventory.
   * @param {Number} id 
   */
  useItem(id)
  {
      var entry = this.inventory.find(a => a.id == id);
      if (entry)
      {
        if (entry.quantity > 0)
        {
          entry.quantity--;
        }
        else
        {
          let index = this.inventory.findIndex(a => a.id == id);
          this.inventory.splice(index, 1);
        }        
        return true;
      }

      return false;
  }

  /**
   * Checks for entry in player's inventory.
   * @param {Number} id 
   */
  hasItem(id)
  {
    return this.inventory.findIndex(a => a.id == id && a.quantity > 0) !== -1;
  }

  /**
   * @param {Number} id 
   * @param {Number} itemType 
   * @param {Number} value 
   * @param {Number} duration
   */
  collectItem(id, itemType, value, duration)
  {
    switch(itemType)
    {
      case Config.ItemTypes.INVULNERABLE:
        this.invulnerable = true; 
        this._buffTimer[itemType] = duration;       
      break;
      case Config.ItemTypes.DAMAGE_UP:
        this.strength += value; 
        this._buffTimer[item.itemType] = duration; 
      break;
      case Config.ItemTypes.STEALTH:
        this.alpha = value; 
        this._buffTimer[item.itemType] = duration; 
      break;
      case Config.ItemTypes.POTION:
         this.health += value;
         this.emit('health.change');
      break;
      case Config.ItemTypes.KEY:
        this.inventoryAdd(id, itemType, value);
      break;
    }
  }

  destroy() 
  {    
    this.emit('death');
    super.destroy();
  }
}
