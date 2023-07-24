import { State, shipStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export default class SpaceshipShootLaser extends State{
    constructor(game){
        super("SPACESHIP SHOOT LASER", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;

    }
    enter(){
        if(!this.game.spaceship.exploding){
            for(let i = 0; i < this.game.spaceship.lasers.length; i++){
                const canShoot = this.game.spaceship.fuel > 0;
                this.game.spaceship.canShoot = canShoot;
                let laser = this.game.spaceship.lasers[i]
                if(canShoot && laser.free){
                    let angle = this.game.spaceship.angle -  degToRad(90); //Math.PI / 2; // adjust for the image facing upwards
                     //the location you are shooting from is the nose of the ship
                    laser = {
                        x: this.game.spaceship.position.x + this.game.spaceship.ship.radius * Math.cos(angle), // from center of the ship draw a line
                        y: this.game.spaceship.position.y + this.game.spaceship.ship.radius * Math.sin(angle),
                        velocity: {
                            x:this.game.data.SPACESHIP_LASER_SPEED * Math.cos(angle) / this.game.data.FPS,
                            y: this.game.data.SPACESHIP_LASER_SPEED * Math.sin(angle) / this.game.data.FPS,
                        },
                        dist: 0,
                        explodeTime: 0,
                        free: false
                    }
                    this.game.spaceship.lasers[i] = laser;
                    return;
                }
            }     
        } 
    }
    handleInput(input, context){
        if(input.isMouseDown){
            this.game.spaceship.shots++;
            this.fuelConsumption(input);
        }
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
            || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){ 
            this.game.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION)   
        }
        else if (input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){
            this.game.spaceship.setState(shipStates.SPACESHIP_THRUST);
        }
        else if (input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){
            this.game.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST);
        }
        else if (!input.isMouseDown){
            this.game.spaceship.shots = 0;
            this.game.spaceship.setState(shipStates.SPACESHIP_IDLE);
        }
        else if(this.game.spaceship.exploding){
            this.game.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
        }
    }
    fuelConsumption(input, context){
        let burntFuel = 0;
 
        if(input.isMouseDown){
            burntFuel = this.game.data.SPACESHIP_LASER_CONSUMPTION * (this.game.spaceship.shots * this.game.data.SPACESHIP_LASER_CONSUMPTION_RATIO)
        } 
        if (this.game.spaceship.fuel > 0){
            this.game.spaceship.fuel -= burntFuel;
            // console.log(burntFuel)
        }
        else if (this.game.spaceship.fuel <= 0){
            console.log("cant shoot no fuel")
        }
    }
}





