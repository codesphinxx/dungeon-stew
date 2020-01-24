/**
 * Author: CodeSphinx
 */
import Phaser from 'phaser';
export * from './helpers/mixins';
import Utilx from './helpers/utilx';
import BootScene from "./scenes/boot-scene.js";
import TitleScene from "./scenes/title-scene";
import GameoverScene from "./scenes/gameover-scene";
import DungeonScene from "./scenes/dungeon-scene";
import settings from './settings';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  version: __VERSION__,
  title:"Dungeon Stew",
  pixelArt: true,
  backgroundColor: "#000",
  parent: "game-container",
  disableContextMenu:true,
  scene: [BootScene, TitleScene, DungeonScene, GameoverScene],
  input: {
    gamepad: true
  },
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  plugins: {
    global: [ NineSlice.Plugin.DefaultCfg ],
  }
};

// change layout on mobile
if (/Android|webOS|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent))
{
    config.width = settings.VIEWPORT.WIDTH;
    config.height = settings.VIEWPORT.HEIGHT;
    config.scale.mode = Phaser.Scale.FIT;
}

const game = new Phaser.Game(config);
Utilx.attachStatPanel(game, 1);

//import GameManager from './game.manager';
//GameManager.init();
