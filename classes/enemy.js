import { randomNum} from "../utilityFunctions/utilityFunctions.js";

class Enemy{
    constructor(game){
        this.game = game
        this.frames = {
            x:0,
            y:0
        }
        this.FPS = 60;
        this.frameInterval = 1000/this.FPS
        this.frameTimer = 0
        this.maxFrames = 7
        // this.free = false;
        this.markedForDeletion = false;

    }
    update(deltaTime){ 
        if(this.enemy.image.complete){
            // draw the image
            if(this.frameTimer > this.frameInterval){ // slow down the transitions between the animation frames
                this.frameTimer = 0;
                if(this.frames.x < this.maxFrames){
                    this.frames.x++; // move through the different frames in the animation 
                }
                else{
                    this.frames.x = 0 //return to the first frame in the animation
                }  
            }
            else{
                this.frameTimer+= deltaTime;
            }
            
            //check if colliding with screen bounds
            if(this.position.x < 0 -this.width || this.position.y > this.game.height + this.height){ 
                this.markedForDeletion = true;
                // this.reset() //remove meteor from the screen by setting its value to free
            }
            
            // handle movement
            this.position.x -=this.velocity.x; // change the position of the enemy on the x axis
            this.position.y +=this.velocity.y;
        }
    }
    reset(){ //make an enemy available for use in the enemy pool 
        this.free = true; 
        this.position ={
            x: this.game.width,
            y: Math.random()* this.game.height * 0.65
        } 
    }
    start(){ //reset the position of the enemy to off screen.
        this.free = false;
    }

    draw(context){
        //flip the direction the enemy is facing
        context.save(); // save the current state of the context
        context.translate(this.position.x + this.width, this.position.y); // move the context to the right edge of the image
        context.scale(-1, 1); // flip the x-axis

        context.drawImage(this.enemy.image, this.enemy.sw * this.frames.x, this.enemy.sy * this.frames.y, this.enemy.sw, this.enemy.sh,
            0, 0, this.width, this.height)
        context.restore()
    }

}

export class FlyingEnemy extends Enemy{
    constructor(game){
        super(game);
        this.game = game;
        this.width = 78;
        this.height = 44;
        this.radius = this.width/2;
        this.position ={
            x: this.game.width + Math.random()* this.game.width * 0.5,
            y: Math.random()* this.game.height * 0.65
        } 
        this.velocity = {
            x: randomNum(1, 2),
            y: Math.random() * 0.15 + 0.01,
            angle: Math.random() * 0.1 + 0.1,
        }
        this.enemy ={
            image: document.querySelector("#jelly"),
            sx:0,
            sy:0,
            sw: 39,
            sh: 27,

        }
        this.hitCircle ={
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/2,

            },
            width: this.width/3.5,
        }
       
        this.angle = 0;

        this.maxFrames = 0
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.velocity.angle;
        this.position.y += Math.sin(this.angle);

    }
    updateHitCircle(){
        this.hitCircle = {
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/2,

            },
            width: this.width/3.5,
        } 
    }
    
}

export class GroundEnemy extends Enemy{
    constructor(game){
        super(game);
        this.game = game
        this.width = 50;
        this.height = 50;
        this.radius = this.width/2;
        this.weight = 0.9;
        this.offset = 4.9;
    
        this.enemy ={
            image: document.querySelector("#smashingEnemy"),
            sx:0,
            sy:0,
            sw: 512,
            sh: 512,
        }
        this.position ={
            x: this.game.width,
            y: this.game.height  - this.height/this.offset - this.game.groundMargin
        } 
        
        this.velocity = {
            x: randomNum(1, 3),
            y: 0
        }

        this.hitCircle ={
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/2,

            },
            width: this.width/2,
        }
        this.maxFrames = 0;
        this.timer = 0;
        this.interval = 3000;
    }
    update(deltaTime){
        super.update(deltaTime);
        // this.angle += this.velocity.angle;
        if(!this.onGround()){
            this.velocity.y += this.weight;
        }
        else{
            this.velocity.y = 0; // make player fall after jump
        }
        if(this.position.y > this.game.height - this.height/this.offset){// ensure player doesn't fall off screen
            this.position.y = this.game.height - this.height/this.offset - this.game.groundMargin;
        }

        if(this.timer > this.interval && Math.random() < 0.2){ //adding randmon make the interval less predictable
            this.velocity.y -= 20 
            this.timer = 0;
        }
        else{
            this.timer += deltaTime;
        }
    }
    onGround(){
        return(this.position.y >= this.game.height - this.height/this.offset - this.game.groundMargin )
    }
    updateHitCircle(){
        this.hitCircle = {
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/2,

            },
            width: this.width/2,
        } 
    }
    
}


