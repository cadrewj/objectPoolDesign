

import { State, shipStates } from "../state.js"

export default class SpaceshipBlinking extends State{
    constructor(spaceship){
        super("SPACESHIP BLINKING"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.spaceship = spaceship;
        this.game = {
            data: spaceship.game.data
        }
    }
    enter(){
        // this.blinkOn = this.blinkNum % 2 == 0;
        // this.exploding = this.explodeTime > 0;
    }
    handleInput(input, context){
        // if(!this.spaceship.exploding && this.spaceship.blinkNum > 0){
            if (this.spaceship.blinkNum > 0) {
                this.spaceship.blinkTime--;
                if (this.spaceship.blinkTime == 0) {
                    this.spaceship.blinkTime = Math.ceil(this.game.data.SPACESHIP_BLINK_DUR * this.game.data.FPS);
                    this.spaceship.blinkNum--;
                }
            }
            this.spaceship.setState(shipStates.SPACESHIP_IDLE)    
        // }  
        
    }
}



