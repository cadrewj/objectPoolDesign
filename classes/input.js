import data from "../data/data.json" assert { type: "json" }

class InputHandler{
    constructor(game){
        this.game = game;
        this.keys = [];
        window.addEventListener("keydown", (e)=>{      
            const pressedKey = e.key;
            //player keys
            if((pressedKey === "w" || pressedKey === "s" || pressedKey === "d" || pressedKey === "a" || pressedKey ===  "g")
                && this.keys.indexOf(pressedKey)=== -1){
                    this.keys.push(pressedKey)
            }
          
            //spaceship keys
            if (this.game.spaceship.lives === 0 || data.AUTOMATION_ON === true){
                return
            }
            switch(pressedKey){
                case "Enter": //enter
                    console.log("pressed enter")
                    break;
                case " ": //spacebar (spaceship shoot laser)
                case "Spacebar":  // if the event.key value matches either " " or "Spacebar", since In most web browsers, the event key for the spacebar is "Spacebar" or " ". 
                    // console.log("shooting");
                    this.game.spaceship.canShoot = this.game.spaceship.fuel > 0 
                    this.game.spaceship.shooting = true; 
                    this.game.spaceship.shots++;
                break;
                case "ArrowLeft": //left arrow (rotate spaceship left)
                    // rotateSpaceShip(false)
                    this.game.spaceship.rotation = -0.05; ;//data.SPACESHIP_TURN_SPEED / degToRad(180) / data.FPS / 30
                break;
                case "ArrowUp": //up arrow (thrust forward spaceship up)
                    this.game.spaceship.thrusting = true;
                    this.game.spaceship.accelartionTime++;  
                    console.log("up ",this.game.spaceship.thrusting)    
                    // this.ship.thrustWithFriction();
                //    this.ship.y--;
                break;
                case "ArrowRight": //right arrow (rotate spaceship right )
                    // rotateSpaceShip(true)
                    this.game.spaceship.rotation = 0.05; //-data.SPACESHIP_TURN_SPEED / degToRad(180) / data.FPS / 30 // add the frame rate to slow down the speed of the rotation;
                break;
                case "ArrowDown": //down arrow (thrust backward spaceship left)
                    this.game.spaceship.reversing = true;
                    this.game.spaceship.decelerationTime++;
                    console.log("reversing", this.game.spaceship.reversing)
                break;
            }
        })
        window.addEventListener("keyup", (e)=>{
            const releasedKey = e.key;
            // keyUp(game, releasedKey)  
            //player keys
            if(releasedKey ===  "w" || releasedKey ===  "s" || releasedKey ===  "d" ||releasedKey ===  "a" || releasedKey ===  "g"){
                this.keys.splice(this.keys.indexOf(releasedKey, 1))
            }
            //spaceship keys released
            if (this.game.spaceship.lives === 0  || data.AUTOMATION_ON === true){
                return
            }
            // const key = e.keyCode;
            switch(releasedKey){
                case " ": //spacebar (spaceship shoot laser)
                case "Spacebar": // if the event.key value matches either " " or "Spacebar", since In most web browsers, the event key for the spacebar is "Spacebar" or " ". 
                    // console.log("not shooting");
                    this.game.spaceship.canShoot = false;
                    this.game.spaceship.shooting = false;
                    this.game.spaceship.shots = 0;
                break;
                case "ArrowLeft": //left arrow (stop rotate spaceship left)
                    this.game.spaceship.rotation = 0; // add the frame rate to slow down the speed of the rotation;
                    this.game.spaceship.angle += 0;
                break;
                case "ArrowUp": //up arrow (stop thrust forward spaceship up)
                    this.game.spaceship.thrusting = false;
                    this.game.spaceship.accelartionTime = 0;
                break;
        
                case "ArrowRight": //right arrow (stop rotate spaceship right )
                    this.game.spaceship.rotation = 0;  // add the frame rate to slow down the speed of the rotation;
                    this.game.spaceship.angle += 0;
                break;
                case "ArrowDown": //down arrow (stop thrust backward spaceship left)
                    this.game.spaceship.reversing = false;
                    this.game.spaceship.decelerationTime = 0;
                break;
            }
        });
    }
}


export default InputHandler;