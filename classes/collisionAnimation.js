export class collisionAnimation{
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
        this.width =  this.sw * this.sizeModifier;
        this.height =  this.sh * this.sizeModifier;
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
            x: Math.random(),
            y: Math.random()
        }
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
        this.position.x += this.velocity.x + this.game.velocity.x; //change the direction of the particle if facing left
        this.position.y -= this.velocity.y + this.game.velocity.y;
    }
}