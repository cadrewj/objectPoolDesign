import { State, gameStates } from "../state.js"

export default class StartNewGame extends State{
    constructor(game){
        super("START NEW GAME"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        this.alpha = 8; 
    }
    enter(){
        //    game.init(canvas.width, canvas.height, miniMapCanvas.width, miniMapCanvas.height, {...gameData, gameKeys}, ctx);
        if(this.game.gameOver){
            this.game.init(this.game.width, this.game.height, this.game.miniMapWidth, this.game.miniMapHeight, this.game.data)
            this.game.isLoading = false;
            this.game.setState(gameStates.NEW_GAME);
            // console.log("done ......")
        }
        // console.log(this.game, "entered new game")

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
        context.font = `${this.game.data.FONT_DISPLAY_TEXT_SIZE} ${this.game.data.FONT_DISPLAY_TEXT}`;
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign = "center"
        context.fillText("Forage Snail", this.game.width/2, this.game.height/2 - 130)
     
     
        context.fillStyle = `rgba(255,255,255,${this.alpha})`
        context.textAlign = "center"
        context.font = `${this.game.data.FONT_DISPLAY_SUBTEXT_SIZE} ${this.game.data.FONT_DISPLAY_SUBTEXT}`;
        // context.fillText("New Game", this.game.width/2 , this.game.height/2 - 70)
        context.fillText("New Game", this.game.camera.position.x/2 , this.game.camera.position.y/2 - 70)
    }
}





