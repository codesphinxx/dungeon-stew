import Stats from 'stats.js';
import Phaser from 'phaser';

export default class Utilx
{
    constructor()
    {
        throw new Error('Statis class cannot be initialized');
    }

    /**
     * @param {Number} x1 
     * @param {Number} y1 
     * @param {Number} r1 
     * @param {Number} x2 
     * @param {Number} y2 
     * @param {Number} r2 
     */
    static circleIntersect (x1, y1, r1, x2, y2, r2)
    {
        let distSq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2); 
        let radSumSq = (r1 + r2) * (r1 + r2); 
        
		if (distSq == radSumSq) 
			return true; 
		else if (distSq > radSumSq) 
			return false; 
		else
			return true;
    };

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
    static mergeObject (target, modifier) 
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
    static removeItem(array, item)
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
    static isNull (obj)
    {
        return (obj==null || obj==undefined);
    }

    /**
     * @param {Phaser.Game} game 
     * @param {Number} mode 
     */
    static attachStatPanel(game, mode)
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