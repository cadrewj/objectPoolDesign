import { randomNum, randomRGB, randomSign, degToRad , handleEdgeOfScreen} from "../utilityFunctions/utilityFunctions.js";
export class Background{
    constructor(width, height, data){
        this.game = {
            width: width * 4,
            height: height * 4,
            data: data,
        };
        this.position = {
            x: 0, 
            y: 0
        }
        this.velocity = {
            x: 0, 
            y: 0
        } 
    }
    update(context){
        this.draw(context);
        //move the  background 
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // context.restore();    

    }
    draw(context){
        // console.log("drawing")
        context.save()
        context.beginPath()
        context.fillStyle = "black"//this.game.data.SPACE_COLOR;
        context.fillRect(this.position.x, this.position.y, this.game.width, this.game.height)
        // context.drawImage(this.image,this.position.x, this.position.y, this.game.width, this.game.height)
        context.restore()
    }

}

export class Stars extends Background{
    constructor(width, height, data){
        super(width, height, data);
        this.game = {
            width: width,
            height: height,
            data: data,
        };
        this.speed = 20; //this.game.player.maxSpeed;
        this.stars = []; // define the stars array here
        this.star; // define a single star
        this.starSpeed = this.game.data.STAR_SPEED * this.game.width; // set the speed of the stars
   
      
        //initialize all the startw
        for (let i = 0; i < this.game.data.STAR_NUM; i++) {
            let newStar = this.init()
            this.stars.push(newStar);
        }
    }
    update(context, deltaTime, spaceship) {
        for (let i = 0; i < this.stars.length; i++) {
            // Draw all the stars in the array position.
            this.draw(context, this.stars[i].position.x, this.stars[i].position.y, this.stars[i].radius / degToRad(100));
    
            // Update the position of the star
            if (spaceship.thrusting && ((this.stars[i].velocity.y || this.stars[i].velocity.x) < this.speed * 3)) {
                // Increase star velocity while thrusting
                this.stars[i].velocity.x *= 1.1;
                this.stars[i].velocity.y *= 1.1;
            } else {
                // Gradually reduce velocity back to original when not thrusting
                if (this.stars[i].originalVelocity) {
                    this.stars[i].velocity.x += (this.stars[i].originalVelocity.x - this.stars[i].velocity.x) * 0.02; // You can adjust the interpolation factor
                    this.stars[i].velocity.y += (this.stars[i].originalVelocity.y - this.stars[i].velocity.y) * 0.02; // You can adjust the interpolation factor
                }
            }
            this.stars[i].position.x += this.stars[i].velocity.x * deltaTime * this.game.data.STAR_VELOCITY_RATIO;
            this.stars[i].position.y += this.stars[i].velocity.y * deltaTime * this.game.data.STAR_VELOCITY_RATIO;
            // Stars pop up on the opposite side of the screen
            handleEdgeOfScreen(this.stars[i], this.game.width, this.game.height);
        }
    } 
    
    draw(context, x,y,radius){ // First star with radius size of 0.005  // size = 500 * 0.018
            // Top triangle
            context.beginPath();
            context.moveTo(x, y - radius);
            context.lineTo(x + radius * Math.sqrt(3) / 2, y + radius / 2);
            context.lineTo(x - radius * Math.sqrt(3) / 2, y + radius / 2);
            context.closePath();
            context.fillStyle = randomRGB();
            context.fill();
            
            // Right triangle
            context.beginPath();
            context.moveTo(x + radius, y);
            context.lineTo(x - radius / 2, y + radius * Math.sqrt(3) / 2);
            context.lineTo(x - radius / 2, y - radius * Math.sqrt(3) / 2);
            context.closePath();
            context.fillStyle = randomRGB();//"white";
            context.fill();
            
            // Bottom triangle
            context.beginPath();
            context.moveTo(x, y + radius);
            context.lineTo(x - radius * Math.sqrt(3) / 2, y - radius / 2);
            context.lineTo(x + radius * Math.sqrt(3) / 2, y - radius / 2);
            context.closePath();
            context.fillStyle = randomRGB();//"white";
            context.fill();
            
            // Left triangle
            context.beginPath();
            context.moveTo(x - radius, y);
            context.lineTo(x + radius / 2, y - radius * Math.sqrt(3) / 2);
            context.lineTo(x + radius / 2, y + radius * Math.sqrt(3) / 2);
            context.closePath();
            context.fillStyle = randomRGB();//"white";
            context.fill();
        } 

    
    init(){
        const speedMult =  randomNum(this.game.data.STAR_SPEED_MULT_MIN, this.game.data.STAR_SPEED_MULT_MAX) //set the speed of the star to a number between 0.2 - 1.2
        const starVelocityX = this.starSpeed * randomSign() * Math.random();
        const starVelocityY =  Math.sqrt(Math.pow(this.starSpeed, 2) - Math.pow(starVelocityX, 2) * randomSign()); //using pythagoras theorem yv = sqrt(starspeed^2 - xv^2)

        this.star={
            radius: this.game.data.STAR_SIZE * Math.random() * this.game.width / 2, 
            position:{
                x: Math.floor(Math.random() * this.game.width), // assign a random number in the x direction
                y: Math.floor(Math.random() * this.game.width), // assign a random number in the y direction
            },
            velocity:{
                x: starVelocityX * speedMult /this.game.data.FPS,
                y: starVelocityY * speedMult  /this.game.data.FPS, 
            },
            originalVelocity:{
                x: starVelocityX * speedMult /this.game.data.FPS,
                y: starVelocityY * speedMult  /this.game.data.FPS, 
            }   
        }
        return this.star;
    }
}