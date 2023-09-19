import { State, gameStates } from "../state.js"

export default class GameOver extends State{
    constructor(game){
        super("GAME OVER"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.alpha = 12; 
        this.game = game;
       
    }
    enter(){
        this.game.gameOver = true;
        this.game.spaceship.exploding = true;
        this.game.spaceship.explodeTime = 1;
    }
    handleInput(input, context){
        if(this.game.gameOver && this.alpha > 0){
            do{
                this.displayMessage(context)
                this.alpha -= 0.1
            }while(!this.alpha === 0)
        }
        else if (input.gameLastKey === this.game.data.gameKeys.PRESS_ENTER){
            // console.log("go")
            this.game.setState(gameStates.NEW_GAME);
            this.alpha = 8;
        }
    }
    displayMessage(context){
        context.font = `${this.game.data.FONT_DISPLAY_TEXT_SIZE} ${this.game.data.FONT_DISPLAY_TEXT}`;
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign= "center"
        context.fillText("Game Over", this.game.width/2, this.game.height/2)
        
        context.font = `${this.game.data.FONT_DISPLAY_SUBTEXT_SIZE} ${this.game.data.FONT_DISPLAY_SUBTEXT}`;
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign = "center"
        context.fillText("Try Again, [Press Enter]", this.game.width/2 , this.game.height/2 + 72)
    }
}





