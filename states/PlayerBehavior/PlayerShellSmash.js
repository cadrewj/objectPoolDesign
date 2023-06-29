import { State, states } from  "../state.js";

export class Player_Shell_Smash_Left extends State{
    constructor(game){
        super("PLAYER SHELL SMASH LEFT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
    }
    enter(){
        this.game.player.frame.y = 11; //the row position of the player image you want to use
        this.game.player.maxFrames = 6;  //the max number of columns for the player image
        this.game.player.velocity.x = -this.game.player.maxSpeed * 0.5;
        this.game.player.velocity.y = this.game.player.weight * 30;
    }
    handleInput(input){
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
            this.game.player.setState(states.PLAYER_SHELL_SMASH_RIGHT); //set the player current state to standing right
        }
        else if(this.game.player.onGround()  && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // switch state when player touch the ground
            this.game.player.setState(states.PLAYER_RUNNING_LEFT);  //set the player current state to standing left
        }
        else if(this.game.player.onGround()){ // switch state when player touch the ground
            this.game.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing right
        }
    }
}

export class Player_Shell_Smash_Right extends State{
    constructor(game){
        super("PLAYER SHELL SMASH RIGHT", game);
        this.game = game;
    }
    enter(){
        this.game.player.frame.y = 10;  //the row position of the player image you want to use
        this.game.player.maxFrames = 6;   //the max number of columns for the player image
        this.game.player.velocity.x = this.game.player.maxSpeed * 0.5;
        this.game.player.velocity.y = this.game.player.weight * 30;
      
    }
    handleInput(input){
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT ){ // note: "a" = left 
            this.game.player.setState(states.PLAYER_SHELL_SMASH_LEFT); //set the player current state to Running left
        } 
        else if(this.game.player.onGround() && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){
            this.game.player.setState(states.PLAYER_RUNNING_RIGHT);
        }
        else if(this.game.player.onGround()){ // switch state when player touch the ground
            this.game.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        }
    }
}