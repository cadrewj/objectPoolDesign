import { State, states } from "../state.js"

export class Player_Standing_Left extends State{
    constructor(player){
        super("PLAYER STANDING LEFT"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.player = player;
    }
    enter(){
        this.player.frame.y = 1; //the row position of the player image you want to use
        this.player.maxFrames = 6;  //the max number of columns for the player image
        this.player.velocity.x = 0;
    }
    handleInput(input){
        if(input === "PRESS d"){ // note: "d" = right
            this.player.setState(states.PLAYER_RUNNING_RIGHT); //set the player current state to standing right
        }
        else if(input === "PRESS a"){  // note: "a" = left 
            this.player.setState(states.PLAYER_RUNNING_LEFT); //set the player current state to standing left
        }
        else if(input === "PRESS s"){ // note: "s" = down 
            this.player.setState(states.PLAYER_SHEILD_LEFT); //set the player current state to standing right
        }
        else if(input === "PRESS w"){ // note: "up" = down 
            this.player.setState(states.PLAYER_JUMPING_LEFT); //set the player current state to standing right
        }
    }
}

export class Player_Standing_Right extends State{
    constructor(player){
        super("PLAYER STANDING RIGHT");
        this.player = player;
    }
    enter(){
        this.player.frame.y = 0;  //the row position of the player image you want to use
        this.player.maxFrames = 6;   //the max number of columns for the player image
        this.player.velocity.x = 0;
    }
    handleInput(input){
        if(input === "PRESS a"){  // note: "a" = left 
            this.player.setState(states.PLAYER_RUNNING_LEFT); //set the player current state to standing left
        }
        else if(input === "PRESS d"){  // note: "d" = right 
            this.player.setState(states.PLAYER_RUNNING_RIGHT); //set the player current state to standing left
        }
        else if(input === "PRESS s"){ // note: "s" = down 
            this.player.setState(states.PLAYER_SHEILD_RIGHT); //set the player current state to standing left
        }
        else if(input === "PRESS w"){ // note: "up" = down 
            this.player.setState(states.PLAYER_JUMPING_RIGHT); //set the player current state to standing right
        }
    }
}
