import { State, states } from  "../state.js";

export class Player_Spacewalk_Standing_Left extends State{
    constructor(game){
        super("PLAYER SPACEWALK STANDING LEFT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game
        this.sign = 1;
    }
    enter(){
        this.game.player.frame.y = 7; //the row position of the player image you want to use
        this.game.player.maxFrames = 8;  //the max number of columns for the player image
        this.game.player.velocity.x = 0;  
        this.game.universe.velocity.x = 0; // move the universe
    }
    handleInput(input, camera){ 
        if(this.game.player.isInSpace){
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){
                this.game.player.setState(states.PLAYER_SPACEWALK_LEFT)
            }
    
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
                this.game.player.setState(states.PLAYER_SPACEWALK_RIGHT); //set the player current state to standing right  
                
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ // note: "d" = right
                this.game.player.setState(states.PLAYER_SPACEWALK_UP); //set the player current state to standing right  
                
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "d" = right
                this.game.player.setState(states.PLAYER_SPACEWALK_DOWN); //set the player current state to standing right  
                
            }
        }
    }
}

export class Player_Spacewalk_Standing_Right extends State{
    constructor(game){
        super("PLAYER SPACEWALK STANDING RIGHT", game);
        this.game = game
        this.sign = -1;
    }
    enter(){
        this.game.player.frame.y = 6;  //the row position of the player image you want to use
        this.game.player.maxFrames = 8;   //the max number of columns for the player image
        this.game.player.velocity.x = 0;
        this.game.universe.velocity.x =  0;
       
    }
    handleInput(input, camera){
      
        if(this.game.player.isInSpace){
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){
                this.game.player.setState(states.PLAYER_SPACEWALK_LEFT)
            }
    
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
                this.game.player.setState(states.PLAYER_SPACEWALK_RIGHT); //set the player current state to standing right  
                
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ // note: "d" = right
                this.game.player.setState(states.PLAYER_SPACEWALK_UP); //set the player current state to standing right  
                
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "d" = right
                this.game.player.setState(states.PLAYER_SPACEWALK_DOWN); //set the player current state to standing right  
                
            }
        }
    }
}

export class Player_Spacewalk_Standing_Up extends State{
    constructor(game){
        super("PLAYER SPACEWALK STANDING UP", game);
        this.game = game
        this.sign = -1;
    }
    enter(){
        this.game.player.frame.y = 6;  //the row position of the player image you want to use
        this.game.player.maxFrames = 8;   //the max number of columns for the player image
        this.game.player.velocity.y = 0;
        this.game.universe.velocity.y =  0;
       
    }
    handleInput(input, camera){
      
        if(this.game.player.isInSpace){
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // note: "a" = left 
                this.game.player.setState(states.PLAYER_SPACEWALK_LEFT); //set the player current state to Running left         
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){
                this.game.player.setState(states.PLAYER_SPACEWALK_RIGHT) 
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){
                this.game.player.setState(states.PLAYER_SPACEWALK_UP); 
            } 
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "a" = left 
                this.game.player.setState(states.PLAYER_SPACEWALK_DOWN); //set the player current state to Running left
                
            }
        }
    }
}

export class Player_Spacewalk_Standing_Down extends State{
    constructor(game){
        super("PLAYER SPACEWALK STANDING DOWN", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game
        this.sign = 1;
    }
    enter(){
        this.game.player.frame.y = 7; //the row position of the player image you want to use
        this.game.player.maxFrames = 8;  //the max number of columns for the player image
        this.game.player.velocity.y = 0;
        this.game.universe.velocity.y = 0;
    }
    handleInput(input, camera){ 
        if(this.game.player.isInSpace){
            if(this.game.player.isInSpace){
                if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // note: "a" = left 
                    this.game.player.setState(states.PLAYER_SPACEWALK_LEFT); //set the player current state to Running left         
                }
                else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){
                    this.game.player.setState(states.PLAYER_SPACEWALK_RIGHT) 
                }
                else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){
                    this.game.player.setState(states.PLAYER_SPACEWALK_UP); 
                } 
                else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "a" = left 
                    this.game.player.setState(states.PLAYER_SPACEWALK_DOWN); //set the player current state to Running left
                    
                }
            }
        }
    }
}