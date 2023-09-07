import { State, states } from  "../state.js";

export class Player_Sheild_Left extends State{
    constructor(game){
        super("PLAYER SHEILD LEFT", game);
        this.game = game
    }
    enter(){
        if(this.game.player.isOnPlanet){
            this.game.player.frame.y = 9;  //the row position of the player image you want to use
            this.game.player.maxFrames = 4;   //the max number of columns for the player image
            this.game.player.velocity.x = 0;
        }
    }
    handleInput(input){
        if(!this.game.player.isOnPlanet){
            return
        }
        else{
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){  // note: "d" = right
                this.game.player.setState(states.PLAYER_SHEILD_RIGHT); //set the player current state to standing left
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_DOWN){  // note: "s" = up   //this makes the player stand up if not holding s
                this.game.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing left
            } 
        }
    }
}

export class Player_Sheild_Right extends State{
    constructor(game){
        super("PLAYER SHEILD RIGHT", game);
        this.game = game;
    }
    enter(){
        if(this.game.player.isOnPlanet){
            this.game.player.frame.y = 8;  //the row position of the player image you want to use
            this.game.player.maxFrames = 4;   //the max number of columns for the player image
            this.game.player.velocity.x = 0;
        }
    }
    handleInput(input){
        if(!this.game.player.isOnPlanet){
            return
        }
        else{
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // note: "a" = left 
                this.game.player.setState(states.PLAYER_SHEILD_LEFT); //set the player current state to standing left
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_DOWN){  // note: "s" = up   //this makes the player stand up if not holding s
                this.game.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
            } 
        }
    }
}