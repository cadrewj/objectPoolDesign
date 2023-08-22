import { State, shipStates, gameStates } from "../state.js"

export default class SpaceshipIDLE extends State{
    constructor(game){
        super("SPACESHIP IDLE", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
    }
    enter(){
        this.game.spaceship.thrusting = false;
        this.game.spaceship.revThrusting = false;
        this.game.spaceship.accelartionTime = 0;
        this.game.spaceship.decelerationTime = 0;
        // this.game.universe.velocity.x = 0; 
        // this.game.universe.velocity.y = 0; 
    }
    handleInput(input, context){

        //to make the ship come to a slow stop
        // friction coefficient of space (0 = no friction, 1 = lots of friciton) note: friction in physic is a value from 0 -  1 
        this.game.spaceship.thrust.x -= this.game.data.FRICTION * this.game.spaceship.thrust.x / this.game.data.FPS;
        this.game.spaceship.thrust.y -= this.game.data.FRICTION * this.game.spaceship.thrust.y / this.game.data.FPS;

        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){ 
            this.game.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST); //set the player current state to standing right
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){ 
            this.game.spaceship.setState(shipStates.SPACESHIP_THRUST); //set the player current state to standing right
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
            || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){  
            this.game.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION);
        }
        else if (input.isMouseDown){
            this.game.spaceship.setState(shipStates.SPACESHIP_SHOOT);
        }
        else if(this.game.spaceship.exploding){
            this.game.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
        }
        else if(input.gameLastKey === this.game.data.gameKeys.PRESS_DEBUG_MODE){
            this.game.setState(gameStates.DEBUG_MODE)
        }
    }
}





