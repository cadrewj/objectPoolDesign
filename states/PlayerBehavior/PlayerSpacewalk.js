import { State, states } from  "../state.js";


export class Player_Spacewalk_Left extends State{
    constructor(game){
        super("PLAYER SPACEWALK LEFT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game
        this.sign = 1;
    }
    enter(){
        this.game.player.frame.y = 7; //the row position of the player image you want to use
        this.game.player.maxFrames = 8;  //the max number of columns for the player image
        this.game.player.velocity.x = -this.game.player.maxSpeed / 2;  
        this.game.universe.velocity.x = this.game.player.maxSpeed / 2 // move the universe
    }
    handleInput(input, camera){ 
        if(this.game.player.isInSpace){
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){
                this.game.player.shouldPanCameraToRight(camera)
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_LEFT){ // note: 'a" = left 
                this.game.universe.velocity.x =  0
                this.game.player.setState(states.PLAYER_SPACEWALK_STANDING_LEFT); //set the player current state to standing right
            }
    
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
                this.game.player.setState(states.PLAYER_SPACEWALK_RIGHT); //set the player current state to standing right      
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ 
                this.game.player.setState(states.PLAYER_SPACEWALK_UP);       
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){
                this.game.player.setState(states.PLAYER_SPACEWALK_DOWN);     
            }
        }
    }
}

export class Player_Spacewalk_Right extends State{
    constructor(game){
        super("PLAYER SPACEWALK RIGHT", game);
        this.game = game
        this.sign = -1;
    }
    enter(){
        this.game.player.frame.y = 6;  //the row position of the player image you want to use
        this.game.player.maxFrames = 8;   //the max number of columns for the player image
        this.game.player.velocity.x = this.game.player.maxSpeed / 2;   
        this.game.universe.velocity.x = -this.game.player.maxSpeed / 2;
       
    }
    handleInput(input, camera){
      
        if(this.game.player.isInSpace){
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){
                this.game.player.shouldPanCameraToLeft(camera) 
            }

            else if(input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_RIGHT){  // note: "d" = right   //this makes the player stand up if not holding d
                this.game.universe.velocity.x = 0;
                this.game.player.setState(states.PLAYER_SPACEWALK_STANDING_RIGHT); //set the player current state to standing right
            } 

            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // note: "a" = left 
                this.game.player.setState(states.PLAYER_SPACEWALK_LEFT); //set the player current state to Running left
                
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ 
                this.game.player.setState(states.PLAYER_SPACEWALK_UP);     
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ 
                this.game.player.setState(states.PLAYER_SPACEWALK_DOWN); 
                
            }  
        }
    }
}

export class Player_Spacewalk_Up extends State{
    constructor(game){
        super("PLAYER SPACEWALK UP", game);
        this.game = game
        this.sign = -1;
    }
    enter(){
        this.game.player.frame.y = 6;  //the row position of the player image you want to use
        this.game.player.maxFrames = 8;   //the max number of columns for the player image
        this.game.player.velocity.y = -this.game.player.maxSpeed / 2;   
        this.game.universe.velocity.y =  this.game.player.maxSpeed / 2;
       
    }
    handleInput(input, camera){
      
        if(this.game.player.isInSpace){
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){
                this.game.player.shouldPanCameraDown(camera) 
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_UP){  // note: "d" = right   //this makes the player stand up if not holding d
                this.game.universe.velocity.y =  0;
                this.game.player.setState(states.PLAYER_SPACEWALK_STANDING_UP); //set the player current state to standing right
            } 

            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ // note: "a" = left 
                this.game.player.setState(states.PLAYER_SPACEWALK_LEFT); //set the player current state to Running left
                
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "a" = left 
                this.game.player.setState(states.PLAYER_SPACEWALK_RIGHT); //set the player current state to Running left
                
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){ // note: "a" = left 
                this.game.player.setState(states.PLAYER_SPACEWALK_DOWN); //set the player current state to Running left    
            }          
        }
    }
}

export class Player_Spacewalk_Down extends State{
    constructor(game){
        super("PLAYER SPACEWALK DOWN", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game
        this.sign = 1;
    }
    enter(){
        this.game.player.frame.y = 7; //the row position of the player image you want to use
        this.game.player.maxFrames = 8;  //the max number of columns for the player image
        this.game.player.velocity.y = this.game.player.maxSpeed / 2;  
        this.game.universe.velocity.y = -this.game.player.maxSpeed / 2 // move the universe
    }
    handleInput(input, camera){ 
        if(this.game.player.isInSpace){
            if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_DOWN){
                this.game.player.shouldPanCameraUp(camera)
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_RELEASE_DOWN){ 
                this.game.universe.velocity.y =  0
                this.game.player.setState(states.PLAYER_SPACEWALK_STANDING_DOWN); 
            }
    
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_UP){ 
                this.game.player.setState(states.PLAYER_SPACEWALK_UP);   
                
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_LEFT){ 
                this.game.player.setState(states.PLAYER_SPACEWALK_LEFT);       
            }
            else if(input.lastKey === this.game.data.gameKeys.PLAYER_PRESS_RIGHT){ // note: "d" = right
                this.game.player.setState(states.PLAYER_SPACEWALK_RIGHT); //set the player current state to standing right  
                
            }  
        }
    }
}



