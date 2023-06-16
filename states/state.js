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
    constructor(state){
        this.state = state; // used to keep track of the state name
    }
}