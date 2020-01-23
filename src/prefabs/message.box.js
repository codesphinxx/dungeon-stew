import Phaser from 'phaser';
import WindowBase from './window.base';
import Conversation from '../models/npc.conversation';
import {Settings} from '../settings';

export default class MessageBox extends WindowBase
{
  /**
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} width
   * @param {Number} height
   * @param {String} texture
   */
    constructor(x, y, width, height, texture)
    {
        super('message.win', x, y, width, height, texture);

        this.content = this.add.text(0, 0, '', {font: "16px pixelmix", fill: "#ffffff", stroke:"#000000", strokeThickness:2});

        this.keys = this.input.keyboard.addKeys({
            X: Phaser.Input.Keyboard.KeyCodes.X
        });

        this.charIndex = 0;

        /**
         * @type {Conversation}
         */
        this.message = null;
    }

    /**
     * @param {Number} time 
     * @param {Number} delta 
     */
    update(time, delta) 
    {
        if (Phaser.Input.Keyboard.JustDown(this.keys.X)) 
        {
            //TODO: trigger next page
        }
        else if (this.controller)
        {
          if (this.controller.X)
          {
            //TODO: trigger next page
          }
        }
        super.update();
    }

    read()
    {
        if (this.message == null || this.message.complete) return;
        let line = this.message.nextLine();

        if (!line || String.IsNullOrEmpty(line.text)) return;

        this.charIndex = 0;
        this.time.addEvent({ delay: Settings.MESSAGE_READ_SPEED, callback: this._nextChar, callbackScope: this, repeat: line.text.length });

        if (line.choice)
        {
            this._displayChoice();
        }
        else if (line.quest)
        {
            this._displayQuest();
        }
    }

    _nextChar() 
    {
        let text = this.message.current.text;
        //TODO: handle special character like \r \n \t
        //TODO: handle word color
        
        //  Add the next letter onto the text string
        this.content.text = this.content.text.concat(text[this.charIndex]);
    
        //  Advance the word index to the next word in the line
        this.charIndex++;
    
        //  Last word?
        if (this.charIndex === text.length)
        {
            //  Add a carriage return
            this.content.text = this.content.text.concat("\n");
    
            //  Get the next letter after the charDelay amount of ms has elapsed
            //this.time.addEvent({ delay: Settings.MESSAGE_READ_SPEED, callback: this._nextChar, callbackScope: this, loop: false });
        }    
    }

    _displayChoice()
    {

    }

    _displayQuest()
    {

    }
}