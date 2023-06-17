import { State, states } from  "../state.js";

export class Player_Sheild_Left extends State{
    constructor(player){
        super("PLAYER SHEILD LEFT");
        this.player = player;
    }
    enter(){
        this.player.frame.y = 9;  //the row position of the player image you want to use
        this.player.maxFrames = 4;   //the max number of columns for the player image
        this.player.velocity.x = 0;
    }
    handleInput(input){
        if(input === "PRESS d"){  // note: "d" = right
            this.player.setState(states.PLAYER_SHEILD_RIGHT); //set the player current state to standing left
        }
        else if(input === "RELEASE s"){  // note: "s" = up   //this makes the player stand up if not holding s
            this.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing left
        } 
    }
}

export class Player_Sheild_Right extends State{
    constructor(player){
        super("PLAYER SHEILD RIGHT");
        this.player = player;
    }
    enter(){
        this.player.frame.y = 8;  //the row position of the player image you want to use
        this.player.maxFrames = 4;   //the max number of columns for the player image
        this.player.velocity.x = 0;
    }
    handleInput(input){
        if(input === "PRESS a"){ // note: "a" = left 
            this.player.setState(states.PLAYER_SHEILD_LEFT); //set the player current state to standing left
        }
        else if(input === "RELEASE s"){  // note: "s" = up   //this makes the player stand up if not holding s
            this.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        } 
    }
}