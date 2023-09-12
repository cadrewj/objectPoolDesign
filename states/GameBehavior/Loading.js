import { State, gameStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export default class Loading extends State{
    constructor(game){
        super("LOADING"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        this.ready = false;
        this.keyPressed = false;

       
    }
    enter(){
    }
    handleInput(input, context){  
        if(this.ready){ //&& NewGameClicked
            console.log("Starting new Game")
            this.game.setState(gameStates.NEW_GAME);
        }
        else if(this.ready) {// && ContinueClicked
            console.log("Continue old game")
            this.game.setState(gameStates.RESUME_GAME);
        }
        else if(!this.ready){
            // console.log("Loading")
        }
       
    }
    toggleInAndOutLoading(input){
    //     //
    //     if(){ if clicked new game start new 
    //         if (!this.keyPressed) {
    //             this.game.ready = !this.game.ready;
    //             this.keyPressed = true; // Mark the key as pressed
    //         }
            
    //     } else {
    //         // Reset the keyPressed flag when the key is released
    //         this.keyPressed = false;
    //     }
    }

}





