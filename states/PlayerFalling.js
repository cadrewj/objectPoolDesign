import { State, states } from "./state.js";

export class Player_Falling_Left extends State{
    constructor(player){
        super("PLAYER FALLING LEFT"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.player = player;
    }
    enter(){
        this.player.frame.y = 5; //the row position of the player image you want to use  (falling image)
        this.player.maxFrames = 6;  //the max number of columns for the player image
       
    }
    handleInput(input, camera){
        // if(!this.player.onGround()){
        //     this.player.shouldPanCameraDown(camera)
        // }
        if(input === "PRESS d"){ // note: "d" = right
            this.player.setState(states.PLAYER_FALLING_RIGHT); //set the player current state to standing right
        }
        else if(this.player.onGround()){
            this.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing right
        }
        else if(!this.player.onGround() && input === "PRESS s"){ //// switch state when player is falling to the ground
            this.player.setState(states.PLAYER_SHELL_SMASH_LEFT); 
        }
    }
}

export class Player_Falling_Right extends State{
    constructor(player){
        super("PLAYER FALLING RIGHT");
        this.player = player;
    }
    enter(){
        this.player.frame.y = 4;  //the row position of the player image you want to use (falling image)
        this.player.maxFrames = 6;   //the max number of columns for the player image
      
    }
    handleInput(input, camera){
        // if(!this.player.onGround()){
        //     this.player.shouldPanCameraDown(camera)
        // }
        if(input === "PRESS a" ){ // note: "a" = left 
            this.player.setState(states.PLAYER_FALLING_LEFT); //set the player current state to Running left
        } 
        else if(this.player.onGround()){
            this.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        }
        else if(!this.player.onGround() && input === "PRESS s"){ //// switch state when player is falling to the ground
            this.player.setState(states.PLAYER_SHELL_SMASH_RIGHT); 
        }

    }
}