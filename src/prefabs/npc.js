import Phaser from 'phaser';
import Config from '../config';
import Utilx from '../helpers/utilx';
import GameSprite from './gamesprite';
import HealthBar from './healthbar';

export default class NPC extends GameSprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} data 
   * @param {String} data.key
   * @param {String} data.name
   * @param {Number} data.speed
   * @param {Number} data.idle
   * @param {Object[]} data.places
   * @param {Number} data.places.duration
   * @param {Number} data.places.direction
   * @param {Object[]} data.conversation
   */
  constructor(scene, x, y, data) 
  {
    super(scene, x, y, data.key);
    this.speed = data.speed;
    super.health = 1;
    this._idle = data.idle;
    this._places = data.places;
    this._current = data.places[0];
    this._timer = this._current.duration;
    this.conversation = data.conversation;
    this.setName(data.name);
  }  

  damage(enemy, dmg = 0)
  {    
    super.damage(enemy, 0);
  }

  onDeath()
  {
    
  }

  idle()
  {
    this.state = Config.PlayerStates.IDLE;
    this._timer = this.data.values.idle;
    this._places = Utilx.RemoveItem([0,1,2,3], this.direction);
  }

  /**
   * @param {Number} dir 
   */
  decideNextAction(dir = null)
  {   
    if (this.state == Config.PlayerStates.DAMAGE || this._health == 0) return;

    this._chasing = false;
    var idle = Phaser.Math.Between(1, 100) < Config.AI.IDLE_PROBABILITY ? true : false;
    var nDirection = Phaser.Utils.Array.GetRandom(this._places);

    if (this.state == Config.PlayerStates.IDLE || !idle)
    {
      this._timer = Phaser.Math.Between(Config.AI.CHANGE_INTERVAL_MIN, Config.AI.CHANGE_INTERVAL_MAX);
      this.state = Config.PlayerStates.MOVE;
      this.direction = nDirection;
    }
    else if (idle)
    {
      this.state = Config.PlayerStates.IDLE;
      if (Phaser.Math.Between(1, 100) < Config.AI.LOOK_CHANGE_PROBABILITY) this.direction = nDirection;
    }  
    this._places = Phaser.Utils.Array.Shuffle([0,1,2,3]);   
  }

  update(time, delta) 
  {    
    if (this.state == Config.PlayerStates.IDLE || this.state == Config.PlayerStates.MOVE)
    {
      this._timer -= delta;
      if(this._timer <= 0)
      {        
        this.decideNextAction();
      }      
    }

    if (this.state != Config.PlayerStates.DAMAGE)
    {
      if (this.direction == Config.Directions.LEFT)
      {
        this.setFlipX(true);
      }
      else if (this.direction == Config.Directions.RIGHT)
      {
        this.setFlipX(false);
      }
    }
    if (this.state == Config.PlayerStates.MOVE)
    {
      // Stop any previous movement from the last frame
      this.body.setVelocity(0);

      // Horizontal movement
      if (this.direction == Config.Directions.LEFT) 
      {
        this.body.setVelocityX(-this.speed);
      } 
      else if (this.direction == Config.Directions.RIGHT) 
      {
        this.body.setVelocityX(this.speed);
      }

      // Vertical movement
      if (this.direction == Config.Directions.UP) 
      {
        this.body.setVelocityY(-this.speed);
      } 
      else if (this.direction == Config.Directions.DOWN) 
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
        this.anims.play(this.key + "-idle", true);
      }
    }
    
    super.update();
  }
}
