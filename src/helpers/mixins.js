import NPC from '../prefabs/npc';
import Player from '../prefabs/player';
import Monster from '../prefabs/monster';
import Collectible from "../prefabs/collectible";

let SceneMixins = {
    isMobile()
    {
        return (/Android|webOS|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent));
    },
    build: {
        /**
         * @param {Phaser.Scene} scene 
         * @param {Phaser.Physics.Arcade.Group} physicsGroup
         * @param {Number} id
         * @param {Number} x 
         * @param {Number} y 
         */
        item(scene, physicsGroup, x, y, id)
        {
            var data = $Items[id];
            var item = new Collectible(scene, x, y, data, Phaser.Utils.String.UUID());
            if (physicsGroup != null && physicsGroup != undefined)
            {
                physicsGroup.add(item);
            }
            return item;
        },
        /**
         * @param {Phaser.Scene} scene 
         * @param {Phaser.Physics.Arcade.Group} physicsGroup
         * @param {Phaser.Physics.Arcade.Group} bulletGroup
         * @param {Number} x 
         * @param {Number} y 
         * @param {Number} id
         * @param {Number} routeWidth
         * @param {Number} routeHeight
         */
        monster(scene, physicsGroup, x, y, id, routeWidth, routeHeight, bulletGroup)
        {
            var data = $Monsters[id];
            var monster = new Monster(scene, x, y, Phaser.Utils.String.UUID(), data, { width: routeWidth, height: routeHeight });
            if (physicsGroup != null && physicsGroup != undefined)
            {
                physicsGroup.add(monster);
            }
            if (data.shooter && bulletGroup != null)
            {
                monster.setBulletGroup(bulletGroup);
            }
            return monster;
        },
        /**
         * @param {Phaser.Scene} scene 
         * @param {Phaser.Physics.Arcade.Group} physicsGroup
         * @param {Number} x 
         * @param {Number} y 
         * @param {String} id
         * @param {String} name
         * @param {String} texture
         */
        player(scene, physicsGroup, x, y, texture, name, id)
        {
            var player = new Player(scene, x, y, {key:texture,name:name, id:id});
            if (physicsGroup != null && physicsGroup != undefined)
            {
              physicsGroup.add(player);
            }
            return player;
        },
        /**
         * @param {Phaser.Scene} scene 
         * @param {Phaser.Physics.Arcade.Group} physicsGroup
         * @param {Number} x 
         * @param {Number} y 
         * @param {Number} id
         */
        npc(scene, physicsGroup, x, y, id)
        {
            var data = $Npc[id];
            var npc = new NPC(scene, x, y, data);
            if (physicsGroup != null && physicsGroup != undefined)
            {
              physicsGroup.add(npc);
            }
            return npc;
        }
    }
} 
Object.assign(Phaser.Scene.prototype, SceneMixins);

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

String.prototype.replaceAll = function (searchStr, replaceStr) {
  var str = this;

  // escape regexp special characters in search string
  searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
};

/**
 * @param {String} str
 */
String.IsNullOrEmpty = function(str)
{
    if (str === null || str === undefined)
        return true;

    var text = str.replace('/ /g', '');

    return text.length === 0;
};

if (!String.format)
{
	String.format = function(format, ...args) 
  {
      var str = format;
      return str.replace(String.regex, function(item) {
          var intVal = parseInt(item.substring(1, item.length - 1));
          var replace;
          if (intVal >= 0) 
          {
              replace = args[intVal];
          } 
          else if (intVal === -1) 
          {
              replace = "{";
          } 
          else if (intVal === -2) 
          {
              replace = "}";
          }
          else 
          {
              replace = "";
          }
          return replace;
      });
  };
    
  String.regex = function() {
      return new RegExp("{-?[0-9]+}", "g");
  };
}