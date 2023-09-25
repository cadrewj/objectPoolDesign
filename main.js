import gameData from "./data/data.json" assert { type: "json" }
import { gameKeys } from "./data/gameKeys.js";
import Spaceship from "./classes/spaceship.js";
import InputHandler from "./classes/input.js";
import Player from "./classes/player.js";

import {Background, Stars} from "./classes/background.js";
import { Universe } from "./classes/universe.js";
import { SolarSystem } from "./classes/solarSystem.js";
import { Asteroid } from "./classes/asteroids.js";
import {ClimbingEnemy, FlyingEnemy, GroundEnemy} from "./classes/enemy.js";

import { Food } from "./classes/reward.js";
import { Oxygen } from "./classes/reward.js";
import { PhantomTriangle } from "./classes/reward.js";
import { Minerals } from "./classes/reward.js";

import {randomNum} from "./utilityFunctions/utilityFunctions.js";
import drawInputKeys from "./utilityFunctions/drawInputKeys.js";

import StartNewGame from "./states/GameBehavior/NewGame.js";
import GameOver from "./states/GameBehavior/GameOver.js";
import DebugMode from "./states/GameBehavior/DebugMode.js";
import Loading from "./states/GameBehavior/LoadGame.js";

import { SpaceshipUserInterface } from "./userInterface/spaceshipUserInterface.js";
import { GameUserInterface } from "./userInterface/gameUserInterface.js";
import {PlayerUserInterface} from "./userInterface/playerUserInterface.js";
import { assistantUI } from "./userInterface/assistantUserInterface.js";
import { MiniMapUserInterface } from "./userInterface/miniMapUserInterface.js";

// Loading UI
import { RainEffect } from "./classes/rainingSymbols.js";
import { SlimeEffect } from "./classes/slimeEffect.js";
import { ShootSlimeBall } from "./classes/shootSlimeBall.js";

//define the canvas and it's dimensions
const canvas = document.querySelector("#main");
const ctx = canvas.getContext("2d");
const miniMapCanvas = document.getElementById('miniMapCanvas');
const miniMapCtx = miniMapCanvas.getContext('2d');
const userInterface = document.querySelector("#userInterface");
const startUpButtons = document.querySelector("#startUpButtons");

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.width = innerWidth;
canvas.height = innerHeight;
miniMapCanvas.width = innerWidth;
miniMapCanvas.height = innerHeight;

//define the loading screen area and set it value to zero since the screen is already loaded
const loading = document.querySelector("#loading")
loading.style.display = "none";
export let stopGame;
let game;

