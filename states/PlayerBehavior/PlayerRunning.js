import { State, states } from  "../state.js";
import { Dust } from "../../classes/particles.js";

export class Player_Running_Left extends State{
    constructor(game){
        super("PLAYER RUNNING LEFT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game
        this.sign = 1;
    }
    enter(){
        this.game.player.frame.y = 7; //the row position of the player image you want to use
        this.game.player.maxFrames = 8;  //the max number of columns for the player image
        this.game.player.velocity.x = -this.game.player.maxSpeed;  
        this.game.background.velocity.x =  this.game.player.maxSpeed
    }
    handleInput(input, camera){
        this.game.particles.unshift(new Dust(this.game, this.game.player.position, this.sign))//used to add a new particle when the player runs
        
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){
            this.game.player.shouldPanCameraToRight(camera)
        }

        else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
            this.game.player.setState(states.PLAYER_RUNNING_RIGHT); //set the player current state to standing right  
            
        }
        else if(input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_LEFT){ // note: 'a" = left 
            this.game.player.setState(states.PLAYER_STANDING_LEFT); //set the player current state to standing right
        }

        else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "s" = down 
            this.game.player.setState(states.PLAYER_SHEILD_LEFT); //set the player current state to standing left
        }
        else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ // note: "w" = up
            this.game.player.setState(states.PLAYER_JUMPING_LEFT); //set the player current state to jump
        }
    }
}

export class Player_Running_Right extends State{
    constructor(game){
        super("PLAYER RUNNING RIGHT", game);
        this.game = game
        this.sign = -1;
    }
    enter(){
        this.game.player.frame.y = 6;  //the row position of the player image you want to use
        this.game.player.maxFrames = 8;   //the max number of columns for the player image
        this.game.player.velocity.x = this.game.player.maxSpeed;   
        this.game.background.velocity.x = -this.game.player.maxSpeed
       
    }
    handleInput(input, camera){
      
        this.game.particles.unshift(new Dust(this.game, this.game.player.position, this.sign))//used to add a new particle when the player runs
        
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){
            this.game.player.shouldPanCameraToLeft(camera) 
        }

        else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // note: "a" = left 
            this.game.player.setState(states.PLAYER_RUNNING_LEFT); //set the player current state to Running left
            
        }
        else if(input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_RIGHT){  // note: "d" = right   //this makes the player stand up if not holding d
            this.game.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        } 

        else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "s" = down 
            this.game.player.setState(states.PLAYER_SHEILD_RIGHT); //set the player current state to standing left
        }
        else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ // note: "w" = up
            this.game.player.setState(states.PLAYER_JUMPING_RIGHT); //set the player current state to jump
        }
    }
}