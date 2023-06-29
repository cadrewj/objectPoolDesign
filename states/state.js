export const states = {
    PLAYER_STANDING_LEFT: 0,
    PLAYER_STANDING_RIGHT: 1,
    PLAYER_SHEILD_LEFT: 2,
    PLAYER_SHEILD_RIGHT: 3,
    PLAYER_RUNNING_LEFT: 4,
    PLAYER_RUNNING_RIGHT: 5,
    PLAYER_JUMPING_LEFT: 6,
    PLAYER_JUMPING_RIGHT: 7,
    PLAYER_FALLING_LEFT: 8,
    PLAYER_FALLING_RIGHT: 9,
    PLAYER_SHELL_SMASH_LEFT: 10,
    PLAYER_SHELL_SMASH_RIGHT: 11,
}
export class State{
    constructor(state, game){
        this.state = state; // used to keep track of the state name
        this.game = game;
    }
}

export const shipStates = {
    SPACESHIP_IDLE: 0,
    SPACESHIP_THRUST: 1,
    SPACESHIP_REVERSE_THRUST: 2,
    SPACESHIP_CHANGE_DIRECTION: 3,
    SPACESHIP_SHOOT: 4,
    SPACESHIP_EXPLODING: 5,
    SPACESHIP_BLINKING: 6,
    // SPACESHIP_AUTOPILOT: 7,
}

export const gameStates = {
    NEW_GAME: 0,
    GAME_OVER: 1,
    DEBUG_MODE: 2,
    PAUSE_GAME: 3,
    PLAYING_GAME: 4,
    LOAD_GAME: 5,
    DISPLAY_GAME_MESSAGE: 6,
    
}