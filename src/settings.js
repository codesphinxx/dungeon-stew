export const Directions = {
    UP:0,
    RIGHT:1,
    DOWN:2,
    LEFT:3
};

export const PlayerStates = {
    IDLE:0,
    ATTACK:1,
    DAMAGE:2,
    MOVE:3,
    CORPSE:4,
    TALK: 5
};

export const ItemTypes = {
    NONE:'none',
    POTION:'potion',
    DAMAGE_UP:'dmgup',
    INVULNERABLE:'invulnerable',
    STEALTH:'stealth',
    KEY:'key',
    MATERIAL:'material'
};

export const Assets = {
    Data:[
        {key:'items', path:'../assets/data/items.json'},
        {key:'monsters', path:'../assets/data/monsters.json'}
    ],
    Images:[
        {key:'tiles', value:'../assets/tilesets/tuxmon-sample-32px-extruded.png'},
        {key:'game-title', value:'../assets/images/game-title.png'},
        {key:'title-bg', value:'../assets/images/title-bg.png'}
    ],
    Atlas: [
        {key:'ui', image:'../assets/images/ui.png', data:'../assets/images/ui.json'}
    ],
    Plugins:[
        {key:'rexbbcodetextplugin', url:'../assets/js/rexbbcodetextplugin.min.js', autoStart:true}
    ],
    Sprites:[
        {
            key:'player', 
            image:'../assets/spritesheets/chara_hero.png', 
            data:{
                frameWidth: 48,
                frameHeight: 48,
                margin: 0,
                spacing: 0
            }
        },
        {
            key:'slime', 
            image:'../assets/spritesheets/slime.png', 
            data:{
                frameWidth: 48,
                frameHeight: 48,
                margin: 0,
                spacing: 0
            }
        }
    ],
    Files: {
        Left: { atlas:'ui', image: 'left', pressed: 'left_press' },
        Up: { atlas:'ui', image: 'up', pressed: 'up_press' },
        Down: { atlas:'ui', image: 'down', pressed: 'down_press' },
        Right: { atlas:'ui', image: 'right', pressed: 'right_press' },
        A: { atlas:'ui', image: 'keyA', pressed: 'keyA_press' },
        B: { atlas:'ui', image: 'keyB', pressed: 'keyB_press' },
        C: { atlas:'ui', image: 'keyB', pressed: 'keyB_press' },
        Life: { atlas:'ui', image: 'life' }
    }
};

export const Settings = {
    PlayerStates:PlayerStates,
    Directions:Directions,
    ItemTypes:ItemTypes,
    KNOCKBACK_INFLUENCE:1,
    BASE_HEALTH:3,
    MAX_HEALTH:10,
    MAX_STRENGTH:4,
    DEFAULT_MARGIN: 10,
    PLAYER_MOVE_SPEED:200,
    DEFAULT_ZOOM:1.5,
    HEART_SPACING: 40,
    VIEWPORT:{
        WIDTH: 614,
        HEIGHT: 1092
    },
    CAMERA:{
        WIDTH: 614,
        HEIGHT: 600
    },
    AI:{        
        IDLE_DURATION:1500,
        CHASE_INTERVAL:500,
        CHANGE_INTERVAL_MIN:1000,
        CHANGE_INTERVAL_MAX:4000,
        ATTACK_PROBABILITY:45,
        ATTACK_CHECK_RATE:2,
        IDLE_PROBABILITY:25,
        LOOK_CHANGE_PROBABILITY:35
    }
};

export default Settings;

