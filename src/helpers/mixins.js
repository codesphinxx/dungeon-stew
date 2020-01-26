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

/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */

// Private array of chars to use
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  
Math.uuid = function (len, radix) {
  var chars = CHARS, uuid = [], i;
  radix = radix || chars.length;

  if (len) 
  {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } 
  else 
  {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) 
    {
      if (!uuid[i]) 
      {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
};

// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
Math.uuidFast = function() {
  var chars = CHARS, uuid = new Array(36), rnd=0, r;
  for (var i = 0; i < 36; i++) 
  {
    if (i==8 || i==13 ||  i==18 || i==23) 
    {
      uuid[i] = '-';
    } 
    else if (i==14) 
    {
      uuid[i] = '4';
    } 
    else 
    {
      if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
      r = rnd & 0xf;
      rnd = rnd >> 4;
      uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
    }
  }
  return uuid.join('');
};

// A more compact, but less performant, RFC4122v4 solution:
Math.uuidCompact = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};