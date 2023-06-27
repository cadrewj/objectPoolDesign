import { State, shipStates, gameStates } from "../state.js"
import { game } from "../../main.js";

export default class SpaceshipExploding extends State{
    constructor(spaceship){
        super("SPACESHIP EXPLODING"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
        this.game = {
            data: spaceship.game.data
        }
    }
    enter(){
        this.spaceship.canShoot = false; 
    }
    handleInput(input, context){
        if(this.spaceship.exploding){
            this.spaceship.drawExplodingShip(context);
            this.spaceship.explodeTime--;
            if (this.spaceship.explodeTime === 0) {
                this.spaceship.lives--;
                if(this.spaceship.lives <= 0){
                    this.spaceship.explodeTime = Math.ceil(this.game.data.SPACESHIP_EXPLODING_DUR * this.game.data.FPS); // make it stick in exploding mode or reset exploding time
                    game.setState(gameStates.GAME_OVER);//set to game over
                }
                else{
                    this.spaceship.exploding = false;
                    this.spaceship.setState(shipStates.SPACESHIP_IDLE)
                }
            }   
        }
    }
}







