import { degToRad, testBoundsOfObject } from "../utilityFunctions/utilityFunctions.js";

// later you need to add all the ship images into one spritesheet for optimisation

class Spaceship{
    constructor(game){
        this.game = {
            width: game.width,
            height: game.height,
            data: game.data,
            gameOver: game.gameOver,
            scaled: game.scaled,
        }
        this.position ={
            x: this.game.scaled.width * 0.5,//this.game.width / 2, //position the ship at the center of x axis
            y: this.game.height - this.game.scaled.height * 0.5,//this.game.height / 2, //position the ship at the center of y axis
        }  
        this.ship = {
            image:  document.querySelector("#spaceshipSprite"),//document.querySelector("#spaceship"),
            width : 30,//this.game.data.SPACESHIP_SIZE,
            height: 30,//this.game.data.SPACESHIP_SIZE,
            radius: 15,//this.game.data.SPACESHIP_SIZE / 2,
            // sx: 0, //frame position on x axis
            // sy: 0, // frame position on y axis
            sw: this.game.data.SPACESHIP_SPRITEWIDTH, //width of each frame
            sh: this.game.data.SPACESHIP_SPRITEHEIGHT, //height of each frame
            frame:{
                x: 0, //note: max x frame for the ship = 60;
                y:0, //only one y frame for the ship
            } 
        }
     
      
        this.staggerFrames = 2; // used to slowdown the animation lower faster, higher slower
        
        this.thruster = {
            image: document.querySelector("#thrust1"),
            width : 30,//this.game.data.SPACESHIP_SIZE,
            height: 30,//this.game.data.SPACESHIP_SIZE,
            offset: 45 * 0.3//45,
        }
        this.revThruster = {
            image: document.querySelector("#rthrust"),
            width :30 /8, //this.game.data.SPACESHIP_SIZE / 8,
            height: 30 /4,//this.game.data.SPACESHIP_SIZE / 4,
            offset:{
                x: 20 * 0.3, //20,
                y: 5 *0.3//5,
            }, //use to place the reverse thruster in the desired location from the ship's position
        }
        this.rotation = 0;
        this.angle = 0;
        this.thrusting = false;
        this.thrust = { x: 0, y: 0 }; //used to calulate the trusting speed and increase it over time
        this.reversing = false;

        this.blinkTime = Math.ceil(this.game.data.SPACESHIP_BLINK_DUR * this.game.data.FPS); 
        this.blinkNum = Math.ceil(this.game.data.SPACESHIP_INV_DUR / this.game.data.SPACESHIP_BLINK_DUR);
        this.explodeTime = 0;

        this.lives = this.game.data.GAME_LIVES;
        this.health = 100;
        this.fuel = 100;

        this.canShoot = true;
        this.lasers = [];
        this.shooting = false;
        this.shots = 0;
        
        this.inSpace = true;

        this.hitCircle = {
            position:{
                x: this.position.x,
                y: this.position.y,
            },
            radius: this.ship.width/2,
 
        } 
        this.cameraCircle = {
            position:{
                x: this.position.x ,//- this.game.width * (0.4/4)/2,
                y: this.position.y,
            },
            radius: this.game.scaled.height * 0.35,
        } 

    }
  
