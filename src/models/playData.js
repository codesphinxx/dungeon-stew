export default class PlayerData
{
    constructor()
    {
        this.name = '';
        this.map = '';
        this.health = 0;
        this.position = { x:0, y:0 };
        this.createdon = Date.now();
        this.modifiedon = Date.now();
        this.inventory = [];
    }
}