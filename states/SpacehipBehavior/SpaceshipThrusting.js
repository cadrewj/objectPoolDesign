import { State, shipStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export class SpaceshipThrust extends State{
    constructor(spaceship){
        super("SPACESHIP THRUST"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
        this.game = {
            data: spaceship.game.data
        }
    }
    enter(){
        this.spaceship.thrusting = true;
        if(this.spaceship.fuel > 0 && this.spaceship.lives !== 0){    
            // console.log("entered thrusting state")
            // add thrust and friction
            // acceleration of the ship in pixels per second per second 
            const thrustAngle = this.spaceship.angle - degToRad(90)//Math.PI / 2; // adjust for the image facing upwards
            this.spaceship.thrust.x += this.game.data.SPACESHIP_THRUST * Math.cos(thrustAngle) // this.game.data.FPS;
            this.spaceship.thrust.y += this.game.data.SPACESHIP_THRUST * Math.sin(thrustAngle) // this.game.data.FPS;
        }
    }
    handleInput(input, context){
        this.spaceship.drawThruster(context) 
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){ // note: "d" = right
            this.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST); //set the player current state to standing right
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
            || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){  
            this.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION);
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_RELEASE_UP){
            this.spaceship.setState(shipStates.SPACESHIP_IDLE);
        }
        else if (input.isMouseDown){
            this.spaceship.setState(shipStates.SPACESHIP_SHOOT);
        }
    }
}
export class SpaceshipReverseThrust  extends State{
    constructor(spaceship){
        super("SPACESHIP REVERSE THRUST"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
        this.game = {
            data: spaceship.game.data
        }
    }
    enter(){
        this.spaceship.thrusting = false;
        if(this.spaceship.fuel > 0 && this.spaceship.lives !== 0){
            // console.log("entered  rev thrusting state")
            // this.spaceship.thrust.x = 0;
            const thrustAngle = this.spaceship.angle + Math.PI / 2; // adjust for the image facing upwards
            this.spaceship.thrust.x += this.game.data.SPACESHIP_THRUST_REV * Math.cos(thrustAngle) // this.game.data.FPS; 
            this.spaceship.thrust.y += this.game.data.SPACESHIP_THRUST_REV * Math.sin(thrustAngle) // this.game.data.FPS;
        }    
    }
    handleInput(input, context){
       this.spaceship.drawRevThruster(context)
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){
            this.spaceship.setState(shipStates.SPACESHIP_THRUST); //set the player current state to standing right
        }
        else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
            || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){  
            this.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION);
        }
        else if( input.shipLastKey === this.game.data.gameKeys.SPACESHIP_RELEASE_DOWN){
            this.spaceship.setState(shipStates.SPACESHIP_IDLE);
        }
        else if (input.isMouseDown){
            this.spaceship.setState(shipStates.SPACESHIP_SHOOT);
        }
    }
}




