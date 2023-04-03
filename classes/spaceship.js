import data from "../data/data.json" assert { type: "json" }
import { degToRad } from "../utilityFunctions/utilityFunctions.js";
class Spaceship{
    constructor(game){
        this.game = game;
        this.x = this.game.width / 2;
        this.y = this.game.height / 2;
        this.radius = data.SPACESHIP_SIZE / 2;
        this.ship = {
            image: document.querySelector("#spaceship"),
            width : data.SPACESHIP_SIZE,
            height: data.SPACESHIP_SIZE,
        }
        this.thruster = {
            image: document.querySelector("#thrust1"),
            width : data.SPACESHIP_SIZE,
            height: data.SPACESHIP_SIZE,
            offset: 45,
        }
        this.revThruster = {
            image: document.querySelector("#rthrust"),
            width : data.SPACESHIP_SIZE/8,
            height: data.SPACESHIP_SIZE/4,
            offset:{x:20,y:5} ,
        }
        this.rotation = 0;
        this.angle = 0;
        this.thrusting = false;
        this.thrust = { x: 0, y: 0 };
        this.reversing = false;
        this.blinkTime = Math.ceil(data.SPACESHIP_BLINK_DUR * data.FPS);
        this.blinkNum = Math.ceil(data.SPACESHIP_INV_DUR / data.SPACESHIP_BLINK_DUR);
        this.accelerationTime = 0;
        this.decelerationTime = 0;
        this.explodeTime = 0;
        this.lives = this.game.lives;
        this.health = 100;
        this.fuel = 100;
        this.canShoot = true;
        this.lasers = [];
        this.shooting = false;
        this.shots = 0;
        this.inSpace = true;
        this.angle = 0;
        this.velocityAngle = Math.random() * 0.02 - 0.01 // random number between -0.01 and 0.01
    }
    update(context){
        let exploding = this.explodeTime > 0;
        let blinkOn = this.blinkNum % 2 == 0;

        if(!exploding){
            if (blinkOn) {
                context.save();
                context.translate(this.x, this.y);
                context.rotate(this.angle);
                context.drawImage(this.ship.image, -this.radius, -this.radius, this.ship.width, this.ship.height);
                context.restore();
                this.thrustWithFriction(context);   
            }
            if (this.blinkNum > 0) {
                this.blinkTime--;
                if (this.blinkTime == 0) {
                    this.blinkTime = Math.ceil(data.SPACESHIP_BLINK_DUR * data.FPS);
                    this.blinkNum--;
                }
            }
            this.thrustWithFriction(context);
            this.moveSpaceship();
            this.changeSpaceshipDirection();
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
    moveSpaceship(){
        // move ship
        if(this.fuel > 0 && this.lives !== 0){
            this.x += this.thrust.x;
            this.y += this.thrust.y; 
        }    
    }
    thrustWithFriction(context){
        if(this.fuel > 0 && this.lives !==0){
            // add thrust and friction
            if(this.thrusting){
                 // acceleration of the ship in pixels per second per second 
                 const thrustAngle = this.angle - Math.PI / 2; // adjust for the image facing upwards
                 this.thrust.x += data.SPACESHIP_THRUST * Math.cos(thrustAngle) / data.FPS;
                 this.thrust.y += data.SPACESHIP_THRUST * Math.sin(thrustAngle) / data.FPS;
            }
            else if(this.reversing){ // reverse thrust
                const thrustAngle = this.angle + Math.PI / 2; // adjust for the image facing upwards
                this.thrust.x += data.SPACESHIP_THRUST_REV * Math.cos(thrustAngle) /data.FPS; 
                this.thrust.y += data.SPACESHIP_THRUST_REV * Math.sin(thrustAngle) /data.FPS;
            }
            else{ //to make the ship come to a slow stop
                // friction coefficient of space (0 = no friction, 1 = lots of friciton) note: friction in physic is a value from 0 -  1 
                this.thrust.x -= data.FRICTION * this.thrust.x / data.FPS;  // FPS = frames per second
                this.thrust.y -= data.FRICTION * this.thrust.y / data.FPS;
            }
            this.drawThruster(context)
        }
    }
    drawThruster(context){
        if(this.thrusting){
            context.save();
            // Translate context to center of image
            context.translate(this.x , this.y);
            context.rotate(this.angle);
            // Translate context to bottom of image
            context.translate(0, this.thruster.offset); // offset is used to position the thruster at the back of the spaceship
            // Draw thruster
            context.drawImage(this.thruster.image, -this.thruster.width/2, -this.thruster.height/2, this.thruster.width, this.thruster.height);
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
        context.translate(this.x, this.y);
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
        context.translate(this.x, this.y);
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
        if(this.lives === 0){ // if dead return and don't rotate
            return
        }
        //rotation
        this.angle += this.rotation; 
        //keep the ship angle between 0 and 360 (two pie)
        if(this.angle < 0){
            this.angle +=(degToRad(360))
        }
        else if(this.angle >= degToRad(360)){
            this.angle -=(degToRad(360))
        }
    }
    drawExplodingShip(context){
        context.beginPath()
        context.fillStyle = "darkred";
        context.arc(this.x,this.y,this.radius * 1.7, 0 ,degToRad(360))
        context.fill()
        context.fillStyle = "red";
        context.arc(this.x,this.y,this.radius * 1.4, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "orange";
        context.arc(this.x,this.y,this.radius * 1.1, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "yellow";
        context.arc(this.x,this.y,this.radius * 0.8, 0 ,degToRad(360))
        context.fill()
        context.beginPath()
        context.fillStyle = "white";
        context.arc(this.x,this.y,this.radius * 0.5, 0 ,degToRad(360))
        context.fill()
    }
}

export default Spaceship;