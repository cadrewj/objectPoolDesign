import { State, states } from "./state.js";

export class Player_Running_Left extends State{
    constructor(player){
        super("PLAYER RUNNING LEFT"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.player = player;
    }
    enter(){
        this.player.frame.y = 7; //the row position of the player image you want to use
        this.player.maxFrames = 8;  //the max number of columns for the player image
        this.player.velocity.x = -this.player.maxSpeed;
        
    }
    handleInput(input, camera){
        this.player.shouldPanCameraToRight(camera)
        if(input === "PRESS d"){ // note: "d" = right
            this.player.setState(states.PLAYER_RUNNING_RIGHT); //set the player current state to standing right
            // 
            
        }
        else if(input === "RELEASE a"){ // note: 'a" = left 
            this.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing right
        }
        else if(input === "PRESS s"){ // note: "s" = down 
            this.player.setState(states.PLAYER_SHEILD_LEFT); //set the player current state to standing left
        }
        else if(input === "PRESS w"){ // note: "w" = up
            this.player.setState(states.PLAYER_JUMPING_LEFT); //set the player current state to jump
        }
    }
}

export class Player_Running_Right extends State{
    constructor(player){
        super("PLAYER RUNNING RIGHT");
        this.player = player;
    }
    enter(){
        this.player.frame.y = 6;  //the row position of the player image you want to use
        this.player.maxFrames = 8;   //the max number of columns for the player image
        this.player.velocity.x = this.player.maxSpeed; 
        
    }
    handleInput(input, camera){
        this.player.shouldPanCameraToLeft(camera);
        if(input === "PRESS a"){ // note: "a" = left 
            this.player.setState(states.PLAYER_RUNNING_LEFT); //set the player current state to Running left
            this.player.shouldPanCameraToLeft(camera)
        }
        else if(input === "RELEASE d"){  // note: "d" = right   //this makes the player stand up if not holding d
            this.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        } 
        else if(input === "PRESS s"){ // note: "s" = down 
            this.player.setState(states.PLAYER_SHEILD_RIGHT); //set the player current state to standing left
        }
        else if(input === "PRESS w"){ // note: "w" = up
            this.player.setState(states.PLAYER_JUMPING_RIGHT); //set the player current state to jump
        }
    }
}