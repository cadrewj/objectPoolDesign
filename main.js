import gameData from "./data/data.json" assert { type: "json" }
import Meteor from "./classes/meteor.js";
import Spaceship from "./classes/spaceship.js";
import InputHandler from "./classes/input.js";

//define the canvas and it's dimensions
const canvas = document.querySelector("#main");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

//define the loading screen area and set it value to zero since the screen is already loaded
const loading = document.querySelector("#loading")
loading.style.display = "none";

addEventListener("load",()=>{ 
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    class Game{
        constructor(width, height, data){
            this.width = width;
            this.height = height;
            this.data = data;
            this.spaceship = new Spaceship(this);
            this.input = new InputHandler(this);

           
            // this.lives = this.data.GAME_LIVES;
            this.meteorTimer = 0;
            this.meteorInterval = 3000; 
            this.meteorPool = [] // used to store meteors created in the game wether they are active or inactive.
            this.max = Math.ceil(this.width * 0.01) // set the max value of meteors to be stored in the pool.
            this.createMeteorPool(); // automatically creating the pool as soon as an instance of the game class is created.
        }

        createMeteorPool(){ //create an object pool of meteors  all at once for faster allocation
            for(let i = 0; i < this.max; i++){
                this.meteorPool.push(new Meteor(this)); //this is used to pass the entire game class to the Meteor class
            }         
        }
        getElement(){ //used to find the first available or free object in the array
            for(let i =0; i < this.meteorPool.length; i++){
                if(this.meteorPool[i].free){
                    return this.meteorPool[i]; //return the free object
                }
            }
        }
        render(context, deltaTime){
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
            //draw the spaceship
            this.spaceship.update(context)
            console.log(this.spaceship.shooting, "need to change shooting to false, to improve memory useage")
            console.log(this.input.lastKey, "lastkey")
        }

    }

    let lastTime = 0;
    const game = new Game(canvas.width, canvas.height, gameData);
    
    function animate(timeStamp){ //note: timeStamp is automatically generated.
        ctx.fillStyle = "rgba(0,0,0,0.5)"
        ctx.fillRect(0,0,canvas.width, canvas.height);
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