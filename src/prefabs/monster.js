import Phaser from 'phaser';
import Config from '../settings';
import Utilx from '../helpers/utilx';
import GameSprite from './gamesprite';
import HealthBar from './healthbar';
import Bullet from './bullet';

export default class Monster extends GameSprite
{
  /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {String} id
   * @param {Object} data
   * @param {String} data.texture
   * @param {String} data.name
   * @param {Number} data.speed 
   * @param {Number} data.health 
   * @param {Number} data.strength 
   * @param {Boolean} data.shooter 
   * @param {Object[]} data.droppable
   * @param {Number} data.droppable.id
   * @param {Number} data.droppable.rate
   * @param {String} data.droppable.type
   * @param {Object} route
   * @param {Number} route.width 
   * @param {Number} route.height 
   */
  constructor(scene, x, y, id, data, route) 
  {
    let area = new Phaser.Geom.Rectangle(x, y, route.width, route.height);

    super(scene, area.centerX, area.centerY, data.texture, id);
    this.healthbar = new HealthBar(scene, area.centerX, area.centerY, data.health);
    this.speed = data.speed;
    super.health = data.health;
    this.strength = data.strength;
    this.shooter = data.shooter;
    this.droppable = data.droppable;
    this._chasing = false;
    this._zoning = false;
    this._places = Phaser.Utils.Array.Shuffle([0,1,2,3]);
    this._enemyDirection = null;
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
   * @param {Phaser.Physics.Arcade.Group} group 
   */
  setBulletGroup(group)
  {
    this._bullets = group;
  }
  
  _onPostDamageComplete()
  {
    this.idle();
  }

  _onAttackComplete(animation, frame)
  {
    if (animation.key.indexOf('attack') == -1) return;
    this.idle();
  }  

  /**
   * @param {Number} x 
   * @param {Number} y 
   */
  _onAttackTriggered(x, y)
  {
    if (this.shooter)
    {
      var bullet = this._bullets.get().setActive(true).setVisible(true);

      if (bullet)
      {
        bullet.fire(this, this.scene.player);
        // Add collider between bullet and player
        this.physics.add.collider(this.scene.player, bullet, this.scene);
      }
    }
  }

  _shooterRangeTest()
  {
    //TODO: implement shooter range check along directional path.
    return false;
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
        
    return Utilx.circleIntersect(px, py, radius, this.scene.player.x, this.scene.player.y, this.scene.player.body.width*0.75);
  }

  _meleeHitTest() 
  {
    if (!this.scene.player || !this.scene.player.alive) return false;
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
    var collided = Utilx.circleIntersect(px, py, radius, this.scene.player.x, this.scene.player.y, this.scene.player.body.radius);
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
    }
    else if (this.state == Config.PlayerStates.IDLE && this._timer <= 0)
    {
      this._places = Phaser.Utils.Array.Shuffle([0,1,2,3]);
      if (!this.route.contains(this.x, this.y))
      {
        if (this.route.x > this.x)
        {
          Phaser.Utils.Array.Remove(this._places, 3);
        }
        else if (this.route.right < this.x)
        {
          Phaser.Utils.Array.Remove(this._places, 1);
        }
        if (this.route.y > this.y)
        {
          Phaser.Utils.Array.Remove(this._places, Config.Directions.UP);
        }
        else if (this.route.bottom < this.y)
        {
          Phaser.Utils.Array.Remove(this._places, Config.Directions.DOWN);
        }
        this._timer = Phaser.Math.Between(Config.AI.CHANGE_INTERVAL_MIN, Config.AI.CHANGE_INTERVAL_MAX);
      }
      this.state = Config.PlayerStates.MOVE;
      Phaser.Utils.Array.Remove(this._places, this.direction);
      this.direction = Number(Phaser.Utils.Array.GetRandom(this._places));  
    }
    else if (this._chasing)
    {
      let inRange = this.shooter ? this._shooterRangeTest() : this._meleeRangeTest();
      if (inRange)
      {
        this.attack();
      }
      else
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
    }
    else if (this.state == Config.PlayerStates.MOVE && this.route.contains(this.x, this.y))
    {
      if (Phaser.Math.Between(1, 100) < Config.AI.IDLE_PROBABILITY)
      {
        this.idle();
      }
    }
    else 
    {      
      console.log('some other action', this._zoning, this._timer);
    }    
  }

  /**
   * @param {Number} time 
   * @param {Number} delta 
   */
  update(time, delta) 
  {    
    if (this.state == Config.PlayerStates.CORPSE || Utilx.isNull(this.body)) return;
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
    else if (this._chasing && this.state == Config.PlayerStates.MOVE)
    {
      this._timer -= delta;
      if(this._timer <= 0)
      {    
        this.decideNextAction();
      }      
    }
    if (this.state == Config.PlayerStates.ATTACK && !this.shooter)
    {
      this._meleeHitTest();
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
