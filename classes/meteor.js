import { randomNum, degToRad } from "../utilityFunctions/utilityFunctions.js";

class Meteor {
    constructor(width, height, data){
        this.game = {
            width: width,
            height: height,
            data: data
        }
        this.radius = this.game.width * 0.05;
        this.meteor = {
            image: document.querySelector("#meteor"),
            width: this.radius * 2,
            height: this.radius * 2,
        }
        this.position ={
            x: randomNum(this.radius, this.game.width - this.radius),
            y: 0 -  this.radius,
        } 
        this.velocity ={
            x: Math.random() * 1.5 + 0.1,
            y: Math.random() * 1.5 + 0.1,

        } 
        this.free = true; // boolean used to represent whether a meteor is active or not. 
        this.angle = 0;
        this.velocityAngle = Math.random() * 0.02 - 0.01 // random number between -0.01 and 0.01
    }
    draw(context){
        if(!this.free){ //used to draw only the active meteors
            context.save() //make Meteor rotate from absolute center 
            context.translate(this.position.x, this.position.y) //used to select the center point for rotation
            context.rotate(this.angle);
            // -this.radius is used to update the x, y coordinate so that the can be align from the center just like the testbound circles
            context.drawImage(this.meteor.image, -this.radius,-this.radius, this.meteor.width, this.meteor.height) //since we translated the image to position x,y, we only need to offest the image by the radius to get the center 
            context.restore()
        }
    }
    update(context){
        //used to update only the active meteors position
        if(!this.free){ 
            // this.testBound(context);
            // testBoundsOfObject(this.position.x, this.position.y, this.radius, this.game.data, context)

            this.draw(context);
            this.position.x += this.velocity.y;
            this.position.y += this.velocity.x;
            this.angle += this.velocityAngle;

            //check if colliding with screen bounds
            if(this.position.x > this.game.width + this.radius){ 
                this.position.x = -this.meteor.width; //reset the position of meteor to offscreen x axis
                this.reset() //remove meteor from the screen by setting its value to free
            }
            else if(this.position.y > this.game.width  + this.radius){
                this.position.y = -this.meteor.height;  //reset the position of meteor to offscreen on y axis
                this.reset() //remove meteor from the screen by setting its value to free
            }    
        }
    } 
    reset(){
        this.free = true; 
    }
    start(){
        this.free = false;
        this.position.x = randomNum(this.radius, this.game.width - this.radius)
        this.position.y = 0  - this.radius * 2; 
        this.velocity ={
            x: Math.random() * 1.5 + 0.1,
            y: Math.random() * 1.5 + 0.1,

        } 
    }
}

export default Meteor;