addEventListener("load",()=>{ 
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    class Game{
        constructor(width, height, miniMapWidth, miniMapHeight, data, canvas, miniMapCanvas){
            this.gameOver = false;
            this.width = width;
            this.height = height;
            this.miniMapWidth = miniMapWidth;
            this.miniMapHeight = miniMapHeight;

            this.canvas = canvas;
            this.miniMapCanvas = miniMapCanvas;
            this.clickedMonster = false;

            this.groundMargin = 0.01;
            this.data = data;
            this.universe = new Universe(this);
            this.spaceship = new Spaceship(this);
            this.asteroids = new Asteroid(this);
            this.player = new Player(this);
            this.background = new Background(this.width, this.height, this.data)
            
            this.solarSystem = new SolarSystem(this)
            this.camera = {
                position: {
                    x: 0,
                    y: 0,      
                }
            }
            this.stars = new Stars(this.width, this.height, this.data);
            this.input = new InputHandler(this);
            this.velocity = {
                x: 10,
                y: 10
            }
            this.collisions = [];
            this.rewards = [];
            this.rewardTypes = [(game, x, y)=> new Food(game, x, y), 
                (game, x, y)=> new PhantomTriangle(game, x, y),
                (game, x, y)=> new Oxygen(game, x, y),
                (game, x, y)=> new Minerals(game, x, y)
            ];
            this.floatingMessage = [];
            this.particles = [];
            this.maxParticles = 50;

            this.score = 0;
            this.playerUI = new PlayerUserInterface(this.data, this.width, this.height);
            this.gameUI = new GameUserInterface(this)
            this.spaceshipUI = new SpaceshipUserInterface(this.data, this.width, this.height);
            this.miniMapUI = new MiniMapUserInterface(this);
            this.debug = false;
            this.states = [ 
                new StartNewGame(this), 
                new GameOver(this),
                new DebugMode(this),
                new Loading(this)
            ];
            this.currentState = this.states[3]; // game state
            this.enemyTimer;
            this.enemyInterval;
            this.enemies = [];
            this.inventory = [];
            this.isLoading = true;
        }
   
        addEnemy(){
            const enemyTypes = [new FlyingEnemy(this), new GroundEnemy(this), new ClimbingEnemy(this)]
            let selectedEnemy = randomNum(0, enemyTypes.length-1)
            if(this.velocity.x > 0 && Math.random() < 0.2){
                this.enemies.push(enemyTypes[selectedEnemy]);  
            }
        }
        render(context, miniMapCtx, deltaTime, input){    
    
            context.save()
            context.translate(this.camera.position.x, this.camera.position.y) //used to move the screen when panning 
            if(!this.player.isOnPlanet){
                this.universe.draw(context);
            }
            else{
                this.background.update(context);
            }
            context.restore()

            context.save(); // Translate back to the original position for elements that shouldn't move     
            // Elements that should not be translated
            this.stars.update(context, deltaTime, this.spaceship);
            this.currentState.handleInput(input, context);

            context.restore(); 

            context.save(); // Restore the translation
            context.translate(this.camera.position.x, this.camera.position.y);
            //draw planets
            this.solarSystem.draw(context)
            this.solarSystem.update();
            // draw in game rewards
            if(this.rewards.length > 0){
                this.rewards.forEach((reward)=>{
                    reward.draw(context)
                    reward.update();
                    //delete marked rewards
                    this.rewards = this.rewards.filter(reward => !reward.markedForDeletion);
                })    
            }
            //draw asteroid
            this.asteroids.draw(context);
            this.asteroids.update(this.spaceship);

            //handle enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }
            else{
                this.enemyTimer += deltaTime;
            }
            //draw enemy
            this.enemies.forEach((enemy)=>{
                enemy.draw(context)
                enemy.update(deltaTime)
                enemy.updateHitCircle()
                this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
            })
            
            //draw the spaceship
            this.spaceship.update(input, context, this.camera, deltaTime, this.player.playerIsInSpace, this.player.isOnPlanet)

            //draw game particles
            this.particles.forEach((particle) => {
                particle.draw(context)
                particle.update();
                this.particles = this.particles.filter(particle => !particle.markedForDeletion)
            });
            //control the amount of particles in the array
            if(this.particles.length > this.maxParticles){
                this.particles = this.particles.filter(particle=>!particle.markedForDeletion).slice(0, this.maxParticles)
            }
        
            //draw player 
            this.player.draw(context);
            this.player.update(input, this.camera, deltaTime)

            //update player position based on the ship when in ship
            if(!this.player.playerIsInSpace){
                this.player.updatePlayerPositionBasedOnShip(this.spaceship.position)
            }
            // handle collision sprites
            this.collisions.forEach((collision)=>{
                collision.draw(context);
                collision.update(deltaTime);
                //delete marked collision sprites
                this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            })
            context.restore(); /// content that got panned//////

            /////////////////////game interface ///////////////////// no panning//////////
             //draw in game floating messages
             this.floatingMessage.forEach((message)=>{
                message.draw(context)
                message.update();
                //delete marked floating messages
                this.floatingMessage = this.floatingMessage.filter(msg => !msg.markedForDeletion);
            })

            // draw player user interface
            this.playerUI.update(context, this.player, deltaTime)
          
            this.miniMapUI.draw(miniMapCtx);
            this.miniMapUI.update(this.player.position.x, this.player.position.y,
                this.spaceship.position.x, this.spaceship.position.y, this.solarSystem.planets, this.player.playerIsInSpace
            );

            // console.log(this.solarSystem)
            const fuelPercentage = this.spaceship.fuel / 100;
            this.spaceshipUI.drawFuelGauge(context, fuelPercentage, this.width - this.player.width * 2.5, this.height - 20);
            this.spaceshipUI.drawSpaceshipHealthBar(context, this.spaceship)
            this.spaceshipUI.drawSpaceshipLives(context, this.spaceship);
            this.gameUI.drawScore(context);
            //draw the assistant
            const angle = (Date.now() / 1000) % (Math.PI * 2);
            assistantUI(context, this.width - this.width* 0.3, -20, angle)

            drawInputKeys(context, input, this);

           
        }
        setState(state){ //the passed state is an index number
            this.currentState = this.states[state]; //set the current state of the game
            this.currentState.enter(); // calls the enter method on the current state you are on 
        }
        init(width, height, miniMapWidth, miniMapHeight, data){
            canvas.focus();
            this.gameOver = false;
            
            this.width = width;
            this.height = height;
            this.miniMapWidth = miniMapWidth;
            this.miniMapHeight = miniMapHeight;
            this.data = data;
            this.groundMargin = 0;
          
            this.universe = new Universe(this);
            this.spaceship = new Spaceship(this);
            this.camera = {
                position: {
                    x: 0,
                    y: 0,
                }
            }
            this.asteroids = new Asteroid(this);
            this.player = new Player(this);
            this.background = new Background(this.width, this.height, this.data)
            
            this.solarSystem = new SolarSystem(this)
            this.stars = new Stars(this.width, this.height, this.data);
            this.input = new InputHandler(this);

            this.debug = false;
            this.states =[ 
                new StartNewGame(this), 
                new GameOver(this),
                new DebugMode(this),
                new Loading(this)
            ]
            this.currentState = this.states[3]; //state new game

            this.velocity = {
                x: 10,
                y: 10
            }
            // this.gameFrames = 0;
            this.maxParticles = 50;
            this.particles = [];
            this.collisions = [];
            this.floatingMessage = [];
            this.rewards = [];
            this.rewardTypes = [(game, x, y)=> new Food(game, x, y),
                (game, x, y)=> new PhantomTriangle(game, x, y),
                (game, x, y)=> new Oxygen(game, x, y),
                (game, x, y)=> new Minerals(game, x, y)
            ];
            
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 8000;
            this.enemyTypes = [new FlyingEnemy(this), new GroundEnemy(this), new ClimbingEnemy(this)]
            this.score = 0;
        
            this.playerUI = new PlayerUserInterface(this.data, this.width, this.height);
            this.gameUI = new GameUserInterface(this)
            this.spaceshipUI = new SpaceshipUserInterface(this.data, this.width, this.height);
            this.miniMapUI = new MiniMapUserInterface(this);
            this.inventory = []; // 
            this.isLoading = true;
        }
        resize(canvas, miniMapCanvas){    
            if(!this.isLoading){
                this.width = canvas.width;
                this.height = canvas.height;
                this.miniMapWidth = Math.floor(canvas.width * 0.18);
                this.miniMapHeight = Math.floor(canvas.width * 0.18);
    
                this.miniMapUI.resize(this.width, this.height, this.miniMapWidth, this.miniMapHeight);
                this.spaceshipUI.resize(this.width, this.height);
                this.gameUI.resize(this.width, this.height);
                this.playerUI.resize(this.width, this.height);
                this.solarSystem.resize(this.width, this.height)
                this.asteroids.resize(this.width, this.height);
                this.spaceship.resize(this.width, this.height)
                this.player.resize(this.width, this.height);
                this.background.resize(this.width, this.height);
                this.stars.resize(this.width, this.height);
                this.enemies.forEach(enemy => {
                    enemy.resize(this.width, this.height)   
                });
                this.particles.forEach(particle => {
                    particle.resize(this.width, this.height)   
                });
                this.rewards.forEach(reward => {
                    reward.resize(this.width, this.height)   
                });
            }
            else{
                canvas.width = innerWidth;
                canvas.height = innerHeight;
                miniMapCanvas.width = innerWidth;
                miniMapCanvas.height = innerHeight;

                slime.reset(canvas.width, canvas.height);
                rain.resize(miniMapCanvas.width, miniMapCanvas.height);
                rain.gradient = miniMapCtx.createRadialGradient(
                    miniMapCanvas.width / 2,
                    miniMapCanvas.height / 2,
                    miniMapCanvas.width * 0.05,
                    miniMapCanvas.width / 2,
                    miniMapCanvas.height / 2,
                    miniMapCanvas.width / 2
                );
                rain.gradient.addColorStop(0, "red");
                rain.gradient.addColorStop(0.5, "cyan");
                rain.gradient.addColorStop(1, "magenta");
            }
        }
    }
    
    game = new Game(canvas.width, canvas.height, miniMapCanvas.width, miniMapCanvas.height, {...gameData, gameKeys}, canvas, miniMapCanvas);
    const slime = new SlimeEffect(canvas.width, canvas.height);
    slime.init(25);

    const rain = new RainEffect(miniMapCanvas.width, miniMapCanvas.height, miniMapCtx);
    const shootSlime = new ShootSlimeBall(canvas.width, canvas.height);

    let lastTime = 0;
    let timer = 0;
    const FPS = 30;
    const frameInterval = 1000 / FPS;

    //// define start up buttons
    let enableButtons= false;
    //Note: need the space for this part of code: button.id = buttonName[i].slice(0, buttonName[i].indexOf(" "));
    let buttonArray = [];
    const buttonName = ["Continue ","New Game ", "Options "];
    
    for(let i = 0; i < buttonName.length; i ++) {
        const button = document.createElement("button");
        button.textContent = buttonName[i];
        button.className = "button";
        button.id = buttonName[i].slice(0, buttonName[i].indexOf(" "));
        button.style.display = "none"; // Set the display property to "none" initially
        buttonArray.push(button);
        startUpButtons.append(button);
        userInterface.style.display = "block";
    }
    const startNewGameButton = document.querySelector("#New");

    function animate(timeStamp){ //note: timeStamp is automatically generated.
        canvas.focus();
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        if(!game.isLoading){
         
            game.render(ctx, miniMapCtx, deltaTime, game.input);
        }
        else{
            startNewGameButton.addEventListener("click",()=>{
                cancelAnimationFrame(stopGame);
                canvas.width = innerWidth;
                canvas.height = innerHeight;
                miniMapCanvas.width = Math.floor(canvas.width * 0.18);
                miniMapCanvas.height = Math.floor(canvas.width * 0.18);
                
                // miniMapCanvas.style.border ="1px solid rgba(255, 255, 255, 0.2)";
                miniMapCanvas.style.bottom = "180px";
                miniMapCanvas.style.right = "0";
                miniMapCanvas.style.margin = "20px";
                game.init(canvas.width, canvas.height, miniMapCanvas.width, miniMapCanvas.height, {...gameData, gameKeys});
                game.isLoading = false;
                game.setState(0);
                slime.toggleSlimeEffect(false, miniMapCanvas);
                userInterface.style.display = "none";
              
                animate(0) //set a default value for timestamp to avoid NaN error on the first call of the animation loop, cuz its undefined at that time.   
            })
            // Calculate the distance of shootSlime from the center of the canvas
            const distanceToCenter = Math.sqrt((shootSlime.dx - shootSlime.canvasWidth/2) ** 2 + (shootSlime.dy - shootSlime.canvasHeight/2) ** 2);
            //clear canvas to create a transparent background
            miniMapCtx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            //rain need
            if (timer > frameInterval) {
                ctx.fillStyle = "rgba(0,0,0, 0.07)"; // clear the screen
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.textAlign = "center";
                ctx.fillStyle = "#0aff0a";
                ctx.font = rain.fontSize + "px monospace";
                rain.symbols.forEach((symbol) => {
                // Calculate the distance from symbol's y-coordinate to the center y-coordinate
                const distanceToCenterX = Math.abs(symbol.x * rain.fontSize - canvas.width / 2);
                const distanceToCenterY = Math.abs(symbol.y * rain.fontSize - canvas.height / 2);
                
                // Define the threshold (adjust this value as needed to control the eye shade effect)
                const threshold = 100; //canvas.width * 0.11;

                // Determine whether to apply the gradient based on the distance to the center
                const applyGradient = distanceToCenterY < threshold && distanceToCenterX < threshold;

                symbol.draw(ctx, applyGradient); // Pass the applyGradient value to the draw method
                symbol.update();
                });

                timer = 0;
            } 
            else {
                timer += deltaTime;
            }
            ctx.restore();

            slime.toggleSlimeEffect(false, miniMapCanvas);
            // set canvas to black again for slime effect
            miniMapCtx.fillStyle = "rgba(0,0,0, 0.5)";
            miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
            //center if hit center of screen
            if (distanceToCenter > shootSlime.radius && enableButtons === false && game.clickedMonster) {
                // The shootSlime hasn't reached the center yet
                shootSlime.draw(miniMapCtx);
                shootSlime.update();
            } 
            else if (game.clickedMonster === true) {
                // The shootSlime has reached the center
                slime.toggleSlimeEffect(true, miniMapCanvas);
                slime.draw(miniMapCtx);
                slime.update();
        
                // Change the display to "block" for each button
                buttonArray.forEach(button => {
                    button.style.display = "block";
                });
                // Fix the typo here, use single "=" instead of "==="
                enableButtons = true;
            }
        }
        stopGame = requestAnimationFrame(animate)
        const framesPerSecond = 1 / deltaTime * 1000 // one frame divided by time in milliseconds 
    }
    animate(0) 
})









           