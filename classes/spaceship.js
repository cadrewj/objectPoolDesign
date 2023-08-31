import { degToRad } from "../utilityFunctions/utilityFunctions.js";
import { collisionCircleDetection } from "../utilityFunctions/utilityFunctions.js";

import SpaceshipIDLE from "../states/SpacehipBehavior/SpaceshipIDLE.js";
import { SpaceshipReverseThrust, SpaceshipThrust } from "../states/SpacehipBehavior/SpaceshipThrusting.js";
import SpaceshipChangeDirection from "../states/SpacehipBehavior/SpaceshipChangeDirection.js";
import SpaceshipShootLaser from "../states/SpacehipBehavior/SpaceshipShootLaser.js";
import SpaceshipExploding from "../states/SpacehipBehavior/SpaceshipExploding.js";
import SpaceshipBlinking from "../states/SpacehipBehavior/SpaceshipBlink.js";

class Spaceship{
    constructor(game){
        this.game = game;
        this.states =[ new SpaceshipIDLE(this.game), 
            new SpaceshipThrust(this.game),
            new SpaceshipReverseThrust(this.game),
            new SpaceshipChangeDirection(this.game),
            new SpaceshipShootLaser(this.game),
            new SpaceshipExploding(this.game),
            new SpaceshipBlinking(this.game),
        ];
        this.currentState = this.states[6]; //state idle

        this.position ={
            x: innerHeight/2 , //position the ship at the center of x axis
            y: innerWidth/2, //position the ship at the center of y axis
        }  
        this.image =  document.querySelector("#spaceshipSprite"),//document.querySelector("#spaceship"),
        this.width = this.game.data.SPACESHIP_SIZE,
        this.height = this.game.data.SPACESHIP_SIZE,
        this.radius = this.game.data.SPACESHIP_SIZE / 2,
        this.sw = this.game.data.SPACESHIP_SPRITEWIDTH, //width of each frame
        this.sh = this.game.data.SPACESHIP_SPRITEHEIGHT, //height of each frame
        this.frame ={
                x: 0, //note: max x frame for the ship = 60; // sx: 0, //frame position on x axis
                y: 0, //only one y frame for the ship  // sy: 0, // frame position on y axis
        } 
        
        this.FPS = this.game.data.FPS;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.FPS;
        this.maxFrames = 59;
      
        this.thruster = {
            image: document.querySelector("#thrust1"),
            width : this.game.data.SPACESHIP_SIZE,
            height: this.game.data.SPACESHIP_SIZE,
            offset: 45,
        }
        this.revThruster = {
            image: document.querySelector("#rthrust"),
            width :this.game.data.SPACESHIP_SIZE / 8,
            height:this.game.data.SPACESHIP_SIZE / 4,
            offset:{
                x: 20,
                y: 5,
            }, //use to place the reverse thruster in the desired location from the ship's position
        }
        this.animate = false;
        this.rotation = 0;
        this.angle = 0;
        this.thrusting = false;
        this.revThrusting = false;
        this.thrust = { x: 0, y: 0 }; //used to calulate the trusting speed and increase it over time

        this.blinkOn;
        this.blinkTime = Math.ceil(this.game.data.SPACESHIP_BLINK_DUR * this.game.data.FPS); 
        this.blinkNum = Math.ceil(this.game.data.SPACESHIP_INV_DUR / this.game.data.SPACESHIP_BLINK_DUR);
        this.explodeTime = 0;
        this.exploding = false;

        this.lives = this.game.data.GAME_LIVES;
        this.health = 100;

        this.fuel = 100;
        this.accelartionTime = 0; // used for calculating fuel consumption for thrusting over time
        this.decelerationTime = 0; // used for calculating fuel consumption for thrusting over time
        this.shots = 0 // used for calculating fuel consumption per shot.

        this.canShoot = true;
        this.lasers = [];
        this.shooting = false;

        this.hitCircle = {
            position:{
                x: this.position.x,
                y: this.position.y,
            },
            radius: this.width/3,
            width: this.width/1.5,
            height: this.height/1.5,

        } 
        this.camRadius = this.game.height * 0.25,
        this.cameraBox = {
            position:{
                x: this.position.x - (this.camRadius * 1.5),
                y: this.position.y - this.camRadius,
            }, 
            width: this.camRadius * 3,
            height: this.camRadius * 2,
        }
        this.initLasers();
    }
    update(input, context, camera, deltaTime, playerIsInSpace, isOnPlanet){
        if(!isOnPlanet ){
            this.checkForCollisions();
            this.currentState.handleInput(input, context, playerIsInSpace); 
    
            this.animate = this.fuel > 0
     
            if(this.animate && !playerIsInSpace){
                this.animateFrames(deltaTime);
            }
            this.exploding = this.explodeTime > 0;
            this.blinkOn = this.blinkNum % 2 == 0;

            if(!this.exploding){
                if (this.blinkOn) {
                    context.save();
                    context.translate(this.position.x, this.position.y); //rotate the direction of the ship to face up
                    context.rotate(this.angle); // set the rotation angle
                    context.drawImage(this.image, 
                        this.sw * this.frame.x, this.sh * this.frame.y, 
                        this.sw, this.sh,
                    -this.radius, -this.radius, 
                    this.width, this.height); 
                    context.restore();
                }
                if (this.blinkNum > 0) {
                    this.blinkTime--;
                    if (this.blinkTime == 0) {
                        this.blinkTime = Math.ceil(this.game.data.SPACESHIP_BLINK_DUR * this.game.data.FPS);
                        this.blinkNum--;
                    }
                }
                // //continue game play blinking if you explode
                if(this.health <= 0 && this.lives > 0){
                    //make the ship explode;
                    this.explodeTime = Math.ceil(this.game.data.SPACESHIP_EXPLODING_DUR * this.game.data.FPS); //reset exploding time
                    this.blinkTime = Math.ceil(this.game.data.SPACESHIP_BLINK_DUR * this.game.data.FPS); //reset blinking time
                    this.blinkNum = Math.ceil(this.game.data.SPACESHIP_INV_DUR / this.game.data.SPACESHIP_BLINK_DUR); //reset number of blinks
                    if(this.lives > 0 ){
                        this.health = 100; //reset health of ship
                    }
                }
                // move the ship
                this.position.x += this.thrust.x;
                this.position.y += this.thrust.y;   
            
                //draw laser on the screen
                this.drawLaser(context);

                if(playerIsInSpace === false && isOnPlanet === false){
                    this.updateHitCircle();
                    this.updateCameraBox();
                    this.handleScreen() 
                    this.shouldPanCamera(camera)                
                }          
            }
        }    
    }
    checkForCollisions(){
        this.game.rewards.forEach(reward=>{
            if(reward.type === "recovery"){
                if(reward.isPointInside(this.position.x, this.position.y)){
                    // console.log("recovering fuel")
                    if(this.fuel < 100){
                        this.fuel += 0.05;
                    }
                    if(this.health <100){
                        this.health += 0.05;
                    }
                    if(this.lives < this.game.data.GAME_LIVES){
                        this.lives++;
                    }
                }
            }
        })
    }
    animateFrames(deltaTime){
        if (this.thrusting ){
            if(this.image.complete){//go through an animation frame to make the ship look like it is spiraling while thrusting
                if(this.frameTimer > this.frameInterval){ // animate player sprite //used to slow down the speed of the animation between frames
                    if(this.frame.x < this.maxFrames){
                        this.frame.x++;
                    }
                    else{
                        this.frame.x = 0;
                    }
                    this.frameTimer = 0;
                }
                else{
                    this.frameTimer += deltaTime;
                }
            }
        }
        else{
            //go reverse through an animation frame to make the ship look like it is reverse spiraling when not thrusting
            if(this.frameTimer > this.frameInterval){//used to slow down the speed of the animation between frames
                if(this.frame.x !==0){
                    this.frame.x--;
                }
                // this.frameTimer = 0; 
            }
            else{
                this.frameTimer += deltaTime;
            }
        }
    }
    setState(state){ //the passed state is an index number
        this.currentState = this.states[state]; //set the current state
        this.currentState.enter(); // calls the enter method on the current state you are on 
    }
    drawThruster(context){
        context.save();
        // Translate context to center of image
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);
        // Translate context to bottom of image
        context.translate(0, this.thruster.offset); // offset is used to position the thruster at the back of the space ship
        // Draw thruster
        context.drawImage(this.thruster.image, -this.thruster.width / 2, -this.thruster.height / 2, this.thruster.width, this.thruster.height);
        context.restore();
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
    drawExplodingShip(context){
        context.beginPath()
        context.fillStyle = "darkred";
        context.arc(this.position.x,this.position.y,this.radius * 1.4, 0 ,degToRad(360))
        context.fill()
        context.fillStyle = "red";
        context.arc(this.position.x,this.position.y,this.radius * 1.1, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "orange";
        context.arc(this.position.x,this.position.y,this.radius * 0.8, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "yellow";
        context.arc(this.position.x,this.position.y,this.radius * 0.5, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "white";
        context.arc(this.position.x,this.position.y,this.radius * 0.2, 0 ,degToRad(360))
        context.fill()
    }
    drawLaser(context){
        for(let i = 0; i < this.lasers.length; i++){
            if(!this.lasers[i].free){
                if(this.lasers[i].explodeTime ===  0){
                    context.fillStyle =  "rgba(250,128,114, 1)"//"salmon"
                    context.beginPath()
                    context.arc(this.lasers[i].x, this.lasers[i].y, this.game.data.SPACESHIP_SIZE/2 * this.game.data.SPACESHIP_LASER_SIZE, 0, degToRad(360), false)
                    context.fill();
                }
                else{
                    // draw exploding laser
                    context.fillStyle ="rgba(255, 69, 0, 1)"// "orangered"
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
                    this.lasers[i].free = true; //use and object model to remove the laser instead of deleting
                    continue; 
                }
                //handle explosion
                if(this.lasers[i].explodeTime > 0){
                    //decrease the explosion time
                    this.lasers[i].explodeTime --;
        
                    //destroy laser after duration is up
                    if(this.lasers[i].explodeTime === 0){
                        this.lasers[i].free = true;
                        continue;
                    }
                }
                else{
                    //move lasers
                    this.lasers[i].x += this.lasers[i].velocity.x
                    this.lasers[i].y += this.lasers[i].velocity.y
        
                    //calculate the distance travelled by laser (C^2 = A^2 + B^2)
                    this.lasers[i].dist += Math.sqrt(Math.pow(this.lasers[i].velocity.x, 2) + Math.pow(this.lasers[i].velocity.y, 2)); 
                }
                //detect laser and asteroid collision
                //  hitAsteroid();
            }
        }      
    }
    updateHitCircle(){
        this.hitCircle = {
            position:{
                x: this.position.x ,
                y: this.position.y,
            },
            radius: this.width/3,
        }     
    }
    updateCameraBox(){
        this.cameraBox = {
            position:{
                x: this.position.x - (this.camRadius * 1.5),//- this.game.width * (0.4/4)/2,
                y: this.position.y - this.camRadius,
            },
            width: this.camRadius * 3,
            height: this.camRadius * 2,
        } 
    }
    handleScreen(){
        //rightside of handlescreen
        if(this.hitCircle.position.x  + this.hitCircle.radius + this.thrust.x >= this.game.universe.width/2 ){
            this.thrust.x = 0;
            this.position.x = this.game.universe.width/2 - this.width;
            
            console.log("reach the end width")

        }
        //leftside of the handlescreen
        else if(this.hitCircle.position.x + this.thrust.x <= 0  - this.game.universe.width/2){
            this.thrust.x = 0;
            this.position.x = this.width - this.game.universe.width/2 
            console.log("reach the start")
            //need to set the right bounds for player and ship
    
        }
           //bottom of the screen
           else if(this.position.y + this.hitCircle.radius + this.thrust.y >= this.game.universe.height/2){
            this.thrust.y = 0;
            this.position.y = this.game.universe.height/2 - this.hitCircle.radius
            console.log("reach the end height")
      
        }
        //top of the screen
        else if(this.position.y + this.thrust.y <= 0 - this.game.universe.height/2){
            this.thrust.y = 0;
            this.position.y = this.height - this.game.universe.height/2 ; //has small bug
            console.log("reach top")
        }   
    }  
    shouldPanCamera(camera){ 
        const cameraBoxLeftSide = this.cameraBox.position.x;
        const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;
        const cameraBoxTop = this.cameraBox.position.y;
        const cameraBoxBottom = this.cameraBox.position.y + this.cameraBox.height;
        
        //prevent panning beyond 0
        if(cameraBoxLeftSide + this.thrust.x <= 0 - this.game.universe.width/2){ 
            console.log("reach start post")
            return
        }
        //left panRight
        else if(cameraBoxLeftSide + this.thrust.x <= Math.abs(camera.position.x)){
            camera.position.x -= this.thrust.x  // translate right
            console.log("Lgo")
        }  
        //prevent panning beyond width of background
        if(cameraBoxRightSide + this.thrust.x >= this.game.universe.width/2){ 
            console.log("end of goal post")
            return
        }
        //right panLeft
        else if(cameraBoxRightSide + this.thrust.x >= this.game.width + Math.abs(camera.position.x)){ //pan when the right side of the camera collide   
            camera.position.x -= this.thrust.x  //translate left
            console.log("Rgo")
        }

        //prevent panning  Top beyond 0
        if(cameraBoxTop + this.thrust.y <= 0 - this.game.universe.height/2){
            console.log("reach top post")
            return
        }
        //top pandown
        else if(cameraBoxTop + this.thrust.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.thrust.y  // translate down;  note: this.velocity is negative, so two negatives = positive
            console.log("Tgo")
        }
    
        //prevent panning beyond bottom of background
        if(cameraBoxBottom + this.thrust.y >= this.game.universe.height/2){ 
            console.log("goal post bottom")
            return
        }
        //bottom panUp
        else if(cameraBoxBottom + this.thrust.y >= this.game.height + Math.abs(camera.position.y)){ //pan when the bottom side of the camera collide   
            camera.position.y -= this.thrust.y  //translate up
            console.log("Bgo")
        }
     
    } 
    initLasers(){
        this.lasers =[];
        for(let i = 0; i < this.game.data.SPACESHIP_LASER_MAX; i++){
            let angle = this.angle -  degToRad(90); //Math.PI / 2; // adjust for the image facing upwards
            const laser = { //the location you are shooting from is the nose of the ship
                x: this.position.x + this.radius * Math.cos(angle), // from center of the ship draw a line
                y: this.position.y + this.radius * Math.sin(angle),
                velocity: {
                    x: this.game.data.SPACESHIP_LASER_SPEED * Math.cos(angle) / this.game.data.FPS,
                    y: this.game.data.SPACESHIP_LASER_SPEED * Math.sin(angle) / this.game.data.FPS,
                },
                dist: 0,
                explodeTime: 0,
                free: true
            }
            this.lasers.push(laser)
        }
    }  
}

export default Spaceship;