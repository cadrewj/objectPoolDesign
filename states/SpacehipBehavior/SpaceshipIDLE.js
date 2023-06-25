import { State, shipStates } from "../state.js"

export default class SpaceshipIDLE extends State{
    constructor(spaceship){
        super("SPACESHIP IDLE"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
        this.game = {
            data: spaceship.game.data
        }
    }
    enter(){
        this.spaceship.thrusting = false;
        this.spaceship.accelartionTime = 0;
        this.spaceship.decelerationTime = 0;
       
    }
    handleInput(input, context){

        //to make the ship come to a slow stop
        // friction coefficient of space (0 = no friction, 1 = lots of friciton) note: friction in physic is a value from 0 -  1 
        this.spaceship.thrust.x -= this.game.data.FRICTION * this.spaceship.thrust.x / this.game.data.FPS;
        this.spaceship.thrust.y -= this.game.data.FRICTION * this.spaceship.thrust.y / this.game.data.FPS;
        // console.log(this.spaceship.thrust.x, this.spaceship.thrust.y)

        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){ 
            this.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST); //set the player current state to standing right
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){ 
            this.spaceship.setState(shipStates.SPACESHIP_THRUST); //set the player current state to standing right
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
            || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){  
            this.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION);
        }
        else if (input.isMouseDown){
            this.spaceship.setState(shipStates.SPACESHIP_SHOOT);
        }
        else if(this.spaceship.exploding){
            this.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
        }
    }
}





