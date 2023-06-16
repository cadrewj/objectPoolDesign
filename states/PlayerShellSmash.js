import { State, states } from "./state.js";

export class Player_Shell_Smash_Left extends State{
    constructor(player){
        super("PLAYER SHELL SMASH LEFT"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.player = player;
    }
    enter(){
        this.player.frame.y = 11; //the row position of the player image you want to use
        this.player.maxFrames = 6;  //the max number of columns for the player image
        this.player.velocity.x = -this.player.maxSpeed * 1.5;
        this.player.velocity.y = this.player.weight * 30;
    }
    handleInput(input){
        if(input === "PRESS d"){ // note: "d" = right
            this.player.setState(states.PLAYER_SHELL_SMASH_RIGHT); //set the player current state to standing right
        }
        else if(this.player.onGround()  && input === "PRESS a"){ // switch state when player touch the ground
            this.player.setState(states.PLAYER_RUNNING_LEFT);  //set the player current state to standing left
        }
        else if(this.player.onGround() && input === "RELEASE a"){ // switch state when player touch the ground
            this.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing right
        }
    
    }
}

export class Player_Shell_Smash_Right extends State{
    constructor(player){
        super("PLAYER SHELL SMASH RIGHT");
        this.player = player;
    }
    enter(){
        this.player.frame.y = 10;  //the row position of the player image you want to use
        this.player.maxFrames = 6;   //the max number of columns for the player image
        this.player.velocity.x = this.player.maxSpeed * 1.5;
        this.player.velocity.y = this.player.weight * 30;
      
    }
    handleInput(input){
        if(input === "PRESS a" ){ // note: "a" = left 
            this.player.setState(states.PLAYER_SHELL_SMASH_LEFT); //set the player current state to Running left
        } 
        else if(this.player.onGround() && input === "PRESS d"){
            this.player.setState(states.PLAYER_RUNNING_RIGHT);
        }
        else if(this.player.onGround() && input === "RELEASE d"){ // switch state when player touch the ground
            this.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        }

    }
}