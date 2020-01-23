import Phaser from 'phaser';
import PlayerData from "./models/playerData";

class GameManager
{
    static get EVENTS()
    {
        return {
            TOP_LEFT:1,
            TOP_CENTER:2,
            TOP_RIGHT:3,
            MID_LEFT:4,
            MID_CENTER:5,
            MID_RIGHT:6,
            BOTTOM_LEFT:7,
            BOTTOM_CENTER:8,
            BOTTOM_RIGHT:9
        };
    }

    constructor()
    {
        if (!GameManager.instance)
        {
            this.$gameData = {
                /**
                 * @type {String}
                 */            
                player: null,
                /**
                 * @type {PlayerData}
                 */            
                progress: null,
                /**
                 * @type {Boolean}
                 */ 
                sound: true,
                /**
                 * @type {Boolean}
                 */ 
                vibrate: true
            };
            /**
             * @type {Phaser.Input.Gamepad.Gamepad}
             */
            this.controller = null;
            this.$gameVariables = {};
            this._handlers = {};
            this.gamepadConnected = false;
            this.isAuthenticated = false;

            GameManager.instance = this;
        }

        return GameManager.instance;
    }

    init()
    {
        window.$Monsters = [];
        window.$Items = [];
        window.$Weapons = [];
        window.$Armor = [];
        window.$Npc = [];

        this.$gameData.sound = Boolean(JSON.parse(localStorage.getItem('ds-sound') || 'true'));
        this.$gameData.vibrate = Boolean(JSON.parse(localStorage.getItem('ds-vibrate')  || 'true'));

        let progress = localStorage.getItem('ds-data');
        if (progress)
        {
            this.$gameData.progress = Object.assign(new PlayData, JSON.parse(progress));
        }
        this.$gameData.player = localStorage.getItem('ds-player');
        if (String.IsNullOrEmpty(this.$gameData.player))
        {
            this.$gameData.player = Phaser.Utils.String.UUID();
            localStorage.setItem('ds-player', this.$gameData.player);
        }
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

    saveGame()
    {
        if (!this.$gameData) return false;
        if (this.$gameData.sound !== null && this.$gameData.sound !== undefined)
        {
            localStorage.setItem('ds-sound', JSON.stringify(this.$gameData.sound));
        }
        if (this.$gameData.vibrate !== null && this.$gameData.vibrate !== undefined)
        {
            localStorage.setItem('ds-vibrate', JSON.stringify(this.$gameData.vibrate));
        }
        if (this.$gameData.progress !== null && this.$gameData.progress !== undefined)
        {
            localStorage.setItem('ds-data', JSON.stringify(this.$gameData.progress));
        }

        if (!this.isAuthenticated) return;	
        
        let gameData = JSON.stringify(this.$gameData);
        let _xhttp = new XMLHttpRequest();
        _xhttp.onreadystatechange = function() {
            if (_xhttp.readyState === XMLHttpRequest.DONE && _xhttp.status !== 200)
            {
                //TODO: notify user
            }
        };
        _xhttp.open('POST', __CLOUD_SAVE_URI__, true);
        _xhttp.setRequestHeader('Content-Type', 'application/json');        
        _xhttp.send(JSON.stringify(gameData));
    }

    destroy()
    {
        
    }
}

const instance = new GameManager();
export default instance;