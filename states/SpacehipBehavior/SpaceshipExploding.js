import { State, shipStates, gameStates } from "../state.js"

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

                if(this.game.player.lives >= 0 && !this.game.player.playerIsInSpace){
                    this.game.setState(gameStates.GAME_OVER);//set to game over
                }
                else if(this.game.spaceship.lives <= 0 && this.game.player.lives <= 0){
                    this.game.spaceship.explodeTime = Math.ceil(this.game.data.SPACESHIP_EXPLODING_DUR * this.game.data.FPS); // make it stick in exploding mode or reset exploding time
                    // if(this.game.player.lives <= 0 ){
                    this.game.setState(gameStates.GAME_OVER);//set to game over
                    // }  
                }
                else{
                    this.game.spaceship.exploding = false;
                    this.game.spaceship.setState(shipStates.SPACESHIP_BLINKING)
                }
            }   
        }
    }
}







