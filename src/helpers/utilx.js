import Stats from 'stats.js';
import Phaser from 'phaser';

export default class Utilx
{
    constructor()
    {
        throw new Error('Statis class cannot be initialized');
    }

    /**
     * @function Utilx.deepCopy
     * @param {Object} json 
     */
    static deepCopy (json) 
    {
        return JSON.parse(JSON.stringify(json));
    }

    /**
     * @function Utilx.MergeObject
     * @param {Object} target 
     * @param {Object} modifier 
     */
    static MergeObject (target, modifier) 
    {
        if (modifier==null || modifier==undefined) return target;
        for (var i in modifier) 
        {
            try 
            {
                target[i] = modifier[i].constructor==Object ? MergeObject(target[i], modifier[i]) : modifier[i];
            } 
            catch(e) 
            {
                target[i] = modifier[i];
            }
        }
        return target;
    }

    /**
     * @param {Object[]} array 
     * @param {Object} item 
     */
    static RemoveItem(array, item)
    {
        var index;

        if (Array.isArray(array))
        {
            index = array.indexOf(item);

            if (index !== -1)
            {
                array.splice(index, 1);
            }
        }
        return array;
    }

    /**
     * @function Utilx.IsNull
     * @param {Object} obj 
     */
    static IsNull (obj)
    {
        return (obj==null || obj==undefined);
    }

    /**
     * @function Utilx.IsNullOrEmpty
     * @param {String} str
     */
    static IsNullOrEmpty (str)
    {
        if (str === null || str === undefined)
			return true;

		var text = str.replace('/ /g', '');

		if (text.length === 0)
			return true;
    }

    /**
     * @param {Phaser.Game} game 
     * @param {Number} mode 
     */
    static AttachStatPanel(game, mode)
    {
        var stats = new Stats();
        stats.setMode(mode);
        stats.dom.style.position = 'absolute';
        stats.dom.style.left = '10px';
        stats.dom.style.top = 'calc(100% - 58px)';
        document.body.appendChild(stats.dom);
        
        var startUpdate = function() {
          stats.begin();          
        };

        var endUpdate = function() {
            stats.end();
        };

        game.events.on('prestep', startUpdate);
        game.events.on('postrender', endUpdate);
    }
}