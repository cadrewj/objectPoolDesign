import { State, gameStates } from "../state.js"

export default class StartNewGame extends State{
    constructor(game){
        super("START NEW GAME"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        this.alpha = 8; 
    }
    enter(){
        this.game.init(this.game.width, this.game.height, this.game.data)
        console.log(this.game, "entered new game")

        this.alpha = 8;
        // console.log("enter new game state", this.game)
    }
    handleInput(input, context){
        if(!this.game.gameOver && this.alpha > 0){
            do{
                this.displayMessage(context)
                this.alpha -= 0.1
            }while(!this.alpha === 0)
        }

        else if(this.game.gameOver){
            this.game.setState(gameStates.GAME_OVER);
        }
    }
    displayMessage(context){
        context.beginPath()
        context.font = `${this.game.data.FONT_DISPLAY_TEXT_SIZE} ${this.game.data.FONT_DISPLAY_TEXT}`;
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign = "center"
        context.fillText("Forage Snail", this.game.width/2, this.game.height/2 - 130)
     
        context.beginPath()
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign = "center"
        context.font = `${this.game.data.FONT_DISPLAY_SUBTEXT_SIZE} ${this.game.data.FONT_DISPLAY_SUBTEXT}`;
        context.fillText("New Game", this.game.width/2 , this.game.height/2 - 70)
    }
}





