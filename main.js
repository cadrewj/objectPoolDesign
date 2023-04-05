import gameData from "./data/data.json" assert { type: "json" }
import Meteor from "./classes/meteor.js";
import Spaceship from "./classes/spaceship.js";
import InputHandler from "./classes/input.js";
import Player from "./classes/player.js";
import Background from "./classes/background.js";
import Enemy from "./classes/enemy.js";
import { randomNum } from "./utilityFunctions/utilityFunctions.js";

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
            this.player = new Player(this, 5)
            this.background = new Background(this)
            this.input = new InputHandler(this);
            this.enemy = new Enemy(this);
            this.enemyPool =[];
            this.numOfEnemies = 3;
            this.enemyTimer = 0;
            this.enemyInterval = 50000
        
            this.lives = this.data.GAME_LIVES;
            this.meteorTimer = 0;
            this.meteorInterval = 3000; 
            this.meteorPool = [] // used to store meteors created in the game wether they are active or inactive.
            this.max = Math.ceil(this.width * 0.01) // set the max value of meteors to be stored in the pool.
            this.createPool(); // automatically creating the pool as soon as an instance of the game class is created.
            // createPool(new Enemy(this), this.enemyPool, this.numOfEnemies);
            // console.log(this.enemyPool)
        }
       

        createPool(){ //create an object pool of meteors  all at once for faster allocation
            for(let i = 0; i < this.max; i++){
                this.meteorPool.push(new Meteor(this)); //this is used to pass the entire game class to the Meteor class
            } 
            for(let i = 0; i < this.numOfEnemies; i++){
                this.enemyPool.push(new Enemy(this)); //this is used to pass the entire game class to the Meteor class
            } 
            console.log(this.enemyPool)                
        }
        getElement(){ //used to find the first available or free object in the array
            for(let i =0; i < this.meteorPool.length; i++){
                if(this.meteorPool[i].free){
                    return this.meteorPool[i]; //return the free object
                }
            }
       
        }
        getEnemy(){
            for(let i =0; i < this.enemyPool.length; i++){
                if(this.enemyPool[i].free){
                    return this.enemyPool[i]; //return the free object
                }
            }
        }
        render(context, deltaTime){
            this.gameFrames++;
            this.background.update(context, deltaTime);
            //create meteor periodically
            if(this.meteorTimer > this.meteorInterval){
                //add a new meteor to be rendered from the meteorpool
                const meteor = this.getElement();
                if(meteor){ // if it return a free meteor then call start
                    meteor.start()
                }
                //reset the timer
                this.meteorTimer = 0;
            }
            else{
                this.meteorTimer += deltaTime; // increase the value of the timer 
            }
            //update the meteors
            this.meteorPool.forEach(meteor => {
                meteor.update(context)
            });

            if(this.enemyTimer > (this.enemyInterval)){
                //add a new meteor to be rendered from the meteorpool
                // console.log(this.enemyTimer, this.enemyInterval)
                const enemy = this.getEnemy();
                if(enemy){ // if it return a free meteor then call start
                    enemy.start()
                }
                //reset the timer
                this.enemyTimer = 0;
            }
            else{
                this.enemyTimer += deltaTime; // increase the value of the timer 
            }
            //update the meteors
            this.enemyPool.forEach(e => {
                e.update(context)
            });
           
            // periodicInterval(this.enemyTimer, this.enemyInterval, this.enemyPool, deltaTime, context)


            //draw the spaceship
            this.spaceship.update(context)
            console.log(this.spaceship.shooting, "need to change shooting to false, to improve memory useage")

            // this.enemy.update(context)

            //draw player 
            if(this.player.onPlanet){
                this.player.update(context, this.input)
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

// function createPool(classNam, arrayOfElements, maxIterations) {
//     for(let i = 0; i < maxIterations; i++){
//         arrayOfElements.push(classNam); //this is used to pass the entire game to the class
//     }         
// }
// function findElement(arrayOfElements){ //used to find the first available or free object in the array
//     for(let i =0; i < arrayOfElements.length; i++){
//         if(arrayOfElements[i].free){
//             return arrayOfElements[i]; //return the free object
//         }
//     }
// }

// function periodicInterval(timer, intervals, arrayOfElements, deltaTime, context){
//     const array = arrayOfElements//console.log("go", arrayOfElements)
//     //create meteor periodically
//     if(timer > intervals){
//         //add a new meteor to be rendered from the meteorpool
//         const element = findElement(array);
//         console.log("e: free", array.length)
//         if(element){ // if it return a free meteor then call start

//             element.start()
//         }
//         //reset the timer
//         timer = 0;
//     }
//     else{
//         timer += deltaTime; // increase the value of the timer 
//     }
//     //update the meteors
//     arrayOfElements.forEach(e => {
//         e.update(context)
//     });
// }