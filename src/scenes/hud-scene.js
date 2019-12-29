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
            this.left = new Button(this, 15, 50, Assets.Files.Left.atlas, Assets.Files.Left.image, Assets.Files.Left.pressed);
            this.add(this.left);

            this.up = new Button(this, 48, 0, Assets.Files.Up.atlas, Assets.Files.Up.image, Assets.Files.Up.pressed);
            this.add(this.up);

            this.right = new Button(this, 128, 50, Assets.Files.Right.atlas, Assets.Files.Right.image, Assets.Files.Right.pressed);
            this.add(this.right);

            this.down = new Button(this, 48, 80, Assets.Files.Down.atlas, Assets.Files.Down.image, Assets.Files.Down.pressed);
            this.add(this.down);

            this.keyA = new Button(this, scene.width - 100, 60, Assets.Files.A.atlas, Assets.Files.A.image, Assets.Files.A.pressed);
            this.add(this.keyA);

            this.keyB = new Button(this, scene.width - 100, 60, Assets.Files.B.atlas, Assets.Files.B.image, Assets.Files.B.pressed);
            this.add(this.keyB);

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
        }
        else
        {
            this.input.on('pointerdown', (pointer) => {
                if (!this.player.alive) return;
                if (pointer.rightButtonDown())
                {
                    //TODO: action button event
                }
                else
                {
                    this.player.attack();
                }                
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