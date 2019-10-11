import Phaser from 'phaser';
import Player from "../prefabs/player.js";
import Monster from '../prefabs/monster';
import Config from '../config';
import MathHelper from '../helpers/math';
import Creator from "../helpers/creator.js";
import Hud from "../prefabs/hud.js";
import Collectible from "../prefabs/collectible.js";


export default class DungeonScene extends Phaser.Scene 
{
  constructor() 
  {
    super({key:'dungeon', active:false});
  }

  preload() 
  {
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town.json");
  }

  create() 
  {
    const map = this.make.tilemap({ key:"map"});
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10);

    //Setup enemy group colliders
    this.collectibles = this.physics.add.group();

    //Setup enemy group colliders
    this.enemies = this.physics.add.group();
    this.physics.add.collider(this.enemies, worldLayer);
    this.physics.add.collider(this.enemies, this.enemies, this.onEnemyFriendContact, null, this);
    //this.physics.add.collider(this.enemies, this.groundLayer, this.onEnemyWallContact, null, this);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    
    // Place the player in the center of the map
    this.player = Creator.createPlayer(this, null, spawnPoint.x, spawnPoint.y, 'player', 'Hero');

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player);     

    // Watch the player and tilemap layers for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, worldLayer);
    //this.physics.add.collider(this.player, this.stuffLayer);
    this.physics.add.overlap(this.player, this.enemies, this.onPlayerEnemyContact, null, this);
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

    this.circle = new Phaser.Geom.Circle(0, 0, 0);
    this.graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });

    this.hud = new Hud(this, 0, 0, {atlas:'ui',left:'left',right:'right',up:'up',down:'down',keyA:'keyA'});
    this.hud.syncLife(this.player.health); 
    this.hud.setDepth(11);

    this.player.on('healthchange', () =>{
      this.hud.syncLife(this.player.health);
    });
  }

  update(time, delta) 
  {
    this.player.update(time, delta);

    this.enemies.children.iterate(function(enemy) {    
      enemy.update(time, delta);
    });

    this.collectibles.children.iterate(function(item) {    
      item.update(time, delta);
    });

    if (this.player.state == Config.PlayerStates.ATTACK)
    {
      this.attackHitTest();
    }
  }

  attackHitTest() 
  {
    //var currentFrame = this.player.anims.currentFrame.index;
    //var totalFrames = this.player.anims.getTotalFrames();
    //var modifier = currentFrame / totalFrames;
    
    //loop through enemies
    var radius = this.player.body.width;
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
    this.enemies.children.iterate((enemy) => {    
      if (enemy.state == Config.PlayerStates.DAMAGE) return;

      var collided = MathHelper.CircleIntersect(px, py, radius, enemy.x, enemy.y, enemy.body.width*0.5);
      if (collided)
      {
        enemy.damage(this.player, this.player.strength);        
      }
    });
    /*this.graphics.clear();
    this.circle.setEmpty();
    this.circle.x = px;
    this.circle.y = py;
    this.circle.radius = radius;        
    this.graphics.lineStyle(2, 0x00ff00);
    this.graphics.strokeCircleShape(this.circle);*/
  }

  /**
   * @param {Player} player 
   * @param {Monster} enemy 
   */
  onPlayerEnemyContact(player, enemy)
  {    
    this.player.damage(enemy, enemy.strength);
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
    enemy.idle();
  }
}
