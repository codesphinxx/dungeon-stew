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
    let area = new Phaser.Geom.Rectangle(x, y, route.width, route.height);

    super(scene, area.centerX, area.centerY, data.texture, data.id);
    this.healthbar = new HealthBar(scene, area.centerX, area.centerY, data.health);
    this.speed = data.speed;
    super.health = data.health;
    this.strength = data.strength;
    this._chasing = false;
    this._zoning = false;
    this._places = Phaser.Utils.Array.Shuffle([0,1,2,3]);
    this._enemyDirection = null;
    this.identifier = Phaser.Utils.String.UUID();
    this.setTitle(data.name);
    
    this.route = area;
    this.direction = this._places[0];
    this._timer = Phaser.Math.Between(Config.AI.CHANGE_INTERVAL_MIN, Config.AI.CHANGE_INTERVAL_MAX);
    this.state = Phaser.Math.Between(1, 100) < Config.AI.IDLE_PROBABILITY ? Config.PlayerStates.IDLE : Config.PlayerStates.MOVE;
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
    this.idle();
  }

  _meleeRangeTest() 
  {
    if (!this.scene.player) return false;
    if (!this.scene.player.alive) return false;
    if (!this.state == Config.PlayerStates.ATTACK) return false;
    if (this.scene.player.state === Config.PlayerStates.DAMAGE) return false;

    var radius = this.body.radius;
    var px = this.body.center.x;
    var py = this.body.center.y;
    if (this.direction == Config.Directions.DOWN)
    {
      py += radius; 
    }
    else if (this.direction == Config.Directions.UP)
    {
      py -= radius; 
    }
    else if (this.direction == Config.Directions.LEFT)
    {
      px -= radius; 
    }
    else if (this.direction == Config.Directions.RIGHT)
    {
      px += radius; 
    }
        
    return Utilx.CircleIntersect(px, py, radius, this.scene.player.x, this.scene.player.y, this.scene.player.body.width*0.75);
  }

  _meleeHitTest() 
  {
    if (!this.scene.player) return false;
    if (!this.scene.player.alive) return false;
    if (this.scene.player.state === Config.PlayerStates.DAMAGE) return false;

    var radius = this.body.radius;
    var px = this.body.center.x;
    var py = this.body.center.y;
    if (this.direction == Config.Directions.DOWN)
    {
      py += radius; 
    }
    else if (this.direction == Config.Directions.UP)
    {
      py -= radius; 
    }
    else if (this.direction == Config.Directions.LEFT)
    {
      px -= radius; 
    }
    else if (this.direction == Config.Directions.RIGHT)
    {
      px += radius; 
    }
    var collided = Utilx.CircleIntersect(px, py, radius, this.scene.player.x, this.scene.player.y, this.scene.player.body.width*0.5);
    if (collided)
    {
      this.scene.player.damage(this, this.strength);       
    }
  }

  damage(enemy, dmg = 1)
  {    
    super.damage(enemy, dmg);
    this._enemyDirection = enemy.direction;
  }

  idle()
  {
    if (!this.alive) return;

    this.body.setVelocity(0);
    this.state = Config.PlayerStates.IDLE;
    this._timer = Config.AI.IDLE_DURATION;
  }

  decideNextAction(stage = null)
  {   
    if (this.state == Config.PlayerStates.DAMAGE || this._health == 0) return;
    this._zoning = !this.route.contains(this.x, this.y);
    this._chasing = false;
    if (this.scene.player && this.scene.player.alive)
    {
      this._chasing = this.route.contains(this.scene.player.x, this.scene.player.y);
    }
    if (stage == 1)
    {
      this._timer = 0;
      this.state = Config.PlayerStates.IDLE;
    }
    if (this.state == Config.PlayerStates.MOVE && !this.route.contains(this.x, this.y))
    {
      this.idle();
      console.log('moving to idle');
    }
    else if (this.state == Config.PlayerStates.IDLE && this._timer <= 0)
    {
      this._places = Phaser.Utils.Array.Shuffle([0,1,2,3]);
      if (!this.route.contains(this.x, this.y))
      {
        if (this.route.x > this.x)
        {
          Phaser.Utils.Array.Remove(this._places, 3);
          console.log('outside remove left', this._places);
        }
        else if (this.route.right < this.x)
        {
          Phaser.Utils.Array.Remove(this._places, 1);
          console.log('outside remove right', this._places);
        }
        if (this.route.y > this.y)
        {
          Phaser.Utils.Array.Remove(this._places, Config.Directions.UP);
          console.log('outside remove up', this._places);
        }
        else if (this.route.bottom < this.y)
        {
          Phaser.Utils.Array.Remove(this._places, Config.Directions.DOWN);
          console.log('outside remove down', this._places);
        }
        this._timer = Phaser.Math.Between(Config.AI.CHANGE_INTERVAL_MIN, Config.AI.CHANGE_INTERVAL_MAX);
      }
      this.state = Config.PlayerStates.MOVE;
      Phaser.Utils.Array.Remove(this._places, this.direction);
      this.direction = Number(Phaser.Utils.Array.GetRandom(this._places));  
      console.log('direction', this.direction, this._places, this._zoning);
    }
    else if (this.state == Config.PlayerStates.MOVE && this.route.contains(this.x, this.y))
    {
      if (Phaser.Math.Between(1, 100) < Config.AI.IDLE_PROBABILITY)
      {
        this.idle();
        console.log('change within area');
      }
    }
    else if (this._chasing)
    {
      /*
      let inRange = this._meleeRangeTest();
      if (inRange)
      {
        this.attack();
      }
      else if (this._chasing)
      {
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
        this.state = Config.PlayerStates.MOVE;
        this._timer = Config.AI.CHASE_INTERVAL;
      }
      else
      {
        var idle = Phaser.Math.Between(1, 100) < Config.AI.IDLE_PROBABILITY ? true : false;
        this._places = Phaser.Utils.Array.Shuffle([0,1,2,3]);
        this._places = Phaser.Utils.Array.Remove(this._places, this.direction);
        var nDirection = Phaser.Utils.Array.GetRandom(this._places);      

        if (this.state == Config.PlayerStates.IDLE || !idle)
        {        
          this._timer = Phaser.Math.Between(Config.AI.CHANGE_INTERVAL_MIN, Config.AI.CHANGE_INTERVAL_MAX);
          this.state = Config.PlayerStates.MOVE;
          this.direction = nDirection;
        }
        else if (idle)
        {
          this.idle();
          this.state = Config.PlayerStates.IDLE;
          if (Phaser.Math.Between(1, 100) < Config.AI.LOOK_CHANGE_PROBABILITY) this.direction = nDirection;
        }  
        this._places = Phaser.Utils.Array.Shuffle([0,1,2,3]);
      }*/
    }
    else 
    {      
      console.log('some other action', this._zoning, this._timer);
    }    
  }

  update(time, delta) 
  {    
    if (this.state == Config.PlayerStates.CORPSE || Utilx.IsNull(this.body)) return;
    if (this._zoning)
    {
      this._timer -= delta;
      this._zoning = !this.route.contains(this.x, this.y);
      if(this._timer <= 0)
      {       
        this.decideNextAction();
      }
    }
    else if (this.state == Config.PlayerStates.IDLE)
    {
      this._timer -= delta;
      if(this._timer <= 0)
      {       
        this.decideNextAction();
      }      
    }
    else if (this.state == Config.PlayerStates.MOVE && !this.route.contains(this.x, this.y))
    {
      this.decideNextAction();      
    }
    else if (this.state == Config.PlayerStates.ATTACK)
    {
      this._meleeHitTest();
    }
    else
    {
      //this._zoning = !this.route.contains(this.x, this.y);
      //console.log('some other update', this.state, this.direction);
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
