import { State, shipStates } from "../state.js"

export class SpaceshipThrust extends State{
    constructor(spaceship){
        super("SPACESHIP THRUST"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
    }
    enter(){
        this.spaceship.ship.frame.y = 0; //the row position of the player image you want to use
        this.spaceship.maxFrames = 59;  //the max number of columns for the player image
        console.log("entered REve thrusting state")
        // this.spaceship.thrust.x = 0;
    }
    handleInput(input){
        if(input === "PRESS ArrowDown"){ // note: "d" = right
            this.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST); //set the player current state to standing right
        }
        else if(input === "RELEASE ArrowUp"){
            this.spaceship.setState(shipStates.SPACESHIP_IDLE);
        }

    }
}
export class SpaceshipReverseThrust  extends State{
    constructor(spaceship){
        super("SPACESHIP REVERSE THRUST"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
    }
    enter(){
        this.spaceship.ship.frame.y = 0; //the row position of the player image you want to use
        this.spaceship.maxFrames = 59;  //the max number of columns for the player image
        console.log("entered thrusting state")
        // this.spaceship.thrust.x = 0;
    }
    handleInput(input){
        if(input === "PRESS ArrowUp"){ // note: "d" = right
            this.spaceship.setState(shipStates.SPACESHIP_THRUST); //set the player current state to standing right
        }
        else if( input === "RELEASE ArrowDown"){
            this.spaceship.setState(shipStates.SPACESHIP_IDLE);
        }

    }
}




