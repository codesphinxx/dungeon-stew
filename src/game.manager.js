import Phaser from 'phaser';
export * from './helpers/mixins';
import Utilx from './helpers/utilx';
import BootScene from "./scenes/boot-scene.js";
import TitleScene from "./scenes/title-scene";
import GameoverScene from "./scenes/gameover-scene";
import DungeonScene from "./scenes/dungeon-scene";
import settings from './settings';

class GameManager
{
    constructor()
    {
        if (!GameManager.instance)
        {
            this.game = null;
            this._handlers = {};

            GameManager.instance = this;
        }

        return GameManager.instance;
    }

    /**
     * @param {String} event 
     * @param {Function} callback 
     */
    on(event, callback)
    {
        if (this._handlers[event])
        {
            this._handlers[event] = null;
            delete this._handlers[event];
        }
        this._handlers[event] = callback;
    }

    /**
     * @param {String} event 
     * @param {Function} callback 
     */
    once(event, callback)
    {
        var self = this;
        this._handlers[event] = function(){ 
            callback(); 
            self._handlers[event] = null;
            delete self._handlers[event];
        };
    } 

    /**
     * @param {String} event 
     */
    remove(event)
    {
        if (this._handlers[event])
        {
            this._handlers[event] = null;
            delete this._handlers[event];
        }
    }

    init()
    {
        window.$gameVariables = {};
        window.$gameData = {};
        window.$Monsters = [];
        window.$Items = [];
        window.$Weapons = [];
        window.$Armor = [];
        window.$Npc = [];

        window._IS_AUTHENTICATED = false;

        const config = {
            type: Phaser.AUTO,            
            width: window.innerWidth,
            height: window.innerHeight,
            version: __VERSION__,
            title:"Dungeon Stew",
            pixelArt: true,
            backgroundColor: "#000",
            parent: "game-container",
            disableContextMenu:true,
            //resolution: window.devicePixelRatio,
            scene: [BootScene, TitleScene, DungeonScene, GameoverScene],
            scale: {
              mode: Phaser.Scale.FIT,
              autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
              default: "arcade",
              arcade: {
                gravity: { y: 0 },
                debug: false
              }
            }
        };

        // change layout on mobile
        if (/Android|webOS|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent))
        {
            config.width = settings.VIEWPORT.WIDTH;
            config.height = settings.VIEWPORT.HEIGHT;
        }
          
        const game = new Phaser.Game(config);
        Utilx.AttachStatPanel(game, 1);
    }

    save()
    {
        
    }

    destroy()
    {
        
    }
}

const instance = new GameManager();
export default instance;