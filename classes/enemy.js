import { randomNum} from "../utilityFunctions/utilityFunctions.js";

export class Enemy{
    constructor(width, height, data){
        this.game = {
            width: width,
            height: height,
            data: data
        };
        this.width = Math.floor(this.game.width * 0.2);//Math.floor(this.game.width * 0.1),
        this.height= Math.floor(this.game.height * 0.1);//Math.floor(this.game.height * 0.08),
        
        this.enemy = {
            image: document.querySelector("#fox"),
            sx:0,
            sy:0,
            sw: 80,
            sh: 48,
        }
        this.radius = this.width/2
        this.frames = {
            x:0,
            y:0
        }
        this.framesNum = 7
        this.originalPosition ={
            x: this.game.width,
            y: this.game.height - this.height,
        } 
        this.position = {
            x: this.game.width,
            y: this.game.height - this.height,
        }
        this.hitCircle = {
            position:{
                x: this.position.x,
                y: this.position.y,
            },
            width: this.width/3,
            height: this.height/3,
        } 
        this.speed = randomNum(1, 3) //Math.random() * 0.15 + 0.01;
        this.staggerFrames = 5;
        this.free = true;
    }
    update(context, gameFrames){ 
        if(!this.free){
            this.draw(context) 
            if(this.enemy.image.complete){
                // draw the image
                if(gameFrames % this.staggerFrames === 0){ // slow down the transitions between the animation frames
                    if(this.frames.x < this.framesNum){
                        this.frames.x++; // move through the different frames in the animation 
                    }
                    else{
                        this.frames.x = 0 //return to the first frame in the animation
                    }  
                }
                this.position.x -=this.speed; // change the position of the enemy on the x axis
            }
             //check if colliding with screen bounds
             if(this.position.x < 0 -this.width){ 
                this.position.x = this.game.width + this.width; //reset the position of enemt to offscreen x axis
                this.reset() //remove meteor from the screen by setting its value to free
            }  
        }
    } 
    reset(){ //make an enemy available for use in the enemy pool 
        this.free = true; 
        this.position.x = this.originalPosition.x
    }
    start(){ //reset the position of the enemy to off screen.
        this.free = false;
        this.position.x = this.originalPosition.x
        this.position.y = this.originalPosition.y
    }

    draw(context){
        //flip the direction the enemy is facing
        context.save(); // save the current state of the context
        context.translate(this.position.x + this.width, this.position.y); // move the context to the right edge of the image
        context.scale(-1, 1); // flip the x-axis

        context.drawImage(this.enemy.image, this.enemy.sw * this.frames.x, this.enemy.sy, this.enemy.sw, this.enemy.sh,
            0, 0, this.width, this.height)
        context.restore()
    }
}

export class FlyingEnemy extends Enemy{
    constructor(width, height, data){
        super();
        this.game = {
            width: width,
            height: height,
            data: data
        };
        this.width = Math.floor(this.game.width * 0.1);
        this.height = Math.floor(this.game.height * 0.1);
    
        this.enemy ={
            image: document.querySelector("#jelly"),
            sx:0,
            sy:0,
            sw: 39,
            sh: 27,

        }
        this.radius = this.enemy.width/2;
        this.originalPosition.x = this.game.width;
        this.originalPosition.y = Math.random() * this.game.height * 0.5;//randomNum(this.enemy.width, this.game.height * 0.5);
        this.position.x = this.game.width;
        this.position.y = Math.random()* this.game.height * 0.5;//randomNum(this.enemy.width, this.game.height * 0.5);
        
        this.speed = randomNum(1, 4) //Math.random() * 0.15 + 0.01;
        this.staggerFrames = 5;
        this.framesNum = 0
    }
}