class ConvoActor
{
    constructor()
    {
        this.name = '';
        this.key = '';
    }
}

class ConvoEntry
{
    constructor()
    {
        this.actor = '';
        this.text = '';
    }
} 

export default class Convo
{
    constructor()
    {
        this.index = -1;

        /**
         * @type {ConvoActor[]}
         */
        this.actors = [];

        /**
         * @type {ConvoEntry[]}
         */
        this.messages = [];        
    }

    get isComplete()
    {
        return this.index == this.messages.length -1;
    }

    get currentMessage()
    {
        return this.messages[this.index];
    }

    getMessage(index)
    {
        this.messages[index];
    }

    nextMessage()
    {
        if (this.index < this.messages.length-1)
        {
            this.index++;
        }
        return this.messages[this.index];
    }
}