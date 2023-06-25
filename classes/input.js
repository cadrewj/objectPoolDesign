class InputHandler{
    constructor(spaceship, data){
        this.game = {
            spaceship: spaceship,
            data: data,
        };
        this.lastKey = "";
        this.shipLastKey = "";
        this.gameLastKey = "";
        this.isMouseDown = false;
        window.addEventListener("keydown", (e)=>{      
            const pressedKey = e.key;
            // console.log(pressedKey);

            //spaceship keys
            if (this.game.spaceship.lives === 0 || this.game.data.AUTOMATION_ON === true){
                return
            }
            switch(pressedKey){
                case "a": //left arrow (rotate spaceship left)
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_PRESS_LEFT
                break;
                case "w": //up arrow (thrust forward spaceship up)
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_PRESS_UP
                break;
                case "d": //right arrow (rotate spaceship right )
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT
                break;
                case "s": //down arrow (thrust backward spaceship left)
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_PRESS_DOWN
                break;

                case ",": //switch ship attack type
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_PRESS_SWITCH_LEFT
                break;
                case ".": //used to switch ship attack type
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_PRESS_SWITCH_RIGHT
                break;

                //player keys
                case "ArrowUp":
                    this.lastKey = this.game.data.gameKeys.PLAYER_PRESS_UP;
                break;
                case "ArrowLeft":
                    this.lastKey = this.game.data.gameKeys.PLAYER_PRESS_LEFT;
                break;
                case "ArrowDown":
                    this.lastKey = this.game.data.gameKeys.PLAYER_PRESS_DOWN;
                break;
                case "ArrowRight":
                    this.lastKey = this.game.data.gameKeys.PLAYER_PRESS_RIGHT;
                break;
                case " ": //player attack
                case "Spacebar": // if the event.key value matches either " " or "Spacebar", since In most web browsers, the event key for the spacebar is "Spacebar" or " ". 
                    this.lastKey = this.game.data.gameKeys.PLAYER_PRESS_ATTACK;
                break;
                case "c": //use to switch attack type
                    this.lastKey = this.game.data.gameKeys.PLAYER_PRESS_SWITCH_LEFT;
                break;
                case "v": //use to switch attack type
                    this.lastKey = this.game.data.gameKeys.PLAYER_PRESS_SWITCH_RIGHT;
                break;

                //Game Control keys
                case "Enter":
                    this.gameLastKey = this.game.data.gameKeys.PRESS_ENTER;
                break;
                case "Escape":
                    this.gameLastKey = this.game.data.gameKeys.PRESS_ESCAPE;
                break;
            }
        })
        window.addEventListener("keyup", (e)=>{
            const releasedKey = e.key;
       
            if (this.game.spaceship.lives === 0  || this.game.data.AUTOMATION_ON === true){
                return
            }
            switch(releasedKey){
                 //Game Control keys
                 case "Enter":
                    this.gameLastKey = this.game.data.gameKeys.RELEASE_ENTER;
                break;
                case "Escape":
                    this.gameLastKey = this.game.data.gameKeys.RELEASE_ESCAPE;
                break;

                //spaceship keys released
                case "w": //up arrow (stop thrust forward spaceship up)
                    this.shipLastKey= this.game.data.gameKeys.SPACESHIP_RELEASE_UP;
                break;
                case "a": //left arrow (stop rotate spaceship left)
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_RELEASE_LEFT;
                break;
                case "s": //down arrow (stop thrust backward spaceship left)
                    this.shipLastKey= this.game.data.gameKeys.SPACESHIP_RELEASE_DOWN;
                break;
                case "d": //right arrow (stop rotate spaceship right )
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_RELEASE_RIGHT;
                break;
                case ",": //switch ship attack type
                this.shipLastKey = this.game.data.gameKeys.SPACESHIP_RELEASE_SWITCH_LEFT
                break;
                case ".": //used to switch ship attack type
                    this.shipLastKey = this.game.data.gameKeys.SPACESHIP_RELEASE_SWITCH_RIGHT
                break;
               
                //player keys
                case "ArrowUp":
                    this.lastKey = this.game.data.gameKeys.PLAYER_RELEASE_UP;
                break;
                case "ArrowLeft":
                    this.lastKey = this.game.data.gameKeys.PLAYER_RELEASE_LEFT;
                break;
                case "ArrowDown":
                    this.lastKey = this.game.data.gameKeys.PLAYER_RELEASE_DOWN;
                break;
                case "ArrowRight":
                    this.lastKey = this.game.data.gameKeys.PLAYER_RELEASE_RIGHT;
                break;
                case " ": //player attack
                case "Spacebar": // if the event.key value matches either " " or "Spacebar", since In most web browsers, the event key for the spacebar is "Spacebar" or " ". 
                    this.lastKey = this.game.data.gameKeys.PLAYER_RELEASE_ATTACK
                break;
                case "v": //use to switch attack type
                    this.lastKey = this.game.data.gameKeys.PLAYER_RELEASE_SWITCH_RIGHT;
                break;
                case "c": //use to switch attack type
                    this.lastKey = this.game.data.gameKeys.PLAYER_RELEASE_SWITCH_LEFT;
                break;
                
            }
        });
        window.addEventListener("mousedown", (e)=>{
           this.isMouseDown = true;
        })
        window.addEventListener("mouseup", (e)=>{
            this.isMouseDown = false;
        })
    }
}
export default InputHandler;
