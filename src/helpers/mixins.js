import Player from '../prefabs/player';
import Monster from '../prefabs/monster';
import Collectible from "../prefabs/collectible";
import $Monsters from '../data/monsters';
import $Items from '../data/items';

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
        }
    }
} 
Object.assign(Phaser.Scene.prototype, SceneMixins);
