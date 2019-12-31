/**
 * Author: CodeSphinx
 */
import 'phaser';
export * from './helpers/mixins';
import Phaser from 'phaser';
import Utilx from './helpers/utilx';
import BootScene from "./scenes/boot-scene.js";
import TitleScene from "./scenes/title-scene";
import GameoverScene from "./scenes/gameover-scene";
import DungeonScene from "./scenes/dungeon-scene";
import settings from './settings';

window.$gameVariables = {};
window.$gameData = {};
window.$Monsters = [];
window.$Items = [];
window.$Weapons = [];
window.$Armor = [];
window.$Npc = [];

window._IS_AUTHENTICATED = false;

const config = {
  type: Phaser.AUTO,
  //width: settings.VIEWPORT.WIDTH,
  //height: settings.VIEWPORT.HEIGHT,
  width: window.innerWidth,
  height: window.innerHeight,
  version: __VERSION__,
  title:"Dungeon Stew",
  pixelArt: true,
  backgroundColor: "#000",
  parent: "game-container",
  disableContextMenu:true,
  //resolution: window.devicePixelRatio,
  scene: [BootScene, TitleScene, DungeonScene, GameoverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
Utilx.AttachStatPanel(game, 1);