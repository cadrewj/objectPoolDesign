import { testBoundsOfObject } from "../utilityFunctions/utilityFunctions.js";

class Player{
    constructor(game){
        this.game = {
            width: game.width,
            height: game.height,
            data: game.data,
            gameOver: game.gameOver,
            scaled: game.scaled,
        };
        this.playerInfo ={
            image: document.querySelector("#run") ,//new Image(); // sprite image of the player;
            sw: 128, // width of one frame in the sprite 
            sh: 96, // height of the sprite,
            width: this.game.data.PLAYER_SIZE,
            height: this.game.data.PLAYER_SIZE,
            frame: {
                x: 0,
                y: 0,
            },
        };
     
  
        this.position = {
            x: this.game.width * 0.02, //position of the player on the x axis
            y: this.game.height - this.playerInfo.height, //position of the player on the y axis

        }; 
        this.hitbox = {
            position:{
                x: this.position.x + this.playerInfo.width/3,
                y: this.position.y + this.playerInfo.height/2,
            },
            width: this.playerInfo.width/4,
            height: this.playerInfo.height/2,
        } 
        this.camerabox = {
            position:{
                x: this.position.x - this.game.scaled.width * 0.2,
                y: this.position.y - this.game.scaled.height * 0.08
            },
            width: this.game.scaled.width * 0.5,
            height: this.game.scaled.height * 0.4,
        } 
        this.inSpace = true;
        this.onPlanet = true;

     
        this.velocity ={
            x: 0,
            y: 0
        }
        this.maxSpeed = 1; 
        this.jumpHeight = 10;
        this.friction = 0.99;
        this.weight = 0.5;

        this.frameNum = 0;
        this.flip = false;
        this.staggerFrames = 5; // used to slow down the speed of the animation

        this.jump = false;
        this.runLeft =false;
        this.runRight =false;
        this.sheild = false;
        this.attack =false;
    }
    update(context, gameFrames, enemyPool, camera){
        this.handleScreen()  //used to ensure the player doesn't fall off the screen
        this.updateHitBox();
        this.updateCameraBox();
        // this.shouldPanCameraToLeft();
        
        this.draw(context, gameFrames)

        //set the default motion and the default number of frames for the player
        this.playerInfo.image.src = this.game.data.idle;
        this.frameNum = 3;

        if(this.attack){
            this.playerInfo.image.src = this.game.data.attack;
            this.frameNum = 7;
        }
        //horizontal movement
        else if(this.runRight){
            this.playerInfo.image.src = this.game.data.run;
            this.frameNum = 7;
            this.velocity.x = this.maxSpeed;
            this.flip = false;
            this.shouldPanCameraToLeft(camera)
        }
        else if(this.runLeft){
            this.playerInfo.image.src = this.game.data.run;
            this.frameNum = 7;
            this.velocity.x = -this.maxSpeed;
            this.flip = true;
            this.shouldPanCameraToRight(camera)
        }
        else{
            this.velocity.x = 0
        }
        this.position.x += this.velocity.x;

        //vertical movement
        if(this.jump && this.onGround()){
            this.playerInfo.image.src = this.game.data.jump
            this.frameNum = 2;
            this.velocity.y -= this.jumpHeight * this.friction;
            this.shouldPanCameraUp(camera)
            // this.shouldPanCameraDown(camera)
            console.log("jump")
        }
        this.position.y += this.velocity.y //this must be after the input includes for the code to work.
        if(!this.onGround()){
            this.playerInfo.image.src =this.game.data.fall;
            this.frameNum = 1;
            this.velocity.y += this.weight;
            this.shouldPanCameraDown(camera)
            console.log("falling")
        }
        else{
            this.velocity.y = 0;   
        }
        //used to reset the player height to the ground in the event that the player ends up under the ground level
        if(this.position.y > this.game.height - this.playerInfo.height){ 
            this.position.y = this.game.height - this.playerInfo.height;
        }
        

        //set up collision with player
        enemyPool.forEach(e => {
            // const enemy = e.enemy
            const dx = e.position.x - this.position.x;
            const dy = e.position.y - this.position.y;
            const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            if(distance < e.enemy.width/2 + this.hitbox.width){
                console.log("gameover")
                // this.game.gameOver = true;a
            }
            // console.log(e.enemy)
            
        });
        this.handleScreen()  //used to ensure the player doesn't fall off the screen
    }
    onGround(){
        return this.position.y >= this.game.height - this.playerInfo.height;
    }
    draw(context, gameFrames){
        if(this.game.data.SHOW_BOUNDING){ //used for testing
            //draw cameraBox
            context.beginPath()
            context.fillStyle = "yellow";
            context.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height);

            //draw hitbox
            context.beginPath()
            context.strokeStyle = "red";
            context.strokeRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        }

