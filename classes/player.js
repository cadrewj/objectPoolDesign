import { testBoundsOfObject } from "../utilityFunctions/utilityFunctions.js";

class Player{
    constructor(width, height, data, gameOver){
        this.game = {
            width: width,
            height: height,
            data: data,
            gameOver: gameOver,
        };
        this.width = 128 // width of one frame in the sprite 
        this.height = 96 // height of the sprite
        this.x = this.game.width * 0.30; //position of the player on the x axis
        this.y = this.game.height - this.height; //position of the player on the y axis
        this.inSpace = true;
        this.onPlanet = true;
        this.playerImg = document.querySelector("#run")//new Image(); // sprite image of the player;
        this.velocity ={
            x: 0,
            y: 0
        }
        this.maxSpeed = 2; 
        this.jumpHeight = 20;
        this.friction = 0.99;
        this.weight = 1;
        this.frameX = 0;
        this.frameY = 0;
        this.frameNum = 0;
        this.flip = false;
        this.staggerFrames = 5; // used to slow down the speed of the animation
        this.jump = false;
        this.runLeft =false;
        this.runRight =false;
        this.sheild = false;
        this.attack =false;
    }
    update(context, gameFrames, enemyPool){
        this.draw(context, gameFrames)
        this.playerImg.src = "./images/player/idle.png";
        this.frameNum = 3;

        if(this.attack){
            this.playerImg.src = "./images/player/attack.png";
            this.frameNum = 7;
        }
        //horizontal movement
        else if(this.runRight){
            this.playerImg.src = "./images/player/run.png";
            this.frameNum = 7;
            this.velocity.x = this.maxSpeed;
            this.flip = false;
        }
        else if(this.runLeft){
            this.playerImg.src = "./images/player/run.png";
            this.frameNum = 7;
            this.velocity.x = -this.maxSpeed;
            this.flip = true;
        }
        else{
            this.velocity.x = 0
        }
        this.x += this.velocity.x;

        //vertical movement
        if(this.jump && this.onGround()){
            this.playerImg.src = "./images/player/jump.png";
            this.frameNum = 2;
            this.velocity.y -= this.jumpHeight * this.friction;
            console.log("jump")
        }
        this.y += this.velocity.y //this must be after the input includes for the code to work.
        if(!this.onGround()){
            this.playerImg.src = "./images/player/fall.png";
            this.frameNum = 1;
            this.velocity.y += this.weight;
            console.log("falling")
        }
        else{
            this.velocity.y = 0;   
        }
        //used to reset the player height to the ground in the event that the player ends up under the ground level
        if(this.y >this.game.height - this.height){ 
            this.y = this.game.height - this.height

        }
        this.handleScreen()


        //set up collision with player
        enemyPool.forEach(e => {
            // const enemy = e.enemy
            const dx = e.x - this.x;
            const dy = e.y - this.y;
            // const dx = (e.x + e.enemy.width/2 ) - (this.x + this.width/4);
            // const dy = (e.y  + e.enemy.height/2) - (this.y  + this.height/2);
            const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            if(distance < e.enemy.width/2 + this.width/4){
                console.log("gameover")
                this.game.gameOver = true;
            }
            // console.log(e.enemy)
            
        });
    }
    onGround(){
        return this.y >= this.game.height - this.height;
    }
    draw(context, gameFrames){
        if(this.playerImg.complete){
            if(gameFrames % this.staggerFrames === 0){
                if(this.frameX < this.frameNum){
                    this.frameX++;
                }
                else{
                    this.frameX = 0
                }
            }
            if(this.flip){
                context.save(); // save the current state of the context
                context.translate(this.x + this.width, this.y ); // move the context to the right edge of the image
                context.scale(-1, 1); // flip the x-axis
                context.drawImage(this.playerImg, this.frameX * this.width , this.frameY , this.width, this.height, 0, 0, this.width, this.height);
                context.restore(); // restore the context to its previous state
            }
            else{
                 //drawImage(image, sx = x position on spritesheet, sy = y position on spritesheet, sWidth = spriteWidth, sHeight = spriteHeight, dx, dy, dWidth= draw Width, dHeight = draw height)
                 context.drawImage(this.playerImg, this.frameX * this.width , this.frameY , this.width, this.height, this.x, this.y, this.width, this.height);
            }
        }
        testBoundsOfObject(this.x+this.width/3, this.y +this.height/2, 0, this.game.data, context, false, this.width/4, this.height/2) 
    }
    handleScreen(){
        if(this.x + this.width/2 > this.game.width ){
            this.x = this.game.width - this.width
        }
        else if(this.x < 0 -this.width/2){
            this.x = 0 -this.width/2;
        }
        else if(this.y + this.height/2 > this.game.height){
            this.y = this.game.height - this.height
        }
        else if(this.y < 0){
            this.y = 0;
        }
    }
}


export default Player;