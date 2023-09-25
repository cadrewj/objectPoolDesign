import { State, shipStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export default class SpaceshipChangeDirection extends State{
    constructor(game){
        super("SPACESHIP CHANGE DIRECTION", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
    }
    enter(){
    //    console.log("changing direction");
    }
    handleInput(input, context, playerIsInSpace){
        if(!this.game.spaceship.exploding){
            this.game.spaceship.changeDirection();
        }

       if(!playerIsInSpace){
            if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){ // rotate right
                // this.game.spaceship.rotation = 0.05; 
                this.game.spaceship.rotateShip(true) // equals equals right
            }
            else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT){ // rotate left
                // this.game.spaceship.rotation = -0.05; 
                this.game.spaceship.rotateShip(false) // false equals left
            }
            else if (input.shipLastKey === this.game.data.gameKeys.SPACESHIP_RELEASE_LEFT 
                || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_RELEASE_RIGHT){
                this.game.spaceship.rotation = 0; //stop rotating
                this.game.spaceship.angle += 0; //stop rotating
                this.game.spaceship.setState(shipStates.SPACESHIP_IDLE);
            }
            else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){
                this.game.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST); //set the player current state to standing right
            }
            else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){ 
                this.game.spaceship.setState(shipStates.SPACESHIP_THRUST); //set the player current state to standing right
            }
            else if (input.isMouseDown){
                this.game.spaceship.setState(shipStates.SPACESHIP_SHOOT);
            }
            else if(this.game.spaceship.exploding){
                this.game.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
            }
        }
    }
        
  
   
}





