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

    this.gamepad = {
      up: false,
      down: false,
      left: false,
      right: false
    };
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
    console.log('attack.complete:', this.state);
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
      console.log('player.state:', this.state);
      //if (this.state != Config.PlayerStates.DAMAGE) 
      {
        // Stop any previous movement from the last frame
        this.body.setVelocity(0);

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

  triggerInteraction()
  {
    if (!this.alive) return;
    let x = 0, y = 0, offset = 2;

    if (this.direction == Config.Directions.DOWN)
    {      
      y = this.body.bottom + offset;
      x = this.body.center.x;
    }
    else if (this.direction == Config.Directions.LEFT)
    {
      y = this.body.center.y;
      x = this.body.left - offset;
    }
    else if (this.direction == Config.Directions.RIGHT)
    {
      y = this.body.center.y;
      x = this.body.right + offset;
    }
    else if (this.direction == Config.Directions.UP)
    {
      y = this.body.top;
      x = this.body.center.x;
    }
    this.emit('interaction.check', x, y, this.direction);
  }

  triggerInventory()
  {
    if (!this.alive) return;
    this.emit('inventory.open');
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
