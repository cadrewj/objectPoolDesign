import { State, gameStates } from "../state.js"

export default class StartNewGame extends State{
    constructor(game){
        super("START NEW GAME"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = {
            data: game.data,
            width: game.width,
            height: game.height,
        } 
        this.state = game;
    }
    enter(){
        console.log("enter new game state")
    }
    handleInput(input, context){
        this.displayMessage(context)
        if(input.lastKey === this.game.data.GAME_PRESS_ENTER || input.isMouseDown){ 
            this.state.setState(gameStates.GAME_OVER); //set the player current state to standing right
        }
    }
    displayMessage(context){
        context.beginPath()
        context.font = `${this.game.data.FONT_DISPLAY_TEXT_SIZE} ${this.game.data.FONT_DISPLAY_TEXT}`;
        context.fillStyle = "white"
        context.textAlign = "center"
        context.fillText("Forage Snail", this.game.width/2, this.game.height/2)
        context.beginPath()
        context.font = `${this.game.data.FONT_DISPLAY_SUBTEXT_SIZE} ${this.game.data.FONT_DISPLAY_SUBTEXT}`;
        context.fillStyle = "white"
        context.textAlign = "center"
        context.fillText("Start New Game", this.game.width/2 , this.game.height/2 + 70)
    }
}





