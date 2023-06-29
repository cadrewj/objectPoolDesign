import { State, shipStates } from "../state.js"

export default class SpaceshipBlinking extends State{
    constructor(game){
        super("SPACESHIP BLINKING", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        // this.spaceship = this.game.spaceship;
    }
    enter(){
        // this.blinkOn = this.blinkNum % 2 == 0;
        // this.exploding = this.explodeTime > 0;
    }
    handleInput(input, context){
        // if(!this.game.spaceship.exploding && this.game.spaceship.blinkNum > 0){
            // if (this.game.spaceship.blinkNum > 0) {
            //     this.game.spaceship.blinkTime--;
            //     if (this.game.spaceship.blinkTime == 0) {
            //         this.game.spaceship.blinkTime = Math.ceil(this.game.data.SPACESHIP_BLINK_DUR * this.game.data.FPS);
            //         this.game.spaceship.blinkNum--;
            //     }
            // }
            this.game.spaceship.setState(shipStates.SPACESHIP_IDLE)    
        // }  
        
    }
}



