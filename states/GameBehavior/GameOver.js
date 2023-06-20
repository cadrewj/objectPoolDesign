import { State, gameStates } from "../state.js"

export default class GameOver extends State{
    constructor(game){
        super("GAME OVER"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = {
            data: game.data,
            width: game.width,
            height: game.height,
        }
        this.state = game;
       
    }
    enter(){
        console.log("enter gameover state")


    }
    handleInput(input, context){
        this.displayMessage(context)
        if(input.lastKey === this.game.data.GAME_PRESS_ENTER || input.isMouseDown){ 
            this.state.setState(gameStates.START_NEW_GAME); //set the player current state to standing right
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
        context.fillText("Try Again", this.game.width/2 , this.game.height/2 + this.game.data.FONT_DISPLAY_SUBTEXT_SIZE)
    }
}





