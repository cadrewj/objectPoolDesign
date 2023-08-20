import { State, shipStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export class SpaceshipThrust extends State{
    constructor(game){
        super("SPACESHIP THRUST", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        // this.spaceship = this.game.spaceship;
    }
    enter(){
        if(!this.game.player.playerIsInSpace){
            this.game.spaceship.thrusting = true;  
            // this.game.universe.velocity.x = this.game.spaceship.thrust.x; 
            // this.game.universe.velocity.y = this.game.spaceship.thrust.y;
        }
    }
    handleInput(input, context, playerIsInSpace){
        // console.log(this.game.spaceship.position.x, this.game.spaceship.position.y )
        if(!playerIsInSpace){
            if(this.game.spaceship.fuel > 0 &&  !this.game.spaceship.exploding){   
                this.game.spaceship.animate = true; 
                // console.log("entered thrusting state")
                // add thrust and friction
                // acceleration of the ship in pixels per second per second 
                const thrustAngle = this.game.spaceship.angle - degToRad(90)//Math.PI / 2; // adjust for the image facing upwards
                this.game.universe.angle = thrustAngle
    
                this.game.spaceship.thrust.x += this.game.data.SPACESHIP_THRUST * Math.cos(thrustAngle)/ this.game.data.FPS;
                this.game.spaceship.thrust.y += this.game.data.SPACESHIP_THRUST * Math.sin(thrustAngle)/ this.game.data.FPS;
                this.game.spaceship.drawThruster(context) 
            }
            
            if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){
                // this.game.universe.velocity.x = -this.game.spaceship.thrust.x; 
                // this.game.universe.velocity.y = -this.game.spaceship.thrust.y;
    
                this.game.spaceship.accelartionTime++;
                this.fuelConsumption(input);
            }
            else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){ // note: "d" = right
                // this.game.universe.velocity.x = -this.game.spaceship.thrust.x; 
                // this.game.universe.velocity.y = -this.game.spaceship.thrust.y;
                this.game.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST); //set the player current state to standing right
            }
            else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
                || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){  
                this.game.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION);
            }
            else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_RELEASE_UP){
                // this.game.universe.velocity.x = 0; 
                // this.game.universe.velocity.y = 0;
                this.game.spaceship.setState(shipStates.SPACESHIP_IDLE);
            }
            else if (input.isMouseDown){
                this.game.spaceship.setState(shipStates.SPACESHIP_SHOOT);
            }
            else if(this.game.spaceship.exploding){
                this.game.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
            }
        }
        else{
            this.game.spaceship.setState(shipStates.SPACESHIP_IDLE);
        }

    }
    fuelConsumption(input){
        let burntFuel = 0;
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){
            burntFuel = this.game.data.SPACESHIP_FUEL_CONSUMPTION * (this.game.spaceship.accelartionTime * this.game.data.SPACESHIP_THRUSTER_CONSUMPTION_RATIO)   
        }
        if (this.game.spaceship.fuel > 0){
            this.game.spaceship.fuel -= burntFuel;
            // console.log(burntFuel)
        }
        else if (this.game.spaceship.fuel <= 0){
            console.log("cant thrust")
        }
    }
}
export class SpaceshipReverseThrust  extends State{
    constructor(game){
        super("SPACESHIP REVERSE THRUST", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        // this.spaceship = this.game.spaceship;
    }
    enter(){  
        this.game.spaceship.thrusting = false;
   
    }
    handleInput(input, context, playerIsInSpace){
       if(!playerIsInSpace){
            if(this.game.spaceship.fuel > 0 &&  !this.game.spaceship.exploding){    
                this.game.spaceship.animate = true; 
                // console.log("entered  rev thrusting state")
                // this.game.spaceship.thrust.x = 0;
                const thrustAngle = this.game.spaceship.angle + degToRad(90)//Math.PI / 2; // adjust for the image facing upwards
                this.game.universe.angle = thrustAngle;
                
                this.game.spaceship.thrust.x += this.game.data.SPACESHIP_THRUST_REV * Math.cos(thrustAngle) / this.game.data.FPS; 
                this.game.spaceship.thrust.y += this.game.data.SPACESHIP_THRUST_REV * Math.sin(thrustAngle) / this.game.data.FPS;
                this.game.spaceship.drawRevThruster(context)
            }    
            

            if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){
                // this.game.universe.velocity.x = this.game.spaceship.thrust.x; 
                // this.game.universe.velocity.y = this.game.spaceship.thrust.y;
                this.game.spaceship.decelerationTime++;
                this.fuelConsumption(input);
            }
            else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){
                // this.game.universe.velocity.x = this.game.spaceship.thrust.x; 
                // this.game.universe.velocity.y = this.game.spaceship.thrust.y;
                this.game.spaceship.setState(shipStates.SPACESHIP_THRUST); //set the player current state to standing right
            }
            else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
                || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){  
                this.game.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION);
            }
            else if( input.shipLastKey === this.game.data.gameKeys.SPACESHIP_RELEASE_DOWN){
                // this.game.universe.velocity.x = 0; 
                // this.game.universe.velocity.y = 0;
                this.game.spaceship.setState(shipStates.SPACESHIP_IDLE);
            }
            else if (input.isMouseDown){
                this.game.spaceship.setState(shipStates.SPACESHIP_SHOOT);
            }
            else if(this.game.spaceship.exploding){
                this.game.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
            }
        }
    }
    fuelConsumption(input){
        let burntFuel = 0;
 
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){
            burntFuel = this.game.data.SPACESHIP_FUEL_CONSUMPTION * (this.game.spaceship.decelerationTime * this.game.data.SPACESHIP_THRUSTER_CONSUMPTION_RATIO)
        }
        if (this.game.spaceship.fuel > 0){
            this.game.spaceship.fuel -= burntFuel;
            // console.log(burntFuel)
        }
        else if (this.game.spaceship.fuel <= 0){
            console.log("cant REv thrust")
        }
    }
}




