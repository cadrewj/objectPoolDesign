import gameData from "./data/data.json" assert { type: "json" }
import Meteor from "./classes/meteor.js";
import Spaceship from "./classes/spaceship.js";
import InputHandler from "./classes/input.js";
import Player from "./classes/player.js";
import {Background, Stars} from "./classes/background.js";
import {Enemy, FlyingEnemy} from "./classes/enemy.js";
import { periodicInterval, createPool, drawStatusText} from "./utilityFunctions/utilityFunctions.js";
import drawInputKeys from "./utilityFunctions/drawInputKeys.js";
import { drawFuelGauge } from "./userInterface/guage.js";
import { gameKeys } from "./data/gameKeys.js";
import { Asteroid } from "./classes/asteroids.js";
import StartNewGame from "./states/GameBehavior/NewGame.js";
import GameOver from "./states/GameBehavior/gameOver.js";

//define the canvas and it's dimensions
const canvas = document.querySelector("#main");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

/*This property is useful for games and other apps that use pixel art. 
When enlarging images, the default resizing algorithm will blur the pixels. 
Set this property to false to retain the pixels' sharpness.*/
// ctx.mozImageSmoothingEnabled = false;
// ctx.webkitImageSmoothingEnabled = false;
// ctx.msImageSmoothingEnabled = false;
// ctx.imageSmoothingEnabled = false;

//define the loading screen area and set it value to zero since the screen is already loaded
const loading = document.querySelector("#loading")
loading.style.display = "none";
export let stopGame;
export let game;

addEventListener("load",()=>{ 
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const playerInfo = {
        image: document.getElementById("player"),
        width: gameData.PLAYER_SIZE,
        height: gameData.PLAYER_SIZE,
        sw: 200, //72
        sh: 181.83, //72
    }
    class Game{
        constructor(){
            this.gameOver= false;
            this.width;
            this.height;
            this.data;
            this.camera;
            this.spaceship;
            this.asteroid;
            this.player;
            this.background;
            this.stars;
            this.input;
            this.states =[ new StartNewGame(this), 
                new GameOver(this)
            ]
            this.currentState = this.states[0]; //state newgame
         
            // this.gameFrames = 0;
            this.enemyPool;
            this.maxEnemies;
            this.enemyTimer;
            this.enemyInterval;
           
            // this.coins = new Coins(this.width, this.height, this.data);
            this.lives;
            this.meteorTimer;
            this.meteorInterval; 
            this.meteorPool; // used to store meteors created in the game wether they are active or inactive.
            this.maxMeteors;// set the max value of meteors to be stored in the pool.
      
            
        }
        setState(state){ //the passed state is an index number
            this.currentState = this.states[state]; //set the current state
            this.currentState.enter(); // calls the enter method on the current state you are on 
        }
        createGamePools(){ //create an object pool of meteors  all at once for faster allocation
            const  enemyTypes = [Enemy, FlyingEnemy];
            createPool(this.meteorPool, this.maxMeteors, Meteor, this.width, this.height, this.data) //this is used to pass the game width and height  to the Meteor class
            createPool(this.enemyPool, this.maxEnemies, enemyTypes, this.width, this.height, this.data) //this is used to pass the game width and height to the enemies class   
        }
        render(context, deltaTime, input){
            this.currentState.handleInput(input, context, this); 
            // this.gameFrames++;
            context.save()
            context.translate(this.camera.position.x, this.camera.position.y) //used to move the screen when panning 
            this.background.update(context);
            
            //draw asteroid
            this.asteroid.draw(context);
            this.asteroid.update(this.spaceship);
            
            //draw the spaceship
            this.spaceship.update(input, context, this.camera, deltaTime)
       
            //draw player 
            if(this.player.isOnPlanet){
                this.player.draw(context, deltaTime);
                this.player.update(input, this.enemyPool, this.camera)
            } 
            //render a new enemy periodically if it's free;
            // this.enemyTimer = periodicInterval(this.enemyTimer, this.enemyInterval, deltaTime, this.enemyPool, context, this.gameFrames);
           
            this.stars.update(context, deltaTime);
            drawInputKeys(context, input, this.player, this.spaceship, this.currentState, this.state)
            const fuelPercentage = this.spaceship.fuel / 100;
            drawFuelGauge(ctx, fuelPercentage, this.width - this.player.playerInfo.width*2, this.height - 20);
            context.restore();
    
            //render a new meteor periodically if it's free;
            // this.meteorTimer = periodicInterval(this.meteorTimer, this.meteorInterval, deltaTime, this.meteorPool, context);       
        }
        init(width, height, data){
            this.gameOver = false;
            this.width = width;
            this.height = height;
            this.data = data;
            this.camera = {
                position: {
                    x: 0,
                    y: -0,
                }
            }
            this.spaceship = new Spaceship(this);
            this.asteroid = new Asteroid(this);
            this.player = new Player(this, playerInfo);
            this.background = new Background(this.width, this.height, this.data)
            this.stars = new Stars(this.width, this.height, this.data);
            this.input = new InputHandler(this.spaceship, this.data);

            this.states =[ new StartNewGame(this), 
                new GameOver(this)
            ]
            this.currentState = this.states[0]; //state new game
         
            // this.gameFrames = 0;
            this.enemyPool =[];
            this.maxEnemies = 9;
            this.enemyTimer = 0;
            this.enemyInterval = 3000;
           
            // this.coins = new Coins(this.width, this.height, this.data);
        
            this.lives = this.data.GAME_LIVES;
            this.meteorTimer = 0;
            this.meteorInterval = 3000; 
            this.meteorPool = [] // used to store meteors created in the game wether they are active or inactive.
            this.maxMeteors = Math.ceil(this.width * 0.01) // set the max value of meteors to be stored in the pool.
            this.createGamePools(); // automatically creating the pool as soon as an instance of the game class is created. 
        }
    }
    
    game = new Game();
    let lastTime = 0;
      
    function animate(timeStamp){ //note: timeStamp is automatically generated.
        canvas.focus();
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        game.render(ctx, deltaTime, game.input);
        // console.log(game.input.shipLastKey)
        if(!game.gameOver){
            stopGame = requestAnimationFrame(animate)
        }
        
        const framesPerSecond = 1 / deltaTime * 1000 // one frame divided by time in milliseconds
    }
    game.init(canvas.width, canvas.height, {...gameData, gameKeys});
    animate(0) //set a default value for timestamp to avoid NaN error on the first call of the animation loop, cuz its undefined at that time.
    
  
})

addEventListener("resize",()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;

})





           