import { randomNum, randomRGB, randomSign, degToRad , handleEdgeOfScreen} from "../utilityFunctions/utilityFunctions.js";
class Background{
    constructor(game){
        this.game = game;
        this.stars = []; // define the stars array here
        this.star; // define a single star
        this.starSpeed = this.game.data.STAR_SPEED * this.game.width; // set the speed of the stars
      
        //initialize all the start
        for (let i = 0; i < this.game.data.STAR_NUM; i++) {
            let newStar = this.init()
            this.stars.push(newStar);
        }

    }

    update(context, deltaTime){
        this.drawSpace(context);
        this.updateStar(context, deltaTime);

        // console.log(this.stars)

    }
    updateStar(context, deltaTime){
        // ctx.fillStyle = data.STAR_COLOR;
        for(let i = 0; i < this.stars.length; i++){
            //draw all the stars in the array
            this.drawStar(context, this.stars[i].x, this.stars[i].y, this.stars[i].radius / degToRad(100))
            
            //update the position of the star
            this.stars[i].x += this.stars[i].velocityX * deltaTime * this.game.data.STAR_VELOCITY_RATIO;
            this.stars[i].y += this.stars[i].velocityY * deltaTime * this.game.data.STAR_VELOCITY_RATIO;
            handleEdgeOfScreen(this.stars[i], this.game.width, this.game.height);
        }
    }

    drawStar(context, x,y,radius){ // First star with radius size of 0.005  // size = 500 * 0.018
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
    drawSpace(context){
        // console.log("drawing")
        context.fillStyle = this.game.data.SPACE_COLOR;
        context.fillRect(0, 0, this.game.width, this.game.height)
        // this.updateStar()  
    }

    init(){
        const speedMult =  randomNum(this.game.data.STAR_SPEED_MULT_MIN, this.game.data.STAR_SPEED_MULT_MAX) //set the speed of the star to a number between 0.2 - 1.2
        const starVelocityX = this.starSpeed * randomSign() * Math.random();
        const starVelocityY =  Math.sqrt(Math.pow(this.starSpeed, 2) - Math.pow(starVelocityX, 2) * randomSign()); //using pythagoras theorem yv = sqrt(starspeed^2 - xv^2)

        this.star={
            radius: this.game.data.STAR_SIZE * Math.random() * this.game.width / 2, 
            x: Math.floor(Math.random() * this.game.width), // assign a random number in the x direction
            y: Math.floor(Math.random() * this.game.width), // assign a random number in the y direction
            velocityX: starVelocityX * speedMult /this.game.data.FPS,
            velocityY: starVelocityY * speedMult  /this.game.data.FPS, 
            
        }
        return this.star;
    }

}

export default Background;