    update(context, gameFrames, camera){
        if(this.game.data.SHOW_BOUNDING){ //used for testing
            //draw cameraCircle
            context.beginPath()
            context.fillStyle = "orange";
            context.arc(this.cameraCircle.position.x, this.cameraCircle.position.y, this.cameraCircle.radius,0, degToRad(360), false);
            context.fill()
            //draw hit circle for spaceship
            context.beginPath()
            context.strokeStyle = "black";
            context.arc(this.hitCircle.position.x, this.hitCircle.position.y, this.hitCircle.radius, 0, degToRad(360), false);
            context.stroke();
        }

        let exploding = this.explodeTime > 0;
        let blinkOn = this.blinkNum % 2 == 0;

        if(!exploding){
            if (blinkOn) {
                context.save();
                context.translate(this.position.x, this.position.y);
                context.rotate(this.angle);
                //draw the ship //w: 15360 frame: 60  sh:256 sw:256 
                context.drawImage(this.ship.image, this.ship.sw * this.ship.frame.x, this.ship.sh * this.ship.frame.y, 
                    this.ship.sw, this.ship.sh,
                -this.ship.radius, -this.ship.radius, this.ship.width, this.ship.height);
                // context.drawImage(this.ship.image, -this.ship.radius, -this.ship.radius, this.ship.width, this.ship.height);
                context.restore();
            }
            if (this.blinkNum > 0) {
                this.blinkTime--;
                if (this.blinkTime == 0) {
                    this.blinkTime = Math.ceil(this.game.data.SPACESHIP_BLINK_DUR * this.game.data.FPS);
                    this.blinkNum--;
                }
            }
             // draw lasers shooting
            if(this.shooting){
                this.shootLaser(context);
             
            }
           
            this.thrustWithFriction(context, gameFrames,camera);
            this.moveSpaceship();
            this.changeSpaceshipDirection();
            this.updateHitCircle();
            this.updateCameraBox();
            this.handleScreen()
            
        }
        else {
            this.drawExplodingShip(context);
            this.canShoot = false;
            this.explodeTime--;
            if (this.explodeTime === 0) {
                this.lives--;
                if (this.lives === 0) {
                    console.log("GAME OVER");
                    setTimeout(() => {
                        console.log("NEW GAME");
                        exploding = false;
                    },1600)
                }
                else{
                    exploding = false;
                }
            }
        }
    }
    moveSpaceship(){ // move ship
        if(this.fuel > 0 && this.lives !== 0){
            this.position.x += this.thrust.x;
            this.position.y += this.thrust.y; 
        }    
    }
    thrustWithFriction(context, gameFrames, camera){
        if(this.fuel > 0 && this.lives !== 0){
            this.shouldPanCameraToRight(camera)
            this.shouldPanCameraUp(camera)
            this.shouldPanCameraToLeft(camera)
            this.shouldPanCameraDown(camera)
            if(this.thrusting){ // add thrust and friction
                // acceleration of the ship in pixels per second per second 
                const thrustAngle = this.angle - degToRad(90)//Math.PI / 2; // adjust for the image facing upwards
                this.thrust.x += this.game.data.SPACESHIP_THRUST * Math.cos(thrustAngle) / this.game.data.FPS;
                this.thrust.y += this.game.data.SPACESHIP_THRUST * Math.sin(thrustAngle) / this.game.data.FPS;

                //go through an animation frame to make the ship look like it is spiraling while thrusting
                if(gameFrames% this.staggerFrames === 0){ //used to slow down the speed of the animation between frames
                    if(this.ship.frame.x < 59){
                        this.ship.frame.x++;
                    }
                    else{
                        this.ship.frame.x = 0
                    }
                }
            }
            else if(this.reversing){ // reverse thrust
                const thrustAngle = this.angle + Math.PI / 2; // adjust for the image facing upwards
                this.thrust.x += this.game.data.SPACESHIP_THRUST_REV * Math.cos(thrustAngle) / this.game.data.FPS; 
                this.thrust.y += this.game.data.SPACESHIP_THRUST_REV * Math.sin(thrustAngle) / this.game.data.FPS;
            }
            else{ //to make the ship come to a slow stop
                // friction coefficient of space (0 = no friction, 1 = lots of friciton) note: friction in physic is a value from 0 -  1 
                this.thrust.x -= this.game.data.FRICTION * this.thrust.x / this.game.data.FPS;  // FPS = frames per second
                this.thrust.y -= this.game.data.FRICTION * this.thrust.y / this.game.data.FPS;
                
                //go reverse through an animation frame to make the ship look like it is reverse spiraling when not thrusting
                if(gameFrames % this.staggerFrames === 0){ //used to slow down the speed of the animation between frames
                    if(this.ship.frame.x !==0){
                        this.ship.frame.x--;
                    }
                }
            }
            this.drawThruster(context)   
        }
    }
    drawThruster(context){
        if(this.thrusting){
            context.save();
            // Translate context to center of image
            context.translate(this.position.x , this.position.y);
            context.rotate(this.angle);
            // Translate context to bottom of image
            context.translate(0, this.thruster.offset); // offset is used to position the thruster at the back of the spaceship
            // Draw thruster
            context.drawImage(this.thruster.image, -this.thruster.width / 2, -this.thruster.height / 2, this.thruster.width, this.thruster.height);
            context.restore();
        }
        else if(this.reversing){ // draw thrusters
            // draw the revThruster image
            this.drawRevThruster(context);
        }
    }
    drawRevThruster(context) {  
        // save the current context state right revthrust
        context.save();
        // translate the context to the position of the spaceship
        context.translate(this.position.x, this.position.y);
        // rotate the context to the rotation of the spaceship
        context.rotate(this.angle);
        // translate the context to the position of the revThruster image relative to the spaceship
        context.translate(this.revThruster.offset.x, -this.revThruster.offset.y);
        // draw the revThruster image
        context.drawImage(this.revThruster.image, -this.revThruster.width / 2, -this.revThruster.height / 2, this.revThruster.width, this.revThruster.height);
        // restore the context state
        context.restore();


        // save the current context state of left revthrust
        context.save();
        // translate the context to the position of the spaceship
        context.translate(this.position.x, this.position.y);
        // rotate the context to the rotation of the spaceship
        context.rotate(this.angle);
        // translate the context to the position of the revThruster image relative to the spaceship
        context.translate(-this.revThruster.offset.x, -this.revThruster.offset.y);
        // draw the revThruster image
        context.drawImage(this.revThruster.image, -this.revThruster.width / 2, -this.revThruster.height / 2, this.revThruster.width, this.revThruster.height);
        // restore the context state
        context.restore();
      }
      
