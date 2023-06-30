import { State, states } from  "../state.js";
import { Fire, Splash } from "../../classes/particles.js";

export class Player_Shell_Smash_Left extends State{
    constructor(game){
        super("PLAYER SHELL SMASH LEFT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        this.sign = 1;
    }
    enter(){
        this.game.player.frame.y = 11; //the row position of the player image you want to use
        this.game.player.maxFrames = 6;  //the max number of columns for the player image
        // this.game.player.velocity.x = -this.game.player.maxSpeed * 0.5;
        this.game.player.velocity.y = this.game.player.weight * 50;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.position, this.sign))//used to add a new particle when the player smashes
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
            this.game.player.setState(states.PLAYER_SHELL_SMASH_RIGHT); //set the player current state to standing right
        }
        else if(this.game.player.onGround()  && input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_DOWN){ 
            this.game.player.setState(states.PLAYER_STANDING_LEFT);  

        }
        else if(this.game.player.onGround()  && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ 
            this.game.player.position.y -= this.game.player.maxSpeed * 30; 
        }
        else if(this.game.player.onGround()){ // switch state when player touch the ground
            for(let i =0; i< 30;i++){
                this.game.particles.unshift(new Splash(this.game, this.game.player.position, this.sign))
            }
        }
    }
}

export class Player_Shell_Smash_Right extends State{
    constructor(game){
        super("PLAYER SHELL SMASH RIGHT", game);
        this.game = game;
        this.sign = -1;

    }
    enter(){
        this.game.player.frame.y = 10;  //the row position of the player image you want to use
        this.game.player.maxFrames = 6;   //the max number of columns for the player image
        // this.game.player.velocity.x = this.game.player.maxSpeed * 0.5;
        this.game.player.velocity.y = this.game.player.weight * 50;
      
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.position, this.sign))//used to add a new particle when the player smashes
        if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT ){ // note: "a" = left 
            this.game.player.setState(states.PLAYER_SHELL_SMASH_LEFT); //set the player current state to Running left
        } 
        else if(this.game.player.onGround()  && input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_DOWN){ 
            this.game.player.setState(states.PLAYER_STANDING_RIGHT);  
        }
        else if(this.game.player.onGround()  && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ 
            this.game.player.position.y -= this.game.player.maxSpeed * 30; 
        }
        else if(this.game.player.onGround()){ // switch state when player touch the ground
            for(let i =0; i< 30;i++){
                this.game.particles.unshift(new Splash(this.game, this.game.player.position))
            }
            
        }
        // else if(this.game.player.onGround() && input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){
        //     this.game.player.setState(states.PLAYER_RUNNING_RIGHT);
        // }
        // else if(this.game.player.onGround()){ // switch state when player touch the ground
        //     this.game.player.setState(states.PLAYER_STANDING_RIGHT); //set the player current state to standing right
        // }
    }
}