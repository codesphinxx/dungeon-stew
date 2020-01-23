# Dungeon Stew
A Micro 2D adventure game built on Phaser 3


### Requirements

We need [Node.js](https://nodejs.org) to install and run scripts.

## Install and run

Run next commands in your terminal:

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies and launch browser with examples.|
| `npm start` | Launch browser to show the examples. <br> Press `Ctrl + c` to kill **http-server** process. |


## Collectibles
1. Key
2. Life
3. Damage Up
4. Invulnerable
5. Stealth


## TODO
1. redesign game hud
2. refine collectible bounce effect
3. add death animation effects for monsters
4. add item collect animation/effect
5. create inventory window
6. create NPC entities
7. create dialog window
8. implement monster item drop



## ISSUES
1. Player cannot move while damage effect is on
2. Stop pointerdown event from propagating on window scene

## IMPROVEMENT
1. divid map into zones, when checking collision for attack or interaction with npc, you can filter by zone.

