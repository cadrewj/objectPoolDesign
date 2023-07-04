
import { degToRad, randomSign, handleEdgeOfScreen, randomNum } from "../utilityFunctions/utilityFunctions.js";

export class SelectReward{
    constructor(game, targetX, targetY){
        this.game = game;
        this.x = targetX;
        this.y = targetY
        this.rewardIndex = Math.floor(Math.random() * this.game.rewardTypes.length);
        const rewardType = this.game.rewardTypes[this.rewardIndex];
        if (rewardType) {
            const reward = rewardType(this.game, this.x, this.y); // call the instance of the reward
            this.game.rewards.push(reward);
        } else {
          console.error("Invalid reward type.");
        }
    }
}

export class Food{
    constructor(game, x, y){
        this.game = game
        this.type = "food";
        this.time = 0;
        this.interval = randomNum(5000, 100000)/this.game.data.FPS;
        this.markedForDeletion = false;

        this.position={
            x: x,
            y: y
        };
        this.velocity={
                x: Math.random() * this.game.data.FOOD_SPEED / this.game.data.FPS * randomSign(),
                y: Math.random() * this.game.data.FOOD_SPEED / this.game.data.FPS * randomSign(),
        };
        
        this.radius = this.game.data.FOOD_SIZE / 2;
        this.width = this.radius * 2;
        this.height = this.radius * 2; 
        this.direction = Math.random() * degToRad(Math.random());
        this.vertices = Math.floor(Math.random() * (this.game.data.FOOD_VERTICES + 1) + this.game.data.FOOD_VERTICES/2);
        this.offset = Math.random() * this.game.data.FOOD_JAG * 2 + 1 - this.game.data.FOOD_JAG;
    }
    draw(context){
        context.strokeStyle = this.game.data.FOOD_STROKE_COLOR;
        context.lineWidth = this.game.data.FOOD_LINEWIDTH;
        context.beginPath();
        context.moveTo(this.position.x + this.radius * Math.cos(this.direction), 
        this.position.y + this.radius * this.offset * Math.sin(this.direction));
        for (let j = 1; j < this.vertices; j++) {
            context.lineTo(this.position.x + this.radius * Math.cos(this.direction + j * Math.PI * 2 / this.vertices), 
            this.position.y + this.radius * Math.sin(this.direction + j * degToRad(360) / this.vertices))
            context.arc(this.position.x, this.position.y, this.radius, 0, degToRad(360))
        }
        context.closePath();
        context.stroke();
        
    }
    update(){
        //move food
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.time++;
        // make the food pop up on the other side of the screen
        handleEdgeOfScreen(this, this.game.width, this.game.height);

        //mark the food for deletion
        if(this.time > this.interval){
            this.markedForDeletion = true;
        }
    }
}

export class PhantomTriangle{   
    constructor(game, x, y){
        this.game = game;
        // set x and y coordinates on screen
        this.position={
            x: x,
            y: y
        }
        // Set size
        this.width = 150;
        this.height = 150;

        this.type = "recovery";
        this.time = 0;
        this.interval = randomNum(40000, 70000)/this.game.data.FPS;
        
        //originally 5 was fifty and the width and height was 500;
        this.x1 = this.position.x/2; 
        this.y1 = this.position.y;
        this.x2 = this.position.x-150;
        this.y2 = this.position.y-150;
        this.x3 = this.position.x;
        this.y3 = this.position.y-150; 
        this.amplitude = 10;
        this.frequency = 0.05;
        this.speed = 0.8;
        this.numLines = 20;
        this.markedForDeletion = false;

    }
    draw(context){
        for (let i = 0; i < this.numLines; i++) {
            const yOffset1 = this.y1 + i / this.numLines * (this.y2 - this.y1);
            const yOffset2 = this.y2 + i / this.numLines * (this.y3 - this.y2);
            const yOffset3 = this.y3 + i / this.numLines * (this.y1 - this.y3);
            const xOffset1 = this.x1 + i / this.numLines * (this.x2 - this.x1);
            const xOffset2 = this.x2 + i / this.numLines * (this.x3 - this.x2);
            const xOffset3 = this.x3 + i / this.numLines * (this.x1 - this.x3);
            
            context.beginPath();
              // Draw the wavy background lines for the triangle
            context.strokeStyle = '#7e04a7';
            context.lineWidth = 2;

            context.moveTo(xOffset1, yOffset1);
            const points = [ [xOffset2, yOffset2], [xOffset3, yOffset3], [xOffset1, yOffset1] ];
            for (let j = 0; j < points.length; j++) {
            const point = points[j];
            const offset = Math.sin(point[0] * this.frequency + this.speed * Date.now() / 1000) * this.amplitude;
            context.lineTo(point[0], point[1] + offset);
            }
            context.stroke();

        }
    }
    update(){
        this.time++;

        //mark the food for deletion
        if(this.time > this.interval){
            this.markedForDeletion = true;
        }

    }
    isColliding(x, y, objectRadius) {
        // Calculate the center of the spaceship
        const spaceshipCenterX = x + objectRadius;
        const spaceshipCenterY = y + objectRadius;
    
        // Check if the spaceship's center is within the bounds of the triangle
        if (
          spaceshipCenterX >= this.x1 &&
          spaceshipCenterX <= this.x2 &&
          spaceshipCenterY >= this.y3 &&
          spaceshipCenterY <= this.y1 &&
          (spaceshipCenterY <= this.getY(spaceshipCenterX, this.x1, this.y1, this.x2, this.y2) ||
            spaceshipCenterY <= this.getY(spaceshipCenterX, this.x2, this.y2, this.x3, this.y3) ||
            spaceshipCenterY <= this.getY(spaceshipCenterX, this.x3, this.y3, this.x1, this.y1))
        ) {
          return true; // Colliding
        }
    
        return false; // Not colliding
      }
      
      getY(x, x1, y1, x2, y2) {
        // Calculate the y-coordinate on the line defined by (x1, y1) and (x2, y2) for the given x-coordinate
        return ((y2 - y1) / (x2 - x1)) * (x - x1) + y1;
      }
      isPointInside(x, y) {
        // Check if the given (x, y) point is inside the triangle using the barycentric coordinate method
        const denominator =
          (this.y2 - this.y3) * (this.x1 - this.x3) + (this.x3 - this.x2) * (this.y1 - this.y3);
        const a = ((this.y2 - this.y3) * (x - this.x3) + (this.x3 - this.x2) * (y - this.y3)) / denominator;
        const b = ((this.y3 - this.y1) * (x - this.x3) + (this.x1 - this.x3) * (y - this.y3)) / denominator;
        const c = 1 - a - b;
    
        return a >= 0 && b >= 0 && c >= 0;
      }
      isCollidingWithTriangle(triangle) {
        const spaceshipLeft = this.position.x;
        const spaceshipRight = this.position.x + this.ship.width;
        const spaceshipTop = this.position.y;
        const spaceshipBottom = this.position.y + this.ship.height;
    
        // Check if any of the spaceship's points are outside the triangle
        if (
          !triangle.isPointInside(spaceshipLeft, spaceshipTop) ||
          !triangle.isPointInside(spaceshipRight, spaceshipTop) ||
          !triangle.isPointInside(spaceshipRight, spaceshipBottom) ||
          !triangle.isPointInside(spaceshipLeft, spaceshipBottom)
        ) {
          return false; // Not colliding
        }
    
        return true; // Colliding
      }
      
      
       
}
