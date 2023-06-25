import { State, gameStates } from "../state.js"
import { stopGame } from "../../main.js";

export default class GameOver extends State{
    constructor(game){
        super("GAME OVER"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = {
            data: game.data,
            width: game.width,
            height: game.height,
            gameOver: game.gameOver
        }
        this.state = game;
        this.alpha = 8; 
       
    }
    enter(){
        this.alpha = 8; 
        this.game.gameOver = true;

        console.log("enter gameover state", this.game.gameOver)
    }
    handleInput(input, context, game){
        if(game.gameOver){
            do{
                this.displayMessage(context)
                this.alpha -= 0.1
            }while(!this.alpha === 0);
            cancelAnimationFrame(stopGame);
        }
        else if (game.gameOver && input.gameLastKey === game.data.gameKeys.PRESS_ENTER){
            this.state.setState(gameStates.START_NEW_GAME);
        }
    }
    displayMessage(context){
        context.beginPath()
        context.font = `${this.game.data.FONT_DISPLAY_TEXT_SIZE} ${this.game.data.FONT_DISPLAY_TEXT}`;
        context.fillStyle = "white"
        context.textAlign= "center"
        context.fillText("Game Over", this.game.width/2, this.game.height/2)
        context.beginPath()
        context.font = `${this.game.data.FONT_DISPLAY_SUBTEXT_SIZE} ${this.game.data.FONT_DISPLAY_SUBTEXT}`;
        context.fillStyle = "white"
        context.textAlign = "center"
        context.fillText("To Try Again Press Enter", this.game.width/2 , this.game.height/2 + 72)
    }
}





