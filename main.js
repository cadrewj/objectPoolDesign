import gameData from "./data/data.json" assert { type: "json" }
import Meteor from "./classes/meteor.js";
import Spaceship from "./classes/spaceship.js";
import InputHandler from "./classes/input.js";
import Player from "./classes/player.js";
import Background from "./classes/background.js";
import Enemy from "./classes/enemy.js";
import { randomNum, periodicInterval, createPool } from "./utilityFunctions/utilityFunctions.js";

//define the canvas and it's dimensions
const canvas = document.querySelector("#main");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
 // note he optimised for 500 px in his styling for background;

/*This property is useful for games and other apps that use pixel art. 
When enlarging images, the default resizing algorithm will blur the pixels. 
Set this property to false to retain the pixels' sharpness.*/
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

//define the loading screen area and set it value to zero since the screen is already loaded
const loading = document.querySelector("#loading")
loading.style.display = "none";

addEventListener("load",()=>{ 
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    class Game{
        constructor(width, height, data){
            this.gameFrames = 0;
            this.width = width;
            this.height = height;
            this.data = data;
            this.spaceship = new Spaceship(this);
            this.player = new Player(this);
            this.background = new Background(this.width, this.height, this.data)
            this.input = new InputHandler(this.spaceship, this.player, this.data);
            this.enemyPool =[];
            this.maxEnemies = 1;
            this.enemyTimer = 0;
            this.enemyInterval = 3000
        
            this.lives = this.data.GAME_LIVES;
            this.meteorTimer = 0;
            this.meteorInterval = 3000; 
            this.meteorPool = [] // used to store meteors created in the game wether they are active or inactive.
            this.maxMeteors = Math.ceil(this.width * 0.01) // set the max value of meteors to be stored in the pool.
            this.createGamePools(); // automatically creating the pool as soon as an instance of the game class is created.
        }
        createGamePools(){ //create an object pool of meteors  all at once for faster allocation
            createPool(this.meteorPool, this.maxMeteors, new Meteor(this.width, this.height)) //this is used to pass the entire game class to the Meteor class
            createPool(this.enemyPool, this.maxEnemies, new Enemy(this.width, this.height)) //this is used to pass the entire game class to the enemies class   
        }
        render(context, deltaTime){
            this.gameFrames++;
            this.background.update(context, deltaTime);
            //render a new meteror periodically if it's free;
            this.meteorTimer = periodicInterval(this.meteorTimer, this.meteorInterval, deltaTime, this.meteorPool, context);
            //render a new enemy periodically if it's free;
            this.enemyTimer = periodicInterval(this.enemyTimer, this.enemyInterval, deltaTime, this.enemyPool, context, this.gameFrames);
            console.log(this.enemyTimer, " etime")
            //draw the spaceship
            this.spaceship.update(context, this.gameFrames)
            console.log(this.spaceship.shooting, "need to change shooting to false, to improve memory useage")

            //draw player 
            if(this.player.onPlanet){
                this.player.update(context, this.input, this.gameFrames)
            } 
        }
    }

    let lastTime = 0;
    const game = new Game(canvas.width, canvas.height, gameData);
    
    function animate(timeStamp){ //note: timeStamp is automatically generated.
        // ctx.clearRect(0,0,canvas.width, canvas.height)
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.render(ctx, deltaTime)
        const stopGame = requestAnimationFrame(animate)
        const framesPerSecond = 1 / deltaTime * 1000 // one frame divided by time in milliseconds
        // console.log("delta: ", deltaTime, " Frames Per Sec: ", framesPerSecond)
    }
    animate(0) //set a default value for timestamp to avoid NaN error on the first call of the animation loop, cuz its undefined at that time.

})

addEventListener("resize",()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;

})




           