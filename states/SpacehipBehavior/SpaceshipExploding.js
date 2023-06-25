import { State, shipStates } from "../state.js"

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
                if(this.spaceship.lives === 0){
                    console.log("need to set state to gameover ")
                    //this.state.setState(gameStates.START_NEW_GAME);//set to game over
                }
                else{
                    this.spaceship.exploding = false;
                    console.log("lives", this.spaceship.lives)
                    this.spaceship.setState(shipStates.SPACESHIP_IDLE)
                }
            }   
        }
    }
}







