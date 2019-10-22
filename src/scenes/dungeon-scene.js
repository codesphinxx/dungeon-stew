import Phaser from 'phaser';
import Player from "../prefabs/player.js";
import Monster from '../prefabs/monster';
import Config from '../config';
import Utilx from '../helpers/utilx';
import Hud from "../prefabs/hud.js";
import Collectible from "../prefabs/collectible.js";


export default class DungeonScene extends Phaser.Scene 
{
  constructor() 
  {
    super({key:'dungeon', active:false});
    /**
     * @type {Player}
     */
    this.player = null;
  }

  preload() 
  {
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town.json");
  }

  create() 
  {
    const map = this.make.tilemap({ key:"map"});
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
    
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });
    
    //Setup enemy group colliders
    this.collectibles = this.physics.add.group();
    const chestLayer = map.getObjectLayer('ChestLayer')['objects'];
    chestLayer.forEach(entry => {
      this.build.item(this, this.collectibles, entry.x, entry.y, Number(entry.type));
    });

    //Setup enemy group colliders
    this.monsters = this.physics.add.group();
    this.physics.add.collider(this.monsters, worldLayer, this.onEnemyWallContact, null, this);
    this.physics.add.collider(this.monsters, this.monsters, this.onEnemyFriendContact, null, this);
    //this.physics.add.collider(this.monsters, worldObjectLayer, this.onEnemyWallContact, null, this);

    const monsterLayer = map.getObjectLayer('MonsterLayer')['objects'];
    monsterLayer.forEach(entry => {
      this.build.monster(this, this.monsters, entry.x, entry.y, Number(entry.type), entry.width, entry.height);
    });
    
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    
    // Place the player in the center of the map
    this.player = this.build.player(this, null, spawnPoint.x, spawnPoint.y, 'player', 'Hero', Phaser.Utils.String.UUID());
    
    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player);     

    // Watch the player and tilemap layers for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, worldLayer);
    //this.physics.add.collider(this.player, worldObjectLayer);
    this.physics.add.overlap(this.player, this.monsters, this.onPlayerEnemyContact, null, this);
    this.physics.add.overlap(this.player, this.collectibles, this.onPlayerItemContact, null, this);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, this.height - 80, `Find the stairs. Go deeper.\nCurrent level: ${this.level}`, {
        font: "12px pixelmix",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0); 

    this.hud = new Hud(this, 0, 0, {atlas:'ui',left:'left',right:'right',up:'up',down:'down',keyA:'keyA'});
    this.hud.syncLife(this.player.health); 
    
    this.player.on('health.change', () =>{
      this.hud.syncLife(this.player.health);
    });

    worldLayer.setDepth(2);
    aboveLayer.setDepth(5);
    this.player.setDepth(2);
    this.monsters.setDepth(2);
    this.collectibles.setDepth(1);
    this.hud.setDepth(6);
    this.monsters.children.iterate(function(monster) {    
      monster.healthbar.setDepth(2);
    });

    //this.circle = new Phaser.Geom.Circle(0, 0, this.player.body.width);
    //this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});
  }

  update(time, delta) 
  {
    this.player.update(time, delta);

    this.monsters.children.iterate(function(monster) {    
      monster.update(time, delta);
    });

    this.collectibles.children.iterate(function(item) {    
      item.update(time, delta);
    });

    if (this.player.state == Config.PlayerStates.ATTACK)
    {
      this.meleeHitTest();
    }
  }

  meleeHitTest() 
  {
    var currentFrame = this.player.anims.currentFrame.index;
    var totalFrames = this.player.anims.getTotalFrames();
    var modifier = currentFrame / totalFrames;
    //console.log('r:', totalFrames, currentFrame, modifier, this.player.body.width * modifier);
    //loop through enemies
    var radius = this.player.body.width * modifier;
    var px = this.player.body.center.x;
    var py = this.player.body.center.y;
    if (this.player.direction == Config.Directions.DOWN)
    {
      py += radius; 
    }
    else if (this.player.direction == Config.Directions.UP)
    {
      py -= radius; 
    }
    else if (this.player.direction == Config.Directions.LEFT)
    {
      px -= radius; 
    }
    else if (this.player.direction == Config.Directions.RIGHT)
    {
      px += radius; 
    }
    let meleeConnected = false;

    this.monsters.children.iterate((enemy) => {    
      if (enemy.state == Config.PlayerStates.DAMAGE) return;
      var collided = Utilx.CircleIntersect(px, py, radius, enemy.body.center.x, enemy.body.center.y, enemy.body.radius);
      if (collided)
      {
        enemy.damage(this.player, this.player.strength);   
        meleeConnected = true;     
      }
    });
    /*this.graphics.clear();
    this.circle.setEmpty();
    this.circle.x = px;
    this.circle.y = py;
    this.circle.radius = radius;        
    this.graphics.lineStyle(2, 0x00ff00);
    this.graphics.strokeCircleShape(this.circle);*/
    return meleeConnected;
  }

  /**
   * @param {Player} player 
   * @param {Monster} enemy 
   */
  onPlayerEnemyContact(player, enemy)
  {    
    if (!player.alive || player.state == Config.PlayerStates.DAMAGE) return;
    player.damage(enemy, enemy.strength);
    enemy.idle();
  }

  /**
   * @param {Player} player 
   * @param {Collectible} item 
   */
  onPlayerItemContact(player, item)
  {    
    item.collect(player);
  }

  /**
   * @param {Monster} enemy 
   * @param {Monster} friend 
   */
  onEnemyFriendContact(enemy, friend)
  {
    enemy.decideNextAction(enemy.direction);
  }

  /**
   * @param {Monster} enemy 
   * @param {Phaser.Physics.Arcade.StaticBody} wall 
   */
  onEnemyWallContact(enemy, wall)
  {    
    if (enemy.state == Config.PlayerStates.DAMAGE) return;
    
    enemy.idle();
  }
}
