import { State, gameStates } from "../state.js"
import { game } from "../../main.js";

export default class StartNewGame extends State{
    constructor(game){
        super("START NEW GAME"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = {
            data: game.data,
            width: game.width,
            height: game.height,
            gameOver: game.gameOver
        }
        this.alpha = 8; 
        this.state = game;
    }
    enter(){
        console.log(this.state, "entered new game")
        // this.state.init(this.game.width, this.game.height, this.game.data)
        game.init(this.game.width, this.game.height, this.game.data)

        this.alpha = 8;
        console.log("enter new game state", this.state, this.game.gameOver)
    }
    handleInput(input, context, spaceship){
        if(!this.game.gameOver && this.alpha > 0){
            do{
                this.displayMessage(context)
                this.alpha -= 0.1
            }while(!this.alpha === 0)
        }
       else if(spaceship.lives <= 0){
            this.game.gameOver = true; 
            this.state.setState(gameStates.GAME_OVER); //set the player current state to standing right
        }
    }
    displayMessage(context){
        context.beginPath()
        context.font = `${this.game.data.FONT_DISPLAY_TEXT_SIZE} ${this.game.data.FONT_DISPLAY_TEXT}`;
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign = "center"
        context.fillText("Forage Snail", this.game.width/2, this.game.height/2)
     
        context.beginPath()
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign = "center"
        context.font = `${this.game.data.FONT_DISPLAY_SUBTEXT_SIZE} ${this.game.data.FONT_DISPLAY_SUBTEXT}`;
        context.fillText("Start New Game", this.game.width/2 , this.game.height/2 + 70)
    }
}





