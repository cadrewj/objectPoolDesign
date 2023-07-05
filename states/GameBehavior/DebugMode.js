import { State, gameStates } from "../state.js"
import { degToRad } from "../../utilityFunctions/utilityFunctions.js";

export default class DebugMode extends State{
    constructor(game){
        super("DEBUG MODE"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
       
    }
    enter(){
        this.game.debug = !this.game.debug;
    }
    handleInput(input, context){
        if(this.game.debug){ //used for testing spaceship
            context.beginPath()
            context.fillStyle = "rgba(234, 233, 0, 0.1)";
            context.fillRect(this.game.spaceship.cameraBox.position.x, this.game.spaceship.cameraBox.position.y, this.game.spaceship.cameraBox.width, this.game.spaceship.cameraBox.height);

            //draw hit circle for spaceship
            context.beginPath()
            context.strokeStyle = "black";
            context.arc(this.game.spaceship.hitCircle.position.x, this.game.spaceship.hitCircle.position.y, this.game.spaceship.hitCircle.radius, 0, degToRad(360), false);
            context.stroke();

            //used for testing on the player
            //draw cameraBox
            context.beginPath()
            context.fillStyle = "rgba(211, 232, 200, 0.1)";
            context.fillRect(this.game.player.camerabox.position.x, this.game.player.camerabox.position.y, this.game.player.camerabox.width, this.game.player.camerabox.height);

            //draw hitbox on player
            context.beginPath()
            context.strokeStyle = "rgba(255, 0, 0, 1)";
            // context.strokeRect(this.game.player.hitbox.position.x, this.game.player.hitbox.position.y, this.game.player.hitbox.width, this.game.player.hitbox.height);
            context.arc(this.game.player.hitCircle.position.x, this.game.player.hitCircle.position.y, this.game.player.hitCircle.width, 0, degToRad(360), false);
            context.stroke();


            //enemies hit circle
            this.game.enemies.forEach(enemy => {
                // if(!enemy.free){
                    context.beginPath()
                    context.arc(enemy.hitCircle.position.x, enemy.hitCircle.position.y, enemy.hitCircle.width, 0, degToRad(360), false);
                    context.stroke();
                // }
            });
          
        }
    }

}





