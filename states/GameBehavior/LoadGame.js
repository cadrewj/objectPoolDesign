import { State } from "../state.js";

export default class Loading extends State{
    constructor(game){
        super("LOADING"); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        this.ready = false;
        this.keyPressed = false;

       
    }
    enter(){
    }
    handleInput(input, context, timeStamp){  
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
            // this.handleInputLoadingAnimation(timeStamp)
        }
       
    }
    handleLoadingAnimation(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
          // Calculate the distance of shootSlime from the center of the canvas
          const distanceToCenter = Math.sqrt((shootSlime.dx - shootSlime.canvasWidth/2) ** 2 + (shootSlime.dy - shootSlime.canvasHeight/2) ** 2);
      
          //clear canvas to create a transparent background
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx2.save();
          //rain need
          if (timer > frameInterval) {
              ctx2.fillStyle = "rgba(0,0,0, 0.07)"; // clear the screen
              ctx2.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
              ctx2.textAlign = "center";
              ctx2.fillStyle = "#0aff0a";
              ctx2.font = rain.fontSize + "px monospace";
              rain.symbols.forEach((symbol) => {
              // Calculate the distance from symbol's y-coordinate to the center y-coordinate
              const distanceToCenterY = Math.abs(symbol.y * rain.fontSize - miniMapCanvas.height / 2);
              const distanceToCenterX = Math.abs(symbol.x * rain.fontSize - miniMapCanvas.width / 2);
              // Define the threshold (adjust this value as needed to control the eye shade effect)
              const threshold = 100; //canvas.width * 0.11;
      
              // Determine whether to apply the gradient based on the distance to the center
              const applyGradient = distanceToCenterY < threshold && distanceToCenterX < threshold;
      
              symbol.draw(ctx2, applyGradient); // Pass the applyGradient value to the draw method
              symbol.update();
              });
      
              timer = 0;
          } 
          else {
                  timer += deltaTime;
          }
    }
    

}







