import { states, State } from "../state.js";

export class Player_Collision_Behavior_Left extends State{
    constructor(game){
        super("PLAYER COLLIDE LEFT", game);
        this.game = game;
        
    }
    enter(){
        // this.game.player.frame.x = 0;
        if(this.game.player.isOnPlanet){
            this.game.player.frame.y = 9;  //the row position of the player image you want to use
            this.game.player.maxFrames = 4;   //the max number of columns for the player image
            this.game.player.velocity.x = this.game.player.maxSpeed;
            this.game.player.velocity.y = this.game.player.weight;  
        }
    }
    handleInput(input, context){
        if(!this.game.player.isOnPlanet){
            return
        }
        else{
            if(this.game.player.onGround()  && this.game.player.frame.x >= this.game.player.maxFrames){ 
                this.game.player.setState(states.PLAYER_STANDING_LEFT);  
            }
            else if(!this.game.player.onGround()  && this.game.player.frame.x >= this.game.player.maxFrames){ 
                this.game.player.setState(states.PLAYER_FALLING_LEFT);  
            }

        }  
    }
}

export class Player_Collision_Behavior_Right extends State{
    constructor(game){
        super("PLAYER COLLIDE RIGHT", game);
        this.game = game;
        
    }
    enter(){
        if(this.game.player.isOnPlanet){
            // this.game.player.frame.x = 0;
            this.game.player.frame.y = 9;  //the row position of the player image you want to use
            this.game.player.maxFrames = 4;   //the max number of columns for the player image
            this.game.player.velocity.x = this.game.player.maxSpeed;
            this.game.player.velocity.y = this.game.player.weight;
        }
      
    }
    handleInput(input, context){
        if(!this.game.player.isOnPlanet){
            return
        }
        else{
            if(this.game.player.onGround()  && this.game.player.frame.x >= this.game.player.maxFrames){ 
                this.game.player.setState(states.PLAYER_STANDING_RIGHT);  
            }
            else if(!this.game.player.onGround()  && this.game.player.frame.x >= this.game.player.maxFrames){ 
                this.game.player.setState(states.PLAYER_FALLING_RIGHT);  
            }
        }   
    }
}