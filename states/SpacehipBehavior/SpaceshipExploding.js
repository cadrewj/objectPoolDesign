import { State, shipStates, gameStates } from "../state.js"
// import { game } from "../../main.js";

export default class SpaceshipExploding extends State{
    constructor(game){
        super("SPACESHIP EXPLODING", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game
    }
    enter(){
        this.game.spaceship.canShoot = false; 
    }
    handleInput(input, context){
        if(this.game.spaceship.exploding){
            this.game.spaceship.drawExplodingShip(context);
            this.game.spaceship.explodeTime--;
            if (this.game.spaceship.explodeTime === 0) {
                this.game.spaceship.lives--;

                if(this.game.spaceship.lives <= 0){
                    this.game.spaceship.explodeTime = Math.ceil(this.game.data.SPACESHIP_EXPLODING_DUR * this.game.data.FPS); // make it stick in exploding mode or reset exploding time
                    this.game.setState(gameStates.GAME_OVER);//set to game over
                }
                else{
                    this.game.spaceship.exploding = false;
                    this.game.spaceship.setState(shipStates.SPACESHIP_BLINKING)
                }
            }   
        }
    }
}