    changeSpaceshipDirection(){ 
        if(this.lives === 0){ // if dead return and don't rotate the ship
            return
        }

        //keep the ship angle between 0 and 360 (two pie)
        if(this.angle < 0){
            this.angle +=(degToRad(360))
        }
        else if(this.angle >= degToRad(360)){
            this.angle -=(degToRad(360))
        }   
        this.angle += this.rotation;  //rotation the ship  
    }
    drawExplodingShip(context){
        context.beginPath()
        context.fillStyle = "darkred";
        context.arc(this.position.x,this.position.y,this.ship.radius * 1.7, 0 ,degToRad(360))
        context.fill()
        context.fillStyle = "red";
        context.arc(this.position.x,this.position.y,this.ship.radius * 1.4, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "orange";
        context.arc(this.position.x,this.position.y,this.ship.radius * 1.1, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "yellow";
        context.arc(this.position.x,this.position.y,this.ship.radius * 0.8, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "white";
        context.arc(this.position.x,this.position.y,this.ship.radius * 0.5, 0 ,degToRad(360))
        context.fill()
    }
    shootLaser(context){
        //create the laser object
        if(this.canShoot && this.lasers.length < this.game.data.SPACESHIP_LASER_MAX){
         let angle = this.angle -  degToRad(90); //Math.PI / 2; // adjust for the image facing upwards
         const laser = { //the location you are shooting from is the nose of the ship
             x: this.position.x + this.ship.radius * Math.cos(angle), // from center of the ship draw a line
             y: this.position.y + this.ship.radius * Math.sin(angle),
             velocityX: this.game.data.SPACESHIP_LASER_SPEED * Math.cos(angle) / this.game.data.FPS,
             velocityY: this.game.data.SPACESHIP_LASER_SPEED * Math.sin(angle) / this.game.data.FPS,
             dist: 0,
             explodeTime: 0,
             // free: true
         }
         this.lasers.push(laser)   
     }
     this.drawLaser(context);    
     //prevent  shooting
     this.canShoot = false;
     }
     
     drawLaser(context){
       
         for(let i = 0; i < this.lasers.length; i++){

            if(this.lasers[i].explodeTime ===  0){
                context.fillStyle =  "rgba(250,128,114, 1)"//"salmon"
                context.beginPath()
                context.arc(this.lasers[i].x, this.lasers[i].y, this.game.data.SPACESHIP_SIZE/2 * this.game.data.SPACESHIP_LASER_SIZE, 0, degToRad(360), false)
                context.fill();
            }
            else{
                // draw expploding laser
                context.fillStyle ="rgba(255, 69, 0,1)"// "orangered"
                context.beginPath()
                context.arc(this.lasers[i].x, this.lasers[i].y, this.game.data.SPACESHIP_SIZE/2 * this.game.data.SPACESHIP_LASER_EXPLODING_SIZE, 0, degToRad(360), false)
                context.fill();
                context.fillStyle = "rgba(250,128,114, 1)"//"salmon"
                context.beginPath()
                context.arc(this.lasers[i].x, this.lasers[i].y, this.game.data.SPACESHIP_SIZE/2 * this.game.data.SPACESHIP_LASER_EXPLODING_SIZE/1.5, 0, degToRad(360), false)
                context.fill();
                context.fillStyle = "rgba(255, 192, 203, 1)"// "pink"
                context.beginPath()
                context.arc(this.lasers[i].x, this.lasers[i].y, this.game.data.SPACESHIP_SIZE/2 * this.game.data.SPACESHIP_LASER_EXPLODING_SIZE/2.5, 0, degToRad(360), false)
                context.fill();
            }  
    
            if(this.lasers[i].dist > this.game.data.SPACESHIP_LASER_MAX_DIST * this.game.height){  
                this.lasers.splice(i, 1);             //delete the laser from the array 
                continue; 
            }
            //handle explosion
            if(this.lasers[i].explodeTime > 0){
                //decrease the explosion time
                this.lasers[i].explodeTime --;
    
                //destroy laser after duration is up
                if(this.lasers[i].explodeTime === 0){
                    this.lasers.splice(i, 1); 
                    continue;
                }
            }
            else{
                //move lasers
                this.lasers[i].x += this.lasers[i].velocityX
                this.lasers[i].y += this.lasers[i].velocityY
    
                //calculate the distance travelled by laser (C^2 = A^2 + B^2)
                this.lasers[i].dist += Math.sqrt(Math.pow(this.lasers[i].velocityX, 2) + Math.pow(this.lasers[i].velocityY, 2)); 
            }
            //detect laser and asteroid collision
            //  hitAsteroid();
        
        } 
            
    }
    updateHitCircle(){
        this.hitCircle = {
            position:{
                x: this.position.x ,
                y: this.position.y,
            },
            radius: this.ship.width/2,
        } 
         
    }
    updateCameraBox(){
        this.cameraCircle = {
            position:{
                x: this.position.x ,//- this.game.width * (0.4/4)/2,
                y: this.position.y,
            },
            radius: this.game.scaled.height * 0.35,
        } 
    }
    shouldPanCameraToLeft(camera){
        const cameraCircleRightSide = this.cameraCircle.position.x + this.cameraCircle.radius;
        if(cameraCircleRightSide + this.thrust.x >= this.game.width){ //prevent panning beyond width of background
            return
        }
        if(cameraCircleRightSide + this.thrust.x >= this.game.scaled.width + Math.abs(camera.position.x)){ //pan when the right side of the camera collide   
            camera.position.x -= this.thrust.x  //translate left
        }

    }
    shouldPanCameraToRight(camera){
        const cameraCircleLeftSide = this.cameraCircle.position.x;
        if(cameraCircleLeftSide + this.thrust.x <= 0){ //prevent panning beyond 0
            return
        }
        if(cameraCircleLeftSide + this.thrust.x <= Math.abs(camera.position.x)){
            camera.position.x -= this.thrust.x  // translate right
        }

    }
    shouldPanCameraUp(camera){
        const cameraCircleBottom = this.cameraCircle.position.y + this.cameraCircle.radius;
        if(cameraCircleBottom + this.thrust.y >= this.game.height){ //prevent panning beyond width of background
            return
        }
        if(cameraCircleBottom >= this.game.scaled.height + Math.abs(camera.position.y)){ //pan when the bottom side of the camera collide   
            camera.position.y -= this.thrust.y  //translate up
        }

    }
    shouldPanCameraDown(camera){
        const cameraCircleTop = this.cameraCircle.position.y;
        if(cameraCircleTop + this.thrust.y <= 0){ //prevent panning beyond 0
            return
        }
        if(cameraCircleTop + this.thrust.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.thrust.y  // translate down;  note: this.velocity is negative, so two negatives = positive
        }
        
    }
    handleScreen(){ //has small bug
        if(this.position.x + this.hitCircle.radius  + this.thrust.x >= this.game.width ){
            this.thrust.x =0;
            this.revThruster.x =0;
            this.position.x = this.game.width - this.hitCircle.radius
        }
        else if(this.position.x + this.thrust.x <= 0  ){
            this.thrust.x = 0;
            this.revThruster.x = 0;
            this.position.x = 0 - this.hitCircle.radius;
        }
        if(this.position.y + this.hitCircle.radius + this.thrust.y >= this.game.height){
            this.thrust.y = 0;
            this.revThruster.y = 0;
            this.position.y = this.game.height - this.hitCircle.radius
            
        }
        else if(this.position.y + this.thrust.y <= 0){
            this.thrust.y = 0;
            this.revThruster.y = 0;
            this.position.y = 0;
        }
    }   
}

export default Spaceship;