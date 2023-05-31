import { randomNum, randomRGB, randomSign, degToRad , handleEdgeOfScreen} from "../utilityFunctions/utilityFunctions.js";
export class Background{
    constructor(width, height, data){
        this.game = {
            width: width,
            height: height,
            data: data,
        };
        this.position ={
            x: 0, 
            y:0
        }
        this.image = document.querySelector("#bg")
      
    }

    update(context){
        // this.position.x -= this.speed; //constantly move the background
        // if (this.position.x < 0 - this.game.width){ // reset the background to zero
        //     this.position.x = 0
        // }

        this.draw(context);
        // context.restore();    

    }
    draw(context){
        // console.log("drawing")
        context.beginPath()
        context.fillStyle = this.game.data.SPACE_COLOR;
        // context.fillRect(this.position.x, this.position.y, this.game.width, this.game.height)
        context.drawImage(this.image,this.position.x, this.position.y, this.game.width, this.game.height)
    }

}

export class Stars extends Background{
    constructor(width, height, data){
        super();
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
    update(context, deltaTime){
            // ctx.fillStyle = data.STAR_COLOR;
            for(let i = 0; i < this.stars.length; i++){
                //draw all the stars in the array position.
                this.draw(context, this.stars[i].position.x, this.stars[i].position.y, this.stars[i].radius / degToRad(100))
                
                //update the position of the star
                this.stars[i].position.x += this.stars[i].velocity.x * deltaTime * this.game.data.STAR_VELOCITY_RATIO;
                this.stars[i].position.y += this.stars[i].velocity.y * deltaTime * this.game.data.STAR_VELOCITY_RATIO;
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
            }    
        }
        return this.star;
    }
}