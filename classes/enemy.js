import { randomNum } from "../utilityFunctions/utilityFunctions.js";

class Enemy{
    constructor(width, height){
        this.game = {
            width: width,
            height: height,
        };
        this.enemy = {
            image: document.querySelector("#fox"),
            width: Math.floor(this.game.width * 0.12),
            height: Math.floor(this.game.width * 0.08),
            sx:0,
            sy:0,
            sw: 80,
            sh: 48,
        }
        this.frames = {
            x:0,
            y:0
        }
        this.framesNum = 7
        this.y = this.game.height - this.enemy.height;
        this.x = this.game.width;
        this.speed = randomNum(1, 3) //Math.random() * 0.15 + 0.01;
        this.staggerFrames = 5;
        this.free =true;
    }
    update(context, gameFrames){
        if(!this.free){
            if(this.enemy.image.complete){
                if(gameFrames % this.staggerFrames === 0){ // slow down the transitions between the animation frames
                    if(this.frames.x < this.framesNum){
                        
                        this.frames.x++; // move through the different frames in the animation 
                    }
                    else{
                        this.frames.x = 0 //return to the first frame in the animation
                    }
                    this.draw(context) 
                }
                this.x -=this.speed; // change the position of the enemy on the x axis
            
            }
             //check if colliding with screen bounds
             if(this.x < 0 -this.enemy.width){ 
                this.x = this.game.width + this.enemy.width; //reset the position of enemt to offscreen x axis
                this.reset() //remove meteor from the screen by setting its value to free
            }  
        }
    } 
    reset(){ //make an enemy available for use in the enemy pool 
        this.free = true; 
    }
    start(){ //reset the position of the enemy to off screen.
        this.free = false;
        this.x = this.game.width;
        this.y = this.game.height - this.enemy.height 
    }

    draw(context){
        //flip the direction the enemy is facing
        context.save(); // save the current state of the context
        context.translate(this.x + this.enemy.sw, this.y); // move the context to the right edge of the image
        context.scale(-1, 1); // flip the x-axis
        context.drawImage(this.enemy.image, this.enemy.sw * this.frames.x, this.enemy.sy, this.enemy.sw, this.enemy.sh,
            0, 0, this.enemy.width, this.enemy.height)
        context.restore()
    }
}

export default Enemy;