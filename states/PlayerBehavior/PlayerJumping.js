import { State, states } from  "../state.js";

export class Player_Jumping_Left extends State{
    constructor(game){
        super("PLAYER JUMPING LEFT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
    }
    enter(){
        this.game.player.frame.y = 3; //the row position of the player image you want to use
        this.game.player.maxFrames = 6;  //the max number of columns for the player image
        if(this.game.player.onGround()){ // only jump when on the ground
            this.game.player.velocity.y = -20 * this.game.player.friction;
        }
        this.game.player.velocity.x = -this.game.player.maxSpeed * 0.5;
       
    }
    handleInput(input, camera){
        // this.game.player.shouldPanCameraUp(camera)
        this.game.player.shouldPanCameraToRight(camera)
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
            this.game.player.setState(states.PLAYER_JUMPING_RIGHT); //set the player current state to standing right
        }
        else if(this.game.player.onGround()  
            && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // switch state when player touch the ground
            this.game.player.setState(states.PLAYER_RUNNING_LEFT);  //set the player current state to standing left
        }
        else if(this.game.player.onGround() 
            && input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_LEFT){ // switch state when player touch the ground
            this.game.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing right
        }
        else if(this.game.player.velocity.y > 0){ //// switch state when player is falling to the ground
            this.game.player.setState(states.PLAYER_FALLING_LEFT); 
        }
        else if(!this.game.player.onGround() 
            && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ //// switch state when player is falling to the ground
            this.game.player.setState(states.PLAYER_SHELL_SMASH_LEFT); 
        }
    }
}

export class Player_Jumping_Right extends State{
    constructor(game){
        super("PLAYER JUMPING RIGHT");
    
        this.game = game;
    }
    enter(){
        this.game.player.frame.y = 2;  //the row position of the player image you want to use
        this.game.player.maxFrames = 6;   //the max number of columns for the player image
        if(this.game.player.onGround()){ // only jump when on the ground
            this.game.player.velocity.y = -20 * this.game.player.friction;
        }
        this.game.player.velocity.x = this.game.player.maxSpeed * 0.5;
      
    }
    handleInput(input, camera){
        // this.game.player.shouldPanCameraUp(camera)
        this.game.player.shouldPanCameraToLeft(camera);
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // note: "a" = left 
            this.game.player.setState(states.PLAYER_JUMPING_LEFT); //set the player current state to Running left
        } 
        else if(this.game.player.onGround() 
            && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){
            this.game.player.setState(states.PLAYER_RUNNING_RIGHT);
        }
        else if(this.game.player.onGround() 
            && input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_RIGHT){ // switch state when player touch the ground
            this.game.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        }
        else if(this.game.player.velocity.y > 0){ //// switch state when player is falling to the ground
            this.game.player.setState(states.PLAYER_FALLING_RIGHT); 
        }
        else if(!this.game.player.onGround() 
            && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ //// switch state when player is falling to the ground
            this.game.player.setState(states.PLAYER_SHELL_SMASH_RIGHT); 
        }
    }
}