export class ClimbingEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game
        this.width = Math.floor(this.game.width * 0.07);
        this.height = Math.floor(this.game.height * 0.07);
        this.radius = this.width/2;
        this.enemy ={
            image: document.querySelector("#climbingEnemy"),
            sx:0,
            sy:0,
            sw: 512,
            sh: 512,
        }
        this.position ={
            x: this.game.width * Math.random(),
            y: 0 - Math.random()* this.game.height * 0.5,
        } 
        
        this.velocity = {
            x: 0,
            y: 0 - Math.random() * 0.5 + 1
            // y: Math.random() > 0.5 ? 1: -1 //creates move up and move down effect

        }
        this.hitCircle ={
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/2,

            },
            width: this.width * 0.35,
        }
        this.maxWebLength = Math.random()* this.game.height
        this.maxFrames = 0
        this.didReverse = false;
    }
    draw(context){
       
        //draw web
        context.beginPath()
        context.strokeStyle = "rgba(255, 255, 255, 0.5)"
        context.moveTo(this.position.x + this.width/2, 0)
        context.lineTo(this.position.x  + this.width/2, this.position.y + this.height/1.40)
        context.stroke()
        super.draw(context)
    }
    updateHitCircle(){
        this.hitCircle = {
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/2,

            },
            width: this.width*0.35,
        } 
    }
    update(deltaTime){
        super.update(deltaTime);
        if(this.position.y >= this.maxWebLength){
            this.velocity.y *= -1; //used to reverse the movement.
            this.didReverse = true;
        }
        else if(this.didReverse && this.position.y < -this.height/2){
            this.velocity.y = 0;
            setTimeout(()=>{
                // this.velocity.y *= -1; //used to reverse the movement.
                this.velocity.y += randomNum(1,4) 
                this.maxWebLength += randomNum(50, 300);
                this.didReverse = false;
            }, Math.floor(Math.random()*3000+ 1000))
          
        }
    }
    // reset(){
    //     super.reset();
    //     this.position ={
    //         x: this.game.width * Math.random(),
    //         y: 0
    //     } 
    // }
    
}

export class FlowEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game
        this.width = Math.floor(this.game.width * 0.1);
        this.height = Math.floor(this.game.height * 0.1);
    
        this.enemy ={
            image: document.querySelector("#jelly"),
            sx:0,
            sy:0,
            sw: 39,
            sh: 27,

        }
        this.radius = this.width/2;
        
        this.position ={
            x: this.game.width,
            y: Math.random()* this.game.height * 0.5
        } 
        
        this.velocity = {
            x: randomNum(1, 4),
            y: Math.random() * 0.15 + 0.01
        }
        this.maxFrames = 0
    }
    
}

export class JumpingEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game
        this.width = Math.floor(this.game.width * 0.1);
        this.height = Math.floor(this.game.height * 0.1);
    
        this.enemy ={
            image: document.querySelector("#jelly"),
            sx:0,
            sy:0,
            sw: 39,
            sh: 27,

        }
        this.radius = this.width/2;
      
        this.position ={
            x: this.game.width,
            y: Math.random()* this.game.height * 0.5
        } 
        
        this.velocity = {
            x: randomNum(1, 4),
            y: Math.random() * 0.15 + 0.01
        }

        this.maxFrames = 0
    }
    
}