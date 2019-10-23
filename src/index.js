/**
 * Author: CodeSphinx
 */
import 'phaser';
export * from './helpers/mixins';
import Phaser from 'phaser';
import Utilx from './helpers/utilx';
import BootScene from "./scenes/boot-scene.js";
import DungeonScene from "./scenes/dungeon-scene";

const gameVariables = {};

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
  resolution: window.devicePixelRatio,
  scene: [BootScene, DungeonScene],
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