import { State, states } from "../state.js";

export class Player_Falling_Left extends State{
    constructor(game){
        super("PLAYER FALLING LEFT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
    
        this.game = game
    }
    enter(){
        this.game.player.frame.y = 5; //the row position of the player image you want to use  (falling image)
        this.game.player.maxFrames = 6;  //the max number of columns for the player image
       
    }
    handleInput(input, camera){
        // if(!this.game.player.onGround()){
        //     this.game.player.shouldPanCameraDown(camera)
        // }
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
            this.game.player.setState(states.PLAYER_FALLING_RIGHT); //set the player current state to standing right
        }
        else if(this.game.player.onGround()){
            this.game.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing right
        }
        else if(!this.game.player.onGround() && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ //// switch state when player is falling to the ground
            this.game.player.setState(states.PLAYER_SHELL_SMASH_LEFT); 
        }
    }
}

export class Player_Falling_Right extends State{
    constructor(game){
        super("PLAYER FALLING RIGHT", game);
        this.game = game
    }
    enter(){
        this.game.player.frame.y = 4;  //the row position of the player image you want to use (falling image)
        this.game.player.maxFrames = 6;   //the max number of columns for the player image
      
    }
    handleInput(input, camera){
        // if(!this.game.player.onGround()){
        //     this.game.player.shouldPanCameraDown(camera)
        // }
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT ){ // note: "a" = left 
            this.game.player.setState(states.PLAYER_FALLING_LEFT); //set the player current state to Running left
        } 
        else if(this.game.player.onGround()){
            this.game.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        }
        else if(!this.game.player.onGround() && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ //// switch state when player is falling to the ground
            this.game.player.setState(states.PLAYER_SHELL_SMASH_RIGHT); 
        }

    }
}