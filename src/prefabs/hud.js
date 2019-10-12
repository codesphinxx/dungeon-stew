import Phaser from 'phaser';
import Button from './hud.button';

export default class Hud extends Phaser.GameObjects.Container
{
    /**
   * @param {Phaser.Scene} scene 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} textures
   * @param {String} textures.up
   * @param {String} textures.down
   * @param {String} textures.left
   * @param {String} textures.right
   * @param {String} textures.keyA
   * @param {String} textures.atlas
   */
    constructor(scene, x, y, textures)
    {
        super(scene, x, y);

        this.hearts = [];
        this.lifePanel = scene.add.image(0, 10, 'ui', 'lifebg');
        this.lifePanel.displayOriginX = 0;
        this.lifePanel.displayOriginY = 0;

        this.add(this.lifePanel);
        
        if (scene.isMobile())
        {
            this.left = new Button(scene, 15, 50, textures.atlas, textures.left, textures.left+'_press');
            this.add(this.left);

            this.up = new Button(scene, 48, 0, textures.atlas, textures.up, textures.up+'_press');
            this.add(this.up);

            this.right = new Button(scene, 128, 50, textures.atlas, textures.right, textures.right+'_press');
            this.add(this.right);

            this.down = new Button(scene, 48, 80, textures.atlas, textures.down, textures.down+'_press');
            this.add(this.down);

            this.keyA = new Button(scene, scene.width - 100, 60, textures.atlas, textures.keyA, textures.keyA+'_press');
            this.add(this.keyA);

            this.down.addInputDownCallback(() => {
                this.scene.player.gamepad.down = true;
            });
            this.down.addInputUpCallback(() => {
                this.scene.player.gamepad.down = false;
            });
            this.up.addInputDownCallback(() => {
                this.scene.player.gamepad.up = true;
            });
            this.up.addInputUpCallback(() => {
                this.scene.player.gamepad.up = false;
            });
        
            this.left.addInputDownCallback(() => {
                this.scene.player.gamepad.left = true;
            });
            this.left.addInputUpCallback(() => {
                this.scene.player.gamepad.left = false;
            });
            this.right.addInputDownCallback(() => {
                this.scene.player.gamepad.right = true;
            });
            this.right.addInputUpCallback(() => {
                this.scene.player.gamepad.right = false;
            });
        
            this.keyA.addInputDownCallback(() => {
                if (this.scene.player) this.scene.player.attack();
            });
        }
        else
        {
            scene.input.on('pointerdown', (pointer) => {
                if (this.scene.player.alive) this.scene.player.attack();
            });
        }
        this.setScrollFactor(0);
        scene.add.existing(this);

        scene.input.setDefaultCursor('url(assets/images/crosshair.png), crosshair'); 
    }

    /**
     * @param {Number} health 
     */
    syncLife(health = 1)
    {
        if (this.hearts.length < health)
        {
            var dx = (32) * this.hearts.length;
            var increase = health - this.hearts.length;
            for (var i=0; i < increase; i++)
            {
                var heart = this.scene.add.image(dx, 12, 'ui', 'potion');
                heart.displayOriginX = 0;
                heart.displayOriginY = 0;
                this.hearts.push(heart);
                this.add(heart);

                dx += heart.width + 5;
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
    }
}