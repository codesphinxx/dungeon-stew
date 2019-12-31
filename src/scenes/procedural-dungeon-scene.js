import Phaser from "phaser";
import Dungeon from "@mikewesthad/dungeon";
import Player from "../prefabs/player.js";
import Monster from '../prefabs/monster';
import TILES from "../tile-mapping.js";
import Config from '../config';
import Utilx from "../helpers/utilx.js";
import Hud from "../prefabs/hud.js";
import Collectible from "../prefabs/collectible.js";

/**
 * Scene that generates a new dungeon
 */
export default class DungeonScene extends Phaser.Scene 
{
  constructor() 
  {
    super({key:'dungeon', active:false});
    this.level = 0;
    this.keyHolder = null;
  }

  init()
  {
    var monsterCount = Phaser.Math.Between(1, 3);
    this.dungeonConfig = {
      width: 40,
      height: 40,
      doorPadding: 2,
      rooms: {
        width: { min: 7, max: 15, onlyOdd: true },
        height: { min: 7, max: 15, onlyOdd: true }
      },
      maxRooms: 6,
      collectibles:[
        Config.ItemTypes.KEY,
      ],
      monsters:monsterCount
    };
    var item = Phaser.Utils.Array.GetRandom([Config.ItemTypes.STEALTH,Config.ItemTypes.DAMAGE_UP,Config.ItemTypes.INVULNERABLE,Config.ItemTypes.LIFE,Config.ItemTypes.NONE]);
    this.dungeonConfig.collectibles.push(item);
  }

