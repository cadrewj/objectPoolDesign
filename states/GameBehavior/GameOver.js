import { State, gameStates } from "../state.js"

export default class GameOver extends State{
    constructor(game){
        super("GAME OVER"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.alpha = 8; 
        this.game = game;
       
    }
    enter(){
        this.game.gameOver = true;
        console.log("enter gameover state", this.game)
    }
    handleInput(input, context){
        if(this.game.gameOver && this.alpha > 0){
            do{
                this.displayMessage(context)
                this.alpha -= 0.1
            }while(!this.alpha === 0)
        }
        else if (input.gameLastKey === "PRESS Enter"){
            console.log("go")
            this.game.setState(gameStates.NEW_GAME);
            this.alpha = 8;
        }
    }
    displayMessage(context){
        context.beginPath()
        context.font = `${this.game.data.FONT_DISPLAY_TEXT_SIZE} ${this.game.data.FONT_DISPLAY_TEXT}`;
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign= "center"
        context.fillText("Game Over", this.game.width/2, this.game.height/2)
        context.beginPath()
        context.font = `${this.game.data.FONT_DISPLAY_SUBTEXT_SIZE} ${this.game.data.FONT_DISPLAY_SUBTEXT}`;
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign = "center"
        context.fillText("Try Again, Press Enter", this.game.width/2 , this.game.height/2 + 72)
    }
}





