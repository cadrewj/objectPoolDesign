import { State, states } from  "../state.js";

export class Player_Jumping_Left extends State{
    constructor(player){
        super("PLAYER JUMPING LEFT"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.player = player;
    }
    enter(){
        this.player.frame.y = 3; //the row position of the player image you want to use
        this.player.maxFrames = 6;  //the max number of columns for the player image
        if(this.player.onGround()){ // only jump when on the ground
            this.player.velocity.y =-20 * this.player.friction;
        }
        this.player.velocity.x = -this.player.maxSpeed * 0.5;
       
    }
    handleInput(input, camera){
        // this.player.shouldPanCameraUp(camera)
        this.player.shouldPanCameraToRight(camera)
        if(input === "PRESS d"){ // note: "d" = right
            this.player.setState(states.PLAYER_JUMPING_RIGHT); //set the player current state to standing right
        }
        else if(this.player.onGround()  && input === "PRESS a"){ // switch state when player touch the ground
            this.player.setState(states.PLAYER_RUNNING_LEFT);  //set the player current state to standing left
        }
        else if(this.player.onGround() && input === "RELEASE a"){ // switch state when player touch the ground
            this.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing right
        }
        else if(this.player.velocity.y > 0){ //// switch state when player is falling to the ground
            this.player.setState(states.PLAYER_FALLING_LEFT); 
        }
        else if(!this.player.onGround() && input === "PRESS s"){ //// switch state when player is falling to the ground
            this.player.setState(states.PLAYER_SHELL_SMASH_LEFT); 
        }
    }
}

export class Player_Jumping_Right extends State{
    constructor(player){
        super("PLAYER JUMPING RIGHT");
        this.player = player;
    }
    enter(){
        this.player.frame.y = 2;  //the row position of the player image you want to use
        this.player.maxFrames = 6;   //the max number of columns for the player image
        if(this.player.onGround()){ // only jump when on the ground
            this.player.velocity.y =-20 * this.player.friction;
        }
        this.player.velocity.x = this.player.maxSpeed * 0.5;
      
    }
    handleInput(input, camera){
        // this.player.shouldPanCameraUp(camera)
        this.player.shouldPanCameraToLeft(camera);
        if(input === "PRESS a" ){ // note: "a" = left 
            this.player.setState(states.PLAYER_JUMPING_LEFT); //set the player current state to Running left
        } 
        else if(this.player.onGround() && input === "PRESS d"){
            this.player.setState(states.PLAYER_RUNNING_RIGHT);
        }
        else if(this.player.onGround() && input === "RELEASE d"){ // switch state when player touch the ground
            this.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        }
        else if(this.player.velocity.y > 0){ //// switch state when player is falling to the ground
            this.player.setState(states.PLAYER_FALLING_RIGHT); 
        }
        else if(!this.player.onGround() && input === "PRESS s"){ //// switch state when player is falling to the ground
            this.player.setState(states.PLAYER_SHELL_SMASH_RIGHT); 
        }
    }
}