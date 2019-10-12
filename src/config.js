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
    KEY:'key'
};

const Config = {
    PlayerStates:PlayerStates,
    Directions:Directions,
    ItemTypes:ItemTypes,
    KNOCKBACK_INFLUENCE:1,
    BASE_HEALTH:3,
    MAX_HEALTH:7,
    MAX_STRENGTH:4,
    PLAYER_MOVE_SPEED:200,
    AI:{        
        IDLE_DURATION:1500,
        CHANGE_INTERVAL_MIN:5000,
        CHANGE_INTERVAL_MAX:10000,
        ATTACK_PROBABILITY:45,
        ATTACK_CHECK_RATE:2,
        IDLE_PROBABILITY:25,
        LOOK_CHANGE_PROBABILITY:35
    }
};

export default Config;

