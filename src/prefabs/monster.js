import Phaser from 'phaser';
import Config from '../config';
import Utilx from '../helpers/utilx';
import GameSprite from './gamesprite';
import HealthBar from './healthbar';

export default class Monster extends GameSprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} data
   * @param {Number} data.id
   * @param {String} data.texture
   * @param {String} data.name
   * @param {Number} data.speed 
   * @param {Number} data.health 
   * @param {Number} data.strength 
   * @param {Object} route
   * @param {Number} route.width 
   * @param {Number} route.height 
   */
  constructor(scene, x, y, data, route) 
  {
    super(scene, x, y, data.texture, data.id);
    this.speed = data.speed;
    super.health = data.health;
    this.healthbar = new HealthBar(scene, x, y, data.health);

    this._chasing = false;
    this._places = [0,1,2,3];
    this._enemyDirection = null;
    this._decisionTimer = Config.AI.CHANGE_INTERVAL_MIN;
    this.route = new Phaser.Geom.Rectangle(x, y, route.width, route.height);
    this.setTitle(data.name);
  }  

  get health()
  {
    return super.health;
  }

  set health(value)
  {    
    super.health = value;
    this.healthbar.value = super.health;
  }

  /**
   * @param {String} animKey 
   */
  _onPostAttackComplete(animKey)
  {
    if(this.alive && animKey.indexOf('hit') != -1)
    {
      this.chase();
    }
  }

  damage(enemy, dmg = 1)
  {    
    super.damage(enemy, dmg);
    this._enemyDirection = enemy.direction;
  }

  chase()
  {
    this._chasing = true;
    let pointer = {x:this.scene.player.x, y:this.scene.player.y};
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
    this._decisionTimer = Config.AI.CHANGE_INTERVAL_MAX;
  }

  idle()
  {
    if (this._health == 0) return;

    this.state = Config.PlayerStates.IDLE;
    this._decisionTimer = Config.AI.IDLE_DURATION;
    this._places = Phaser.Utils.Array.Remove([0,1,2,3], this.direction);
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
      this._decisionTimer = Phaser.Math.Between(Config.AI.CHANGE_INTERVAL_MIN, Config.AI.CHANGE_INTERVAL_MAX);
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
    if (this.state == Config.PlayerStates.CORPSE || Utilx.IsNull(this.body)) return;

    if (this.state == Config.PlayerStates.IDLE || this.state == Config.PlayerStates.MOVE)
    {
      this._decisionTimer -= delta;
      if(this._decisionTimer <= 0)
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

    this.healthbar.spriteX = this.x - (this.healthbar.width * 0.5);
    this.healthbar.spriteY = this.y - (this.height * 0.75);
    this.title.y = this.healthbar.y - (this.title.height * 1.25);
    this.updateFlash();
  }

  destroy()
  {
    this.healthbar.destroy();
    super.destroy();
  }
}
