class InputHandler{
    constructor(spaceship, player, data, camera){
        this.game = {
            spaceship: spaceship,
            player: player,
            data: data,
            // camera: camera
        };
        this.keys = [];
        window.addEventListener("keydown", (e)=>{      
            const pressedKey = e.key;
            //spaceship keys
            if (this.game.spaceship.lives === 0 || this.game.data.AUTOMATION_ON === true){
                return
            }
            switch(pressedKey){
                case "Enter": //enter
                    console.log("pressed enter")
                    break;
                case " ": //spacebar (spaceship shoot laser)
                case "Spacebar":  // if the event.key value matches either " " or "Spacebar", since In most web browsers, the event key for the spacebar is "Spacebar" or " ". 
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
                break;
                case "ArrowRight": //right arrow (rotate spaceship right )
                    // rotateSpaceShip(true)
                    this.game.spaceship.rotation = 0.05; //-data.SPACESHIP_TURN_SPEED / degToRad(180) / data.FPS / 30 // add the frame rate to slow down the speed of the rotation;
                break;
                case "ArrowDown": //down arrow (thrust backward spaceship left)
                    this.game.spaceship.reversing = true;
                break;

                //player keys
                case "a": //left arrow (rotate spaceship left)
                // rotateSpaceShip(false)
                this.game.player.runLeft = true; ;//data.SPACESHIP_TURN_SPEED / degToRad(180) / data.FPS / 30
                break;
                case "w": //up arrow (thrust forward spaceship up)
                    this.game.player.jump = true;
                break;
                case "d": //right arrow (rotate spaceship right )
                    // rotateSpaceShip(true)
                    this.game.player.runRight = true; //-data.SPACESHIP_TURN_SPEED / degToRad(180) / data.FPS / 30 // add the frame rate to slow down the speed of the rotation;
                    // this.game.player.shouldPanCameraToLeft(this.game.camera);
                break;
                case "s": //down arrow (thrust backward spaceship left)
                    this.game.player.sheild = true;
                break;
                case "g": //down arrow (thrust backward spaceship left)
                this.game.player.attack = true;
                break;
            }
        })
        window.addEventListener("keyup", (e)=>{
            const releasedKey = e.key;
            //spaceship keys released
            if (this.game.spaceship.lives === 0  || this.game.data.AUTOMATION_ON === true){
                return
            }
            switch(releasedKey){
                case " ": //spacebar (spaceship shoot laser)
                case "Spacebar": // if the event.key value matches either " " or "Spacebar", since In most web browsers, the event key for the spacebar is "Spacebar" or " ". 
                    // console.log("not shooting");
                    this.game.spaceship.canShoot = false;
                    // this.game.spaceship.shooting = false;
                    this.game.spaceship.shots = 0;
                break;
                case "ArrowLeft": //left arrow (stop rotate spaceship left)
                    this.game.spaceship.rotation = 0; // add the frame rate to slow down the speed of the rotation;
                    this.game.spaceship.angle += 0;
                    //using photo image 55 - 50 for a slight animation of tilting the ship
                break;
                case "ArrowUp": //up arrow (stop thrust forward spaceship up)
                    this.game.spaceship.thrusting = false;
                    this.game.spaceship.accelartionTime = 0;
                break;
                case "ArrowRight": //right arrow (stop rotate spaceship right )
                    this.game.spaceship.rotation = 0;  // add the frame rate to slow down the speed of the rotation;
                    this.game.spaceship.angle += 0;  
                    //using the photo images 4 - 9 for a slight animation of tilting the ship 
                break;
                case "ArrowDown": //down arrow (stop thrust backward spaceship left)
                    this.game.spaceship.reversing = false;
                    this.game.spaceship.decelerationTime = 0;
                break;

                //player keys
                case "a": //left arrow (rotate spaceship left)
                // rotateSpaceShip(false)
                this.game.player.runLeft = false; //data.SPACESHIP_TURN_SPEED / degToRad(180) / data.FPS / 30
                break;
                case "w": //up arrow (thrust forward spaceship up)
                    this.game.player.jump = false;
                break;
                case "d": //right arrow (rotate spaceship right )
                    // rotateSpaceShip(true)
                    this.game.player.runRight = false; //-data.SPACESHIP_TURN_SPEED / degToRad(180) / data.FPS / 30 // add the frame rate to slow down the speed of the rotation;
                    
                break;
                case "s": //down arrow (thrust backward spaceship left)
                    this.game.player.sheild = false;
                break;
                case "g": //down arrow (thrust backward spaceship left)
                this.game.player.attack = false;
                break;
            }
        });
    }
}
export default InputHandler;
