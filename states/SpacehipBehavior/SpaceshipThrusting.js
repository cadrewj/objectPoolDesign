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
     
    }
    handleInput(input, context){
        if(this.spaceship.fuel > 0 &&  !this.spaceship.exploding){   
            this.spaceship.animate = true; 
            // console.log("entered thrusting state")
            // add thrust and friction
            // acceleration of the ship in pixels per second per second 
            const thrustAngle = this.spaceship.angle - degToRad(90)//Math.PI / 2; // adjust for the image facing upwards
            this.spaceship.thrust.x += this.game.data.SPACESHIP_THRUST * Math.cos(thrustAngle)/ this.game.data.FPS;
            this.spaceship.thrust.y += this.game.data.SPACESHIP_THRUST * Math.sin(thrustAngle)/ this.game.data.FPS;
            this.spaceship.drawThruster(context) 
        }
        
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){
            this.spaceship.accelartionTime++;
            this.fuelConsumption(input);
        }
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
        else if(this.spaceship.exploding){
            this.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
        }
    }
    fuelConsumption(input){
        let burntFuel = 0;
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){
            burntFuel = this.game.data.SPACESHIP_FUEL_CONSUMPTION * (this.spaceship.accelartionTime * this.game.data.SPACESHIP_THRUSTER_CONSUMPTION_RATIO)   
        }
        if (this.spaceship.fuel > 0){
            this.spaceship.fuel -= burntFuel;
            // console.log(burntFuel)
        }
        else if (this.spaceship.fuel <= 0){
            console.log("cant thrust")
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
   
    }
    handleInput(input, context){
        if(this.spaceship.fuel > 0 &&  !this.spaceship.exploding){    
            this.spaceship.animate = true; 
            // console.log("entered  rev thrusting state")
            // this.spaceship.thrust.x = 0;
            const thrustAngle = this.spaceship.angle + Math.PI / 2; // adjust for the image facing upwards
            this.spaceship.thrust.x += this.game.data.SPACESHIP_THRUST_REV * Math.cos(thrustAngle) / this.game.data.FPS; 
            this.spaceship.thrust.y += this.game.data.SPACESHIP_THRUST_REV * Math.sin(thrustAngle) / this.game.data.FPS;
            this.spaceship.drawRevThruster(context)
        }    
        

        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){
            this.spaceship.decelerationTime++;
            this.fuelConsumption(input);
        }
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
        else if(this.spaceship.exploding){
            this.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
        }
    }
    fuelConsumption(input){
        let burntFuel = 0;
 
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){
            burntFuel = this.game.data.SPACESHIP_FUEL_CONSUMPTION * (this.spaceship.decelerationTime * this.game.data.SPACESHIP_THRUSTER_CONSUMPTION_RATIO)
        }
        if (this.spaceship.fuel > 0){
            this.spaceship.fuel -= burntFuel;
            // console.log(burntFuel)
        }
        else if (this.spaceship.fuel <= 0){
            console.log("cant REv thrust")
        }
    }
}




