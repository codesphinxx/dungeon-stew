import Phaser from 'phaser';
import WindowBase from './window.base';
import TextButton from './text.button';
import Conversation from '../models/npc.conversation';
import {Settings} from '../settings';

export default class MessageWindow extends WindowBase
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

        this.charIndex = 0;

        /**
         * @type {Conversation}
         */
        this._message = null;

        /**
         * @type {TextButton[]}
         */
        this._buttons = [];
    }

    get message()
    {
        return this._message;
    }

    set message(value)
    {
        this._message = value;
        this.charIndex = 0;
        if (this._message != null) this._message.reset();
    }

    get canRead()
    {
        return (this._message != null && 
            (!this._message.complete || 
                (this._message.complete && this._message.current.text.length != this.charIndex)));
    }

    init()
    {
        this.hasKeyDown = false;        
    }

    create()
    {
        super.create();

        this._resetContent();

        this.panel.setInteractive();        

        this.input.keyboard.on('keydown', (event) => {
            if (!this.active || this._buttons.length != 0) return;
            event.stopPropagation();   
            
            this.hasKeyDown = true;
        });
        this.input.keyboard.on('keyup', (event) => {
            if (!this.active || !this.hasKeyDown) return;
            event.stopPropagation();  

            this.hasKeyDown = false;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.X)
            {   
                this._handleInteraction();
            }
        });
        this.panel.on('pointerdown', (pointer, x, y, event) => {
            if (!this.active) return;
    
            this._handleInteraction();
        });
    }

    show()
    {
        this.content.text = '';
        super.show();
        this.scene.bringToTop();
    }

    hide()
    {
        super.hide();
        this.scene.sendToBack();
        for (var i = 0; i < this._buttons.length; i++)
        {
            this._buttons[i].destroy();
        }
        this._buttons.length = 0;
        if (this.questWin)
        {
            this.questWin.destroy();
            this.questWin = null;
            delete this.questWin;
        }
    }

    /**
     * @param {Number} time 
     * @param {Number} delta 
     */
    update(time, delta) 
    {
        super.update();
        if (!this.active) return;

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
    }

    _resetContent()
    {
        if (this.content)
        {
            this.content.destroy();
            this.content = null;
        }
        let x = this.config.x + Settings.MESSAGE_MARGIN;
        let y = this.config.y + Settings.MESSAGE_MARGIN;
        this.content = this.add.text(x, y, '', Settings.TextStyles.DEFAULT);   
        this.content.lineSpacing = 10;
    }

    _handleInteraction()
    {
        if (this.canRead)
        {
            this.read();
        }              
        else
        {
            this.hide();
        }
    }

    read()
    {
        if (this._buttons.length != 0)
        {
            for (var i = 0; i < this._buttons.length; i++)
            {
                this._buttons[i].destroy();
            }
            this._buttons.length = 0;
        }

        // Check if window is currently writing letters
        if (this.writer && this._message.current)
        {
            this.writer.destroy();
            delete this.writer;

            this.charIndex = this._message.current.text.length;
            this.content.text = this._message.current.text.concat("\n");

            if (this._message.current.choice)
            {
                this._displayChoice(this._message.current.choice);
            }
            else if (this._message.current.quest)
            {
                this._displayQuest(this._message.current.quest);
            }
            return;
        }

        if (this._message == null || this._message.complete) return;
        let line = this._message.nextLine();
        
        if (!line || String.IsNullOrEmpty(line.text)) return;

        this._resetContent();
               
        this.charIndex = 0;
        this.writer = this.time.addEvent({ delay: Settings.MESSAGE_READ_SPEED, callback: this._nextChar, callbackScope: this, repeat: line.text.length });
    }

    _nextChar() 
    {
        let text = this._message.current.text;
        //TODO: handle word color

        if (text[this.charIndex] != undefined)
        {
            //  Add the next letter onto the text string
            this.content.text = this.content.text.concat(text[this.charIndex]);
          
            //  Advance the word index to the next word in the line
            this.charIndex++;
        }
    
        //  Last word?
        if (this.charIndex === text.length)
        { 
            //  Add a carriage return
            this.content.text = this.content.text.concat("\n");
    
            //  Get rid of the timer event
            if (this.writer)
            {
                this.writer.destroy();
                delete this.writer;
            }

            if (this._message.current.choice)
            {
                this._displayChoice(this._message.current.choice);
            }
        }    
    }

    /**
     * @param {Object} data 
     * @param {String} data.variable
     * @param {Object[]} data.items
     * @param {Number} data.items.id
     * @param {String} data.items.text
     */
    _displayChoice(data)
    {
        this.manager.$gameVariables[data.variable] = -1;
        
        for (var i = data.items.length -1; i >= 0; i--)
        {
            let button = new TextButton(this, 0, 0, 'text-button', data.items[i].text, Settings.TextStyles.TEXT_BUTTON, Settings.BUTTON_MARGIN);
            button.x = (this.game.config.width - button.image.width) * 0.5;
            button.y = this.panel.y - (Settings.MESSAGE_BUTTON_OFFSET + button.image.height * this._buttons.length);

            // enabled and set data property
            button.setDataEnabled();
            button.setData('id', data.items[i].id);

            if (this._buttons.length != 0) 
            {
                button.y -= Settings.MESSAGE_BUTTON_SPACING;
            }
            
            button.addInputUpCallback(() => {
                if (!this.active) return;
                this.manager.$gameVariables[data.variable] = button.data.values.id;
                this._handleInteraction();
            });
            this._buttons.push(button);
        }        
    }

    /**
     * @param {Object} data 
     * @param {Number} data.id
     * @param {Number} data.difficulty
     * @param {String} data.description
     * @param {Object[]} data.rewards
     * @param {Number} data.rewards.id
     * @param {String} data.rewards.type
     */
    _displayQuest(data)
    {
        let height = this.panel.y - (Settings.MESSAGE_BUTTON_OFFSET + Settings.WINDOW_OFFSET.Y);
        let posy = this.panel.y - (Settings.MESSAGE_BUTTON_OFFSET + height);
        console.log('y:', this.panel.y, posy, height);
        this.questWin = this.add.nineslice(
            this.config.x, 
            posy, 
            this.config.width, 
            height, 
            this.config.texture, 
            [40, 40, 40, 40]
        );

        let y = posy + Settings.MESSAGE_MARGIN;
        let x = this.config.x + Settings.MESSAGE_MARGIN;
        this.questContent = this.add.text(x, y, data.description, Settings.TextStyles.DEFAULT);   
        this.questContent.lineSpacing = 10;
    }
}