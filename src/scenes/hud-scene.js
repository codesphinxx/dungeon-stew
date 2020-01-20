import Phaser from 'phaser';
import Button from '../prefabs/hud.button';
import {Assets, Settings} from '../settings';
import Player from '../prefabs/player';

export default class HudScene extends Phaser.Scene
{
    /**
     * @param {Player} player 
     */
    constructor(player) 
    {
        super({key:'hud', active:false});
        this.player = player;
        /**
         * @type {Phaser.GameObjects.Image[]}
         */
        this.hearts = [];
    }
    
    create()
    {
        this.background = new Phaser.Geom.Rectangle(0, 0, this.game.config.width, 50);
        this.graphics = this.add.graphics({fillStyle: { color: 0x000000 }});
        this.graphics.fillRectShape(this.background);
        this.graphics.setDepth(5);
        this.graphics.alpha = 0.5;
        
        if (this.isMobile())
        {
            this.left = new Button(this, 97, 817, Assets.Files.Left.atlas, Assets.Files.Left.image, Assets.Files.Left.pressed);
            this.add.existing(this.left);
            
            this.up = new Button(this, 157, 757, Assets.Files.Up.atlas, Assets.Files.Up.image, Assets.Files.Up.pressed);
            this.add.existing(this.up);
           
            this.right = new Button(this, 217, 817, Assets.Files.Right.atlas, Assets.Files.Right.image, Assets.Files.Right.pressed);
            this.add.existing(this.right);

            this.down = new Button(this, 157, 877, Assets.Files.Down.atlas, Assets.Files.Down.image, Assets.Files.Down.pressed);
            this.add.existing(this.down);

            this.keyA = new Button(this, this.game.config.width - 90, 874, Assets.Files.A.atlas, Assets.Files.A.image, Assets.Files.A.pressed);
            this.add.existing(this.keyA);

            this.keyB = new Button(this, this.game.config.width - 150, 774, Assets.Files.B.atlas, Assets.Files.B.image, Assets.Files.B.pressed);
            this.add.existing(this.keyB);

            this.keyC = new Button(this, this.game.config.width - 200, 914, Assets.Files.C.atlas, Assets.Files.C.image, Assets.Files.C.pressed);
            this.add.existing(this.keyC);

            this.down.addInputDownCallback(() => {
                this.player.gamepad.down = true;
            });
            this.down.addInputUpCallback(() => {
                this.player.gamepad.down = false;
            });
            this.up.addInputDownCallback(() => {
                this.player.gamepad.up = true;
            });
            this.up.addInputUpCallback(() => {
                this.player.gamepad.up = false;
            });        
            this.left.addInputDownCallback(() => {
                this.player.gamepad.left = true;
            });
            this.left.addInputUpCallback(() => {
                this.player.gamepad.left = false;
            });
            this.right.addInputDownCallback(() => {
                this.player.gamepad.right = true;
            });
            this.right.addInputUpCallback(() => {
                this.player.gamepad.right = false;
            });
        
            this.keyA.addInputDownCallback(() => {
                if (this.player) this.player.attack();
            });
        
            this.keyB.addInputDownCallback(() => {
                if (this.player) this.player.triggerInteraction();
            });
        
            this.keyC.addInputDownCallback(() => {
                if (this.player) this.player.triggerInventory();
            });
        }

        this.syncLife(this.player.health); 
    
        this.player.on('health.change', () =>{
            this.syncLife(this.player.health);
        });

        this.scene.bringToTop();
    }

    refresh ()
    {
        this.scene.bringToTop();
    }

    /**
     * @param {Number} health 
     */
    syncLife(health = 1)
    {
        let posy = 0;

        if (this.hearts.length < health)
        {
            var dx = (Settings.HEART_SPACING * this.hearts.length) + Settings.DEFAULT_MARGIN;
            var increase = health - this.hearts.length;
            for (var i=0; i < increase; i++)
            {
                var heart = this.add.image(dx, posy, Assets.Files.Life.atlas, Assets.Files.Life.image);
                heart.setDisplayOrigin(0);
                if (posy == 0)
                {
                    posy = (this.background.height - heart.height) * 0.5;
                    heart.y = posy;
                }
                this.hearts.push(heart);

                dx += Settings.HEART_SPACING;
            }
        }
        else if (this.hearts.length > health)
        {
            var end = (this.hearts.length - health) -1;
            for (var i=end; i >= 0; i--)
            {
                var heart = this.hearts[i];
                this.hearts.splice(i, 1);
                heart.destroy();
            } 
        }

        this.hearts.forEach(function(element, index) {
            element.setDepth(10);
        });
    }
}