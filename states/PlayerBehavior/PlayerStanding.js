import { State, states } from "../state.js"

export class Player_Standing_Left extends State{
    constructor(game){
        super("PLAYER STANDING LEFT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game; 
    }
    enter(){
        if(this.game.player.isOnPlanet){
            this.game.player.frame.y = 1; //the row position of the player image you want to use
            this.game.player.maxFrames = 6;  //the max number of columns for the player image
            this.game.player.velocity.x = 0;
            this.game.player.velocity.y = 0;
            // this.game.background.velocity.x = 0;
            // this.game.background.velocity.y = 0;
        }

    }
    handleInput(input){
        if(!this.game.player.isOnPlanet){
            return
        }
        else{
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
                this.game.player.setState(states.PLAYER_RUNNING_RIGHT); //set the player current state to standing right
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){  // note: "a" = left 
                this.game.player.setState(states.PLAYER_RUNNING_LEFT); //set the player current state to standing left
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "s" = down 
                this.game.player.setState(states.PLAYER_SHEILD_LEFT); //set the player current state to standing right
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ // note: "up" = down 
                this.game.player.setState(states.PLAYER_JUMPING_LEFT); //set the player current state to standing right
            } 
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_ENTER_SHIP){ // note: "up" = down 
                this.game.player.setState(states.PLAYER_SPACEWALK_STANDING_LEFT); //set the player current state to standing right
            }          
        }
    }  
}

export class Player_Standing_Right extends State{
    constructor(game){
        super("PLAYER STANDING RIGHT", game);
        this.game = game
    }
    enter(){
        if(this.game.player.isOnPlanet){
            this.game.player.frame.y = 0;  //the row position of the player image you want to use
            this.game.player.maxFrames = 6;   //the max number of columns for the player image
            this.game.player.velocity.x = 0;
            this.game.player.velocity.y = 0;
        }
        // this.game.background.velocity.x = 0;
        // this.game.background.velocity.y = 0;
    }
    handleInput(input){
        if(!this.game.player.isOnPlanet){
            return
        }
        else{
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){  // note: "a" = left 
                this.game.player.setState(states.PLAYER_RUNNING_LEFT); //set the player current state to standing left
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){  // note: "d" = right 
                this.game.player.setState(states.PLAYER_RUNNING_RIGHT); //set the player current state to standing left
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "s" = down 
                this.game.player.setState(states.PLAYER_SHEILD_RIGHT); //set the player current state to standing left
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ // note: "up" = down 
                this.game.player.setState(states.PLAYER_JUMPING_RIGHT); //set the player current state to standing right
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_ENTER_SHIP){ // note: "up" = down 
                this.game.player.setState(states.PLAYER_SPACEWALK_STANDING_RIGHT); //set the player current state to standing right
            }         
        }  
    }
}
