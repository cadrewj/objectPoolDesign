import data from "../data/data.json" assert { type: "json" }
import { degToRad } from "../utilityFunctions/utilityFunctions.js";
class Spaceship{
    constructor(game){
        this.game = game;
        this.x = this.game.width / 2;
        this.y = this.game.height / 2;
        this.radius = data.SPACESHIP_SIZE / 2;
        this.sprtieWidth = data.SPACESHIP_SIZE;
        this.sprtieHeight = data.SPACESHIP_SIZE;
        this.shipImg = document.querySelector("#spaceship")
        this.thrustImg = document.querySelector("#thrust1")
        this.direction = degToRad(90);
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
        // this.lives = lives;
        this.health = 100;
        this.fuel = 100;
        this.canShoot = true;
        this.lasers = [];
        this.shooting = false;
        this.shots = 0;
        this.inSpace = true;
        this.turnThrust = degToRad(270);
        this.angle = 0;
        this.velocityAngle = Math.random() * 0.02 - 0.01 // random number between -0.01 and 0.01
        this.free = false; // boolean used to represent whether a meteor is active or not. 
    }
    draw(context){
        if(!this.free){ //used to draw only the active meteors
            context.save() //make Meteor rotate from absolute center 
            context.translate(this.x, this.y)
            // -this.radius is used to update the x, y coordinate so that the can be align from the center just like the testbound circles
            context.drawImage(this.shipImg, -this.radius,-this.radius, this.sprtieWidth, this.sprtieHeight) //since we translated the image to position x,y, we only need to offest the image by the radius to get the center 
            context.restore()
        }
    }
    reset(){
        this.free = true; 
    }
    start(){
        this.free = false;
        this.x = randomNum(this.radius, this.game.width - this.radius)
        this.y = 0  - this.radius * 2; 
    }
}

export default Spaceship;