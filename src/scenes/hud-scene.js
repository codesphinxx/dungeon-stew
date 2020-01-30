import Phaser from 'phaser';
import Button from '../prefabs/hud.button';
import Config, {Assets, Settings} from '../settings';
import Player from '../prefabs/player';

export default class HudScene extends Phaser.Scene
{
    static get XPAD_BUTTONS()
    {
        return {
            LEFT:14,
            UP:12,
            RIGHT:15,
            DOWN:13,
            Y:3,
            B:1,
            A:0,
            X:2
        };
    }

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
        this.interactive = true;
    }
    
    create()
    {
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
                if (!this.interactive) return;
                this.player.gamepad.down = true;
            });
            this.down.addInputUpCallback(() => {
                this.player.gamepad.down = false;
            });
            this.up.addInputDownCallback(() => {
                if (!this.interactive) return;
                this.player.gamepad.up = true;
            });
            this.up.addInputUpCallback(() => {
                this.player.gamepad.up = false;
            });        
            this.left.addInputDownCallback(() => {
                if (!this.interactive) return;
                this.player.gamepad.left = true;
            });
            this.left.addInputUpCallback(() => {
                this.player.gamepad.left = false;
            });
            this.right.addInputDownCallback(() => {
                if (!this.interactive) return;
                this.player.gamepad.right = true;
            });
            this.right.addInputUpCallback(() => {
                this.player.gamepad.right = false;
            });
        
            this.keyA.addInputDownCallback(() => {
                if (!this.interactive) return;
                if (this.player) this.player.attack();
            });
        
            this.keyB.addInputDownCallback(() => {
                if (!this.interactive) return;
                if (this.player) this.player.triggerInteraction();
            });
        
            this.keyC.addInputDownCallback(() => {
                if (!this.interactive) return;
                if (this.player) this.player.triggerInventory();
            });
        }
        else
        {
            this.input.keyboard.on('keydown', (event) => {
                if (!this.player || !this.interactive) return;
                event.stopPropagation();

                if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP || event.keyCode === Phaser.Input.Keyboard.KeyCodes.W)
                {   
                   this.player.gamepad.up = true;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN || event.keyCode === Phaser.Input.Keyboard.KeyCodes.S)
                {   
                    this.player.gamepad.down = true;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT || event.keyCode === Phaser.Input.Keyboard.KeyCodes.A)
                {   
                    this.player.gamepad.left = true;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT || event.keyCode === Phaser.Input.Keyboard.KeyCodes.D)
                {   
                    this.player.gamepad.right = true;
                }
            });
            this.input.keyboard.on('keyup', (event) => {
                if (!this.player) return;
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP || event.keyCode === Phaser.Input.Keyboard.KeyCodes.W)
                {   
                   this.player.gamepad.up = false;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN || event.keyCode === Phaser.Input.Keyboard.KeyCodes.S)
                {   
                    this.player.gamepad.down = false;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT || event.keyCode === Phaser.Input.Keyboard.KeyCodes.A)
                {   
                    this.player.gamepad.left = false;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT || event.keyCode === Phaser.Input.Keyboard.KeyCodes.D)
                {   
                    this.player.gamepad.right = false;
                }
            });
            this.keys = this.input.keyboard.addKeys({
                Z: Phaser.Input.Keyboard.KeyCodes.Z,
                X: Phaser.Input.Keyboard.KeyCodes.X,
                C: Phaser.Input.Keyboard.KeyCodes.C
              });    
              
            this.input.gamepad.on('down', (pad, button) => {
                if (!this.player || !this.player.alive || !this.interactive) return;
               
                if (button.index === HudScene.XPAD_BUTTONS.UP && button.pressed)
                {   
                   this.player.gamepad.up = true;
                }
                else if (button.index === HudScene.XPAD_BUTTONS.DOWN && button.pressed)
                {   
                    this.player.gamepad.down = true;
                }
                else if (button.index === HudScene.XPAD_BUTTONS.LEFT && button.pressed)
                {   
                    this.player.gamepad.left = true;
                }
                else if (button.index === HudScene.XPAD_BUTTONS.RIGHT && button.pressed)
                {   
                    this.player.gamepad.right = true;
                }
                if (this.player.state == Config.PlayerStates.IDLE || this.player.state == Config.PlayerStates.MOVE)
                {
                    if (button.index === HudScene.XPAD_BUTTONS.A && button.pressed)
                    {   
                        this.player.attack();
                    }
                    else if (button.index === HudScene.XPAD_BUTTONS.Y && button.pressed)
                    {   
                        this.player.triggerInventory();
                    }
                    else if (button.index === HudScene.XPAD_BUTTONS.X && button.pressed)
                    {   
                        this.player.triggerInteraction();
                    }
                }
            });   
              
            this.input.gamepad.on('up', (pad, button) => {
                if (!this.player || !this.player.alive) return;
                
                if (button.index === HudScene.XPAD_BUTTONS.UP)
                {   
                   this.player.gamepad.up = false;
                }
                else if (button.index === HudScene.XPAD_BUTTONS.DOWN)
                {   
                    this.player.gamepad.down = false;
                }
                else if (button.index === HudScene.XPAD_BUTTONS.LEFT)
                {   
                    this.player.gamepad.left = false;
                }
                else if (button.index === HudScene.XPAD_BUTTONS.RIGHT)
                {   
                    this.player.gamepad.right = false;
                }
            });

            this.input.on('pointerdown', (pointer) => {
                if (!this.player.alive || !this.interactive) return;
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

        this.sync(this.player.health); 
    
        this.player.on('health.change', () =>{
            this.sync(this.player.health);
        });

        this.game.events.on('active.scene', (sceneKey, interactive) => {
            this.time.delayedCall(100, ()=> { this.interactive = interactive; }, null, this);
        });

        this.scene.bringToTop();
    }

    /**
     * @param {Number} time 
     * @param {Number} delta 
     */
    update(time, delta) 
    {
        if (this.player.alive && !this.isMobile() && this.interactive)
        {
            if (this.player.state == Config.PlayerStates.IDLE || this.player.state == Config.PlayerStates.MOVE)
            {
                if (Phaser.Input.Keyboard.JustDown(this.keys.Z)) 
                {
                    this.player.attack();
                }
                else if (Phaser.Input.Keyboard.JustDown(this.keys.X)) 
                {
                    this.player.triggerInteraction();
                }
                else if (Phaser.Input.Keyboard.JustDown(this.keys.C)) 
                {
                    this.player.triggerInventory();
                }
            }
        }
        super.update();
    }

    refresh ()
    {
        this.scene.bringToTop();
    }

    /**
     * @param {Number} health 
     */
    sync(health = 1)
    {
        let posy = 10;
        if (this.hearts.length < health)
        {
            var dx = (Settings.HEART_SPACING * this.hearts.length) + Settings.DEFAULT_MARGIN;
            var increase = health - this.hearts.length;
            for (var i=0; i < increase; i++)
            {
                console.log('heart:', dx, posy);
                var heart = this.add.image(dx, posy, Assets.Files.Life.atlas, Assets.Files.Life.image);
                heart.setDisplayOrigin(0);
                this.hearts.push(heart);

                dx += Settings.HEART_SPACING;
            }
        }
        else if (this.hearts.length > health)
        {
            var end = health -1;
            for (var i = this.hearts.length -1; i > end; i--)
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