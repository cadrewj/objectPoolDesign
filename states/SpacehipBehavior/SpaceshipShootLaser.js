import { State, shipStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export default class SpaceshipShootLaser extends State{
    constructor(spaceship){
        super("SPACESHIP SHOOT LASER"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
        this.game = {
            data: spaceship.game.data
        }
    }
    enter(){
        for(let i = 0; i < this.spaceship.lasers.length; i++){
            const canShoot = this.spaceship.fuel > 0;
            let laser = this.spaceship.lasers[i]
            if(canShoot && laser.free){
                let angle = this.spaceship.angle -  degToRad(90); //Math.PI / 2; // adjust for the image facing upwards
                 //the location you are shooting from is the nose of the ship
                laser = {
                    x: this.spaceship.position.x + this.spaceship.ship.radius * Math.cos(angle), // from center of the ship draw a line
                    y: this.spaceship.position.y + this.spaceship.ship.radius * Math.sin(angle),
                    velocity: {
                        x:this.game.data.SPACESHIP_LASER_SPEED * Math.cos(angle) / this.game.data.FPS,
                        y: this.game.data.SPACESHIP_LASER_SPEED * Math.sin(angle) / this.game.data.FPS,
                    },
                    dist: 0,
                    explodeTime: 0,
                    free: false
                }
                this.spaceship.lasers[i] = laser;
                return;
            }
        }     
    }
    handleInput(input){
        if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
            || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){ 
            this.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION)   
        }
        else if (input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_UP){
            this.spaceship.setState(shipStates.SPACESHIP_THRUST);
        }
        else if (input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_DOWN){
            this.spaceship.setState(shipStates.SPACESHIP_REVERSE_THRUST);
        }
        else if (!input.isMouseDown){
            this.spaceship.setState(shipStates.SPACESHIP_IDLE);
        }
    }
}





