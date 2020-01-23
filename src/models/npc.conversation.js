class ConversationEntry
{
    /**
     * @param {String} text
     */
    constructor(text)
    {   
        /**
         * @type {String}
         */
        this.text = text;
        /**
         * @type {{variable:String, items:{id:Number,text:String}[]}}
         */
        this.choice = {};
        /**
         * @type {{id:Number,difficulty:Number,description:String,rewards:{id:Number,type:String}[]}}
         */
        this.quest = {};
    }
}

export default class Conversation
{
    /**
     * @param {Object} data 
     */
    constructor(data)
    {
        /**
         * @type {Number}
         */
        this.index = -1;
        /**
         * @type {ConversationEntry[]}
         */
        this.lines = [];
    }

    get complete()
    {
        return this.lines.length == this.index + 1;
    }

    get current()
    {
        return this.lines[this.index];
    }

    /**
     * @returns {ConversationEntry}
     */
    nextLine()
    {
        let i = this.index + 1;
        if (this.lines.length >= i) return null;

        this.index++;
        return this.lines[i];
    }

    /**
     * @param {String} text 
     */
    addText(text)
    {
        if (!this.lines) this.lines = [];
        this.lines.push(new ConversationEntry(text));
    }

    /**
     * @param {Object} data 
     */
    addChoice(data)
    {
        if (!this.lines) this.lines = [];
        
        let entry = new ConversationEntry(data.text);
        entry.choice.variable = data.choice.variable;
        if (Array.isArray(data.choice.items))
        {
            entry.choice.items = [];
            for (var i = 0; i < data.choice.items.length; i++)
            {
                entry.choice.items.push({id:data.choice.items[i].id, text:data.choice.items[i].text});
            }
        }
        
        this.lines.push(entry);
    }

    /**
     * @param {Object} data 
     */
    addQuest(data)
    {
        if (!this.lines) this.lines = [];
        
        let entry = new ConversationEntry(data.text);
        entry.quest.id = data.quest.id;
        entry.quest.difficulty = data.quest.difficulty;
        entry.quest.description = data.quest.description;
        
        if (Array.isArray(data.quest.rewards))
        {
            entry.quest.rewards = [];
            for (var i = 0; i < data.quest.rewards.length; i++)
            {
                entry.quest.rewards.push({id:data.choice.items[i].id, type:data.quest.rewards[i].type});
            }
        }
        
        this.lines.push(entry);
    }
}