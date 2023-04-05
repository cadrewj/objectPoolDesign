import { randomNum } from "../utilityFunctions/utilityFunctions.js";

class Enemy{
    constructor(game){
        this.game = game;
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
        this.speed = randomNum(2, 8);
        this.staggerFrames = 4;
        this.free =true;
    }
    update(context){
        if(!this.free){
            if(this.enemy.image.complete){
                if(this.game.gameFrames % this.staggerFrames === 0){
                    if(this.frames.x < this.framesNum){
                        
                        this.frames.x++;
                    }
                    else{
                        this.frames.x = 0
                    }
                    this.draw(context)
                }
                this.x--;
            
            }
             //check if colliding with screen bounds
             if(this.x < 0 -this.enemy.width){ 
                this.x = this.game.width + this.enemy.width; //reset the position of enemt to offscreen x axis
                this.reset() //remove meteor from the screen by setting its value to free
            }
            // else if(this.y > this.game.height  + this.enemy.width/2){
            //     this.y = -this.enemy.height;  //reset the position of enemy to offscreen on y axis
            //     this.reset() //remove meteor from the screen by setting its value to free
            // }    
        }
    } 
    reset(){
        this.free = true; 
    }
    start(){
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