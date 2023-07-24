import { randomNum } from "../utilityFunctions/utilityFunctions.js";

export class CollisionAnimation{
    constructor(game,  position, tWidth, tHeight){
        this.game = game;
        this.target ={
            width: tWidth,
            height: tHeight
        }

        this.image = document.querySelector("#smoke");
        this.sw = 16;
        this.sh = 16;
        this.sizeModifier = Math.random() + 0.5 // number between 0.5 and 1.5;
        this.width =  80 * this.sizeModifier;
        this.height =  80 * this.sizeModifier;
        this.position ={
            x: position.x - this.width / 2 ,
            y: position.y - this.height /2
        }
        this.frame ={
            x: 0,
            y: 0,
        }
        this.maxFrames = 5;
        this.velocity ={
            x: randomNum(-5,5),
            y: randomNum(-5,5)//Math.random()
        }
        this.FPS = Math.random() *10 +5//this.game.data.FPS;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.FPS;
        this.markedForDeletion = false; 
    }
    draw(context){
        context.drawImage(this.image, 
            this.frame.x * this.sw, 
            this.frame.y * this.sh,
            this.sw,
            this.sh,
            this.position.x + this.target.width/2, 
            this.position.y + this.target.height/2,
            this.width,
            this.height
        ); 
    }
    update(deltaTime){
        this.position.x += this.velocity.x //change the direction of the particle if facing left
        this.position.y += this.velocity.y 
        
        if(this.frameTimer > this.frameInterval){ // animate player sprite
            this.frame.x++;     
            this.frameTimer = 0;
        }else{
            this.frameTimer += deltaTime;
        }
        if(this.frame.x > this.maxFrames){
            this.markedForDeletion = true;
        }
    }
}