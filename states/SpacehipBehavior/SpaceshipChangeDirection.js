import { State, shipStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export default class SpaceshipChangeDirection extends State{
    constructor(spaceship){
        super("SPACESHIP CHANGE DIRECTION"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
        this.game = {
            data: spaceship.game.data
        }
    }
    enter(){
    //    console.log("changing direction");
    }
    handleInput(input, context){
        if(!this.spaceship.exploding){
            this.changeDirection();
        }
        
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){ // rotate right
            this.spaceship.rotation = 0.05; 
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT){ // rotate left
            this.spaceship.rotation = -0.05; 
        }
        else if (input.shipLastKey === this.game.data.gameKeys.SPACESHIP_RELEASE_LEFT 
            || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_RELEASE_RIGHT){
            this.spaceship.rotation = 0; //stop rotating
            this.spaceship.angle += 0; //stop rotating
            this.spaceship.setState(shipStates.SPACESHIP_IDLE);
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){
            this.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST); //set the player current state to standing right
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){ 
            this.spaceship.setState(shipStates.SPACESHIP_THRUST); //set the player current state to standing right
        }
        else if (input.isMouseDown){
            this.spaceship.setState(shipStates.SPACESHIP_SHOOT);
        }
        else if(this.spaceship.exploding){
            this.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
        }
    }
    changeDirection(){ 
        if(this.spaceship.lives === 0){ // if dead return and don't rotate the ship
            return
        } 
        //keep the ship angle between 0 and 360 (two pie)
        if(this.spaceship.angle < 0){
            this.spaceship.angle +=(degToRad(360))
        }
        else if(this.spaceship.angle >= degToRad(360)){
            this.spaceship.angle -= (degToRad(360))
        }   
        this.spaceship.angle += this.spaceship.rotation;  //rotation the ship  
    }
}