        if(this.playerInfo.image.complete){
            if(gameFrames % this.staggerFrames === 0){
                if(this.playerInfo.frame.x < this.frameNum){
                    this.playerInfo.frame.x++;
                }
                else{
                    this.playerInfo.frame.x = 0
                }
            }
            if(this.flip){
                context.save(); // save the current state of the context
                context.translate(this.position.x + this.playerInfo.width, this.position.y ); // move the context to the right edge of the image
                context.scale(-1, 1); // flip the x-axis
                context.drawImage(this.playerInfo.image, this.playerInfo.frame.x * this.playerInfo.sw, this.playerInfo.frame.y , this.playerInfo.sw, this.playerInfo.sh, 
                    0, 0, this.playerInfo.width, this.playerInfo.height);
                context.restore(); // restore the context to its previous state
            }
            else{
                 //drawImage(image, sx = x position on spritesheet, sy = y position on spritesheet, sWidth = spriteWidth, sHeight = spriteHeight, dx, dy, dWidth= draw Width, dHeight = draw height)
                 context.drawImage(this.playerInfo.image, this.playerInfo.frame.x * this.playerInfo.sw, this.playerInfo.frame.y, this.playerInfo.sw, this.playerInfo.sh, 
                     this.position.x, this.position.y, this.playerInfo.width, this.playerInfo.height);
            }
        }
    }
    handleScreen(){ //has small bug
        if(this.position.x + this.hitbox.width + this.velocity.x >= this.game.width){   
            this.position.x = this.game.width - this.hitbox.width
            this.velocity.x = 0;
        }
        else if(this.position.x + this.velocity.x <= 0 - this.hitbox.width){
            this.position.x = 0 - this.hitbox.width;
            this.velocity.x = 0;
        }
        if(this.position.y + this.hitbox.height + this.velocity.y >= this.game.height){
            this.position.y = this.game.height - this.hitbox.height
            this.velocity.y = 0;
        }
        else if(this.position.y + this.velocity.y <= 0  - this.hitbox.height){
            this.position.y = 0 - this.hitbox.height;
            this.velocity.y = 0;
        }
    }
    updateHitBox(){
        this.hitbox = {
            position:{
                x: this.position.x + this.playerInfo.width/3,
                y: this.position.y + this.playerInfo.height/2,
            },
            width: this.playerInfo.width/4,
            height: this.playerInfo.height/2,
        } 
    }
    updateCameraBox(){
        this.camerabox = {
            position:{
                x: this.position.x - this.game.scaled.width * 0.2,//this.game.width * (0.4/4)/2,
                y: this.position.y - this.game.scaled.height * 0.08//this.game.height * (0.4/4)/5,
            },
            width: this.game.scaled.width * 0.5,
            height: this.game.scaled.height * 0.4,
        } 
    }
    shouldPanCameraToLeft(camera){
        const cameraBoxRightSide = this.camerabox.position.x + this.camerabox.width;
        if(cameraBoxRightSide + this.velocity.x >= this.game.width){ //prevent panning beyond width of background
            return
        }
        if(cameraBoxRightSide + this.velocity.x >= this.game.scaled.width + Math.abs(camera.position.x)){ //pan when the right side of the camera collide   
            camera.position.x -= this.velocity.x  //translate left
        }

    }
    shouldPanCameraToRight(camera){
        const cameraBoxLeftSide = this.camerabox.position.x;
        if(cameraBoxLeftSide + this.velocity.x <= 0){ //prevent panning beyond 0
            return
        }
        if(cameraBoxLeftSide + this.velocity.x <= Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x  // translate right
        }

    }
    shouldPanCameraUp(camera){
        const cameraBoxBottom = this.camerabox.position.y + this.camerabox.height;
        if(cameraBoxBottom + this.velocity.y >= this.game.height){ //prevent panning beyond width of background
            return
        }
        if(cameraBoxBottom >= this.game.scaled.height + Math.abs(camera.position.y)){ //pan when the bottom side of the camera collide   
            camera.position.y -= this.velocity.y  //translate up
        }

    }
    shouldPanCameraDown(camera){
        const cameraBoxTop = this.camerabox.position.y;
        if(cameraBoxTop + this.velocity.y <= 0){ //prevent panning beyond 0
            return
        }
        if(cameraBoxTop + this.velocity.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.velocity.y  // translate down;  note: this.velocity is negative, so two negatives = positive
        }
        
    }
}


export default Player;