  create() 
  {
    this.level++;
    this.hasPlayerReachedStairs = false;
    
    this.maskImage = this.make.sprite({
      x: 0,
      y: 0,
      key: 'mask',
      add: false
    });
    
    //this.rootContainer = this.add.container(0, 0);
    //this.rootContainer.mask = new Phaser.Display.Masks.BitmapMask(this, this.maskImage);

    // Generate a random world with a few extra options:
    //  - Rooms should only have odd number dimensions so that they have a center tile.
    //  - Doors should be at least 2 tiles away from corners, so that we can place a corner tile on
    //    either side of the door location
    this.dungeon = new Dungeon(this.dungeonConfig);

    // Creating a blank tilemap with dimensions matching the dungeon
    const map = this.make.tilemap({
      tileWidth: 48,
      tileHeight: 48,
      width: this.dungeon.width,
      height: this.dungeon.height
    });
    const tileset = map.addTilesetImage("tiles", null, 48, 48, 1, 2); // 1px margin, 2px spacing
    this.groundLayer = map.createBlankDynamicLayer("Ground", tileset).fill(TILES.BLANK);
    this.stuffLayer = map.createBlankDynamicLayer("Stuff", tileset);
    //const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset).fill(TILES.BLANK);

    //this.tilemapVisibility = new TilemapVisibility(shadowLayer);
    
    //this.rootContainer.add(this.groundLayer);
    //this.rootContainer.add(this.stuffLayer);

    // Use the array of rooms generated to place tiles in the map
    // Note: using an arrow function here so that "this" still refers to our scene
    this.dungeon.rooms.forEach(room => {
      const { x, y, width, height, left, right, top, bottom } = room;

      // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
      // See "Weighted Randomize" example for more information on how to use weightedRandomize.
      this.groundLayer.weightedRandomize(x + 1, y + 1, width - 2, height - 2, TILES.FLOOR);

      // Place the room corners tiles
      this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
      this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
      this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
      this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

      // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
      this.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP);
      this.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM);
      this.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT);
      this.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT);

      // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
      // room's location
      var doors = room.getDoorLocations();
      for (var i = 0; i < doors.length; i++) 
      {
        if (doors[i].y === 0) {
          this.groundLayer.putTilesAt(TILES.DOOR.TOP, x + doors[i].x - 1, y + doors[i].y);
        } 
        else if (doors[i].y === room.height - 1) {
          this.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + doors[i].x - 1, y + doors[i].y);
        } 
        else if (doors[i].x === 0) {
          this.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + doors[i].x, y + doors[i].y - 1);
        } 
        else if (doors[i].x === room.width - 1) {
          this.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + doors[i].x, y + doors[i].y - 1);
        }
      }
    });

    // Separate out the rooms into:
    //  - The starting room (index = 0)
    //  - A random room to be designated as the end room (with stairs and nothing else)
    //  - An array of 90% of the remaining rooms, for placing random stuff (leaving 10% empty)
    var itemRooms = [];
    var monsterRooms = [];
    const rooms = this.dungeon.rooms.slice();
    const startRoom = rooms.shift();
    const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
    for(var i=0; i<this.dungeonConfig.monsters; i++)
    {
      monsterRooms.push(Phaser.Utils.Array.RemoveRandomElement(rooms));
    }
    for(i=0; i<this.dungeonConfig.collectibles.length; i++)
    {
      if (this.dungeonConfig.collectibles[i] == Config.ItemTypes.NONE) continue;
      itemRooms.push(Phaser.Utils.Array.RemoveRandomElement(rooms));
    }
    const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(0, rooms.length * 0.9);

    // Place the stairs
    this.stuffLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY);

    // Place stuff in the 90% "otherRooms"
    otherRooms.forEach(room => {
      var rand = Math.random();
      if (rand <= 0.25) 
      {
        // 25% chance of chest
        this.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
      } 
      else if (rand <= 0.5) 
      {
        // 50% chance of a pot anywhere in the room... except don't block a door!
        const x = Phaser.Math.Between(room.left + 2, room.right - 2);
        const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
        this.stuffLayer.weightedRandomize(x, y, 1, 1, TILES.POT);
      } 
      else 
      {
        // 25% of either 2 or 4 towers, depending on the room size
        if (room.height >= 9) 
        {
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2);
        } 
        else 
        {
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
        }
      }
    });

    // Not exactly correct for the tileset since there are more possible floor tiles, but this will
    // do for the example.
    this.groundLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);
    this.stuffLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);

    this.stuffLayer.setTileIndexCallback(TILES.STAIRS, (sprite) => {
      if (sprite instanceof Monster) return;
      if (String.IsNullOrEmpty(this.keyHolder)) return;

      this.stuffLayer.setTileIndexCallback(TILES.STAIRS, null);
      this.hasPlayerReachedStairs = true;
      this.player.freeze();
      const cam = this.cameras.main;
      cam.fade(250, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => {
        this.player.destroy();
        this.scene.restart();
      });
    });

    //Setup enemy group colliders
    this.collectibles = this.physics.add.group();

    //Setup enemy group colliders
    this.enemies = this.physics.add.group();
    this.physics.add.collider(this.enemies, this.stuffLayer);
    this.physics.add.collider(this.enemies, this.groundLayer, this.onEnemyWallContact, null, this);
    this.physics.add.collider(this.enemies, this.enemies, this.onEnemyFriendContact, null, this);

    for(i=0; i<monsterRooms.length; i++)
    {
      //Create enemy unit  
      var monsterRoom = monsterRooms[i];  
      var x = map.tileToWorldX(monsterRoom.centerX);
      var y = map.tileToWorldY(monsterRoom.centerY);
      Creator.createMonster(this, this.enemies, x, y, 'slime', 5, 'Slime');
    }
    for(i=0; i<this.dungeonConfig.collectibles.length; i++)
    {
      if (this.dungeonConfig.collectibles[i] == Config.ItemTypes.NONE) continue;

      //Create collectible item  
      var itemRoom = itemRooms[i]; 
      var x = map.tileToWorldX(itemRoom.centerX);
      var y = map.tileToWorldY(itemRoom.centerY);
      Creator.createItem(this, this.collectibles, this.dungeonConfig.collectibles[i], x, y, 'ui');
    }    
    
    // Place the player in the first room
    const playerRoom = startRoom;
    const x = map.tileToWorldX(playerRoom.centerX);
    const y = map.tileToWorldY(playerRoom.centerY);
    this.player = Creator.createPlayer(this, null, x, y, 'player', 'Hero');

    // Watch the player and tilemap layers for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.stuffLayer);
    this.physics.add.overlap(this.player, this.enemies, this.onPlayerEnemyContact, null, this);
    this.physics.add.overlap(this.player, this.collectibles, this.onPlayerItemContact, null, this);

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player);

    //this.rootContainer.add(this.player);

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
  }

  
}
