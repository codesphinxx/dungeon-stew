import Phaser from 'phaser';
import Player from './prefabs/player';

class Engine
{
    constructor()
    {
        if (!Engine.instance)
        {
            this.io = null;
            this.scene = null;
            this.player = null;
            this.monsters = null;
            this.enemies = null;

            Engine.instance = this;
        }

        return Engine.instance;
    }

    /**
     * @param {Phaser.Scene} scene 
     * @param {Player} scene 
     * @param {Phaser.Physics.Arcade.Group} monsters 
     * @param {Phaser.Physics.Arcade.Group} enemies 
     */
    init(scene, player, monsters, enemies)
    {
        this.scene = scene;
        this.player = player;
        this.monsters = monsters;
        this.enemies = enemies;
    }

    /**
     * @param {Number} time 
     * @param {Number} delta 
     */
    update(time, delta)
    {

    }

    gameOver()
    {
        
    }

    destroy()
    {
        
    }
}

const instance = new Engine();
module.exports = instance;