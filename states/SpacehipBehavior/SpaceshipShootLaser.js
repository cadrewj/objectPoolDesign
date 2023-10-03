import { State, shipStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export default class SpaceshipShootLaser extends State{
    constructor(game){
        super("SPACESHIP SHOOT LASER", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;

    }
    enter(){
        if(!this.game.spaceship.exploding){
            const canShoot = this.game.spaceship.fuel > 0;
            this.game.spaceship.canShoot = canShoot;
        } 
    }
    handleInput(input, context){
        if(input.isMouseDown){
            this.game.spaceship.shootLaser();
            
            this.game.spaceship.fuelConsumption(this.game.spaceship.canShoot);
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
   
}





