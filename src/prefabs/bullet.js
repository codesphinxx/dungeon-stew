import Phaser from 'phaser';

export default class Bullet extends Phaser.GameObjects.Image 
{
    /**
     * @param {Phaser.Scene} scene 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} y
     */
    constructor(scene, x, y, speed, texture, frame) 
    {
        super(scene, x, y, texture, frame);
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12);
    }
    
    /**
     * @param {Phaser.GameObjects.Sprite} shooter 
     * @param {Object} target 
     * @param {Number} target.x 
     * @param {Number} target.y 
     */
    fire(shooter, target) 
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan((target.x - this.x) / (target.y - this.y));
        //some light randomness to the bullet angle
        this.direction += ((Math.random() / 10) + (-(Math.random() / 10)));
        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y) 
        {
            this.xSpeed = this.speed * Math.sin(this.direction);
            this.ySpeed = this.speed * Math.cos(this.direction);
        }
        else 
        {
            this.xSpeed = -this.speed * Math.sin(this.direction);
            this.ySpeed = -this.speed * Math.cos(this.direction);
        }
        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0;
    }

    /**
     * @param {Number} time 
     * @param {Number} delta 
     */
    update(time, delta) 
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1500) 
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}