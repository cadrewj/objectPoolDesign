
class Player{
    constructor(game, staggerFrames = 5){
        this.game = game;
        this.width = 128 // width of one frame in the sprite 
        this.height = 96 // height of the sprite
        this.x = this.game.width * 0.20; //position of the player on the x axis
        this.y = this.game.height - this.height; //position of the player on the y axis
        this.inSpace = true;
        this.playerImg = document.querySelector("#run")//new Image(); // sprite image of the player;
        this.velocityX = 0;
        this.maxSpeed = 2; 
        this.velocityY = 0;
        this.jumpHeight = 20;
        this.friction = 0.99;
        this.weight = 1;
        this.frameX = 0;
        this.frameY = 0;
        this.frameNum = 0;
        this.flip = false;
        this.staggerFrames = staggerFrames; // used to slow down the speed of the animation
    }
    update(context, input){
        this.draw(context)
        this.playerImg.src = "./images/player/idle.png";
        this.frameNum = 3;

        if(input.keys.includes("g")){
            this.playerImg.src = "./images/player/attack.png";
            this.frameNum = 7;
        }
        //horizontal movement
        if(input.keys.includes("d")){ //set an action for the keyboard input
            this.playerImg.src = "./images/player/run.png";
            this.frameNum = 7;
            this.velocityX = this.maxSpeed;
            this.flip = false;
        }
        else if(input.keys.includes("a")){
            this.playerImg.src = "./images/player/run.png";
            this.frameNum = 7;
            this.velocityX = -this.maxSpeed;
            this.flip = true;
            // this.frameX = 0;
        }
        else{
            this.velocityX = 0
        }
        this.x += this.velocityX;

        //vertical movement
        if(input.keys.includes("w") && this.onGround()){
            this.playerImg.src = "./images/player/jump.png";
            this.frameNum = 2;
            this.velocityY -= this.jumpHeight * this.friction;
            console.log("jump")
        }
        this.y += this.velocityY //this must be after the input includes for the code to work.
        if(!this.onGround()){
            this.playerImg.src = "./images/player/fall.png";
            this.frameNum = 1;
            this.velocityY += this.weight;
            console.log("falling")
        }
        else{
            this.velocityY = 0;   
        }
        //used to reset the player height to the ground in the event that the player ends up under the ground level
        if(this.y >this.game.height - this.height){ 
            this.y = this.game.height - this.height

        }
        this.handleScreen()
    }
    onGround(){
        return this.y >= this.game.height - this.height;
    }
    draw(context){
        if(this.playerImg.complete){
            if(this.game.gameFrames % this.staggerFrames === 0){
                if(this.frameX < this.frameNum){
                    this.frameX++;
                }
                else{
                    this.frameX = 0
                }
            }
            if(this.flip){
                context.save(); // save the current state of the context
                context.translate(this.x + this.width, this.y); // move the context to the right edge of the image
                context.scale(-1, 1); // flip the x-axis
                context.drawImage(this.playerImg, this.frameX * this.width , this.frameY , this.width, this.height, 0, 0, this.width, this.height);
                context.restore(); // restore the context to its previous state
            }
            else{
                 //drawImage(image, sx = x position on spritesheet, sy = y position on spritesheet, sWidth = spriteWidth, sHeight = spriteHeight, dx, dy, dWidth= draw Width, dHeight = draw height)
                 context.drawImage(this.playerImg, this.frameX * this.width , this.frameY , this.width, this.height, this.x, this.y, this.width, this.height);
            }
        } 
    }
    handleScreen(){
        if(this.x + this.width > this.game.width ){
            this.x = this.game.width - this.width
        }
        else if(this.x < 0){
            this.x = 0;
        }
        else if(this.y + this.height > this.game.height){
            this.y = this.game.height - this.height
        }
        else if(this.y < 0){
            this.y = 0;
        }
    }
}


export default Player;