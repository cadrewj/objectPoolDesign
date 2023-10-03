import { randomNum, randomRGB, randomSign, degToRad , handleEdgeOfScreen} from "../utilityFunctions/utilityFunctions.js";
export class Background{
    constructor(width, height, data){
        this.game = {
            width: width,
            height: height,
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
    resize(width, height){ // used to resize the effect when the window size changes
        this.game.width = width;
        this.game.height = height;
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
        this.speed = 1000; //this.game.player.maxSpeed;
        this.stars = []; // define the stars array here
        this.star; // define a single star
        this.starSpeed = this.game.data.STAR_SPEED * this.game.width; // set the speed of the stars
        this.init();
   
      
      
    }
    resize(width, height){ // used to resize the effect when the window size changes
        this.game.width = width;
        this.game.height = height;
        this.init();
    }
    update(context, deltaTime, spaceship) {
        for (let i = 0; i < this.stars.length; i++) {
            context.save();
    
            // Translate to the star's position
            context.translate(this.stars[i].position.x, this.stars[i].position.y);
    
            // Rotate the star around its center
            context.rotate(this.stars[i].angle);
    
            // Draw the star at the center (0, 0)
            this.draw(context, 0, 0, this.stars[i].radius / degToRad(100));
    
            context.restore();
    
            // Update the angle for the next frame
            this.stars[i].angle += 0.01 * this.stars[i].rotationDirection; // Adjust the rotation speed as needed
    
            // Update the position of the star
            if (spaceship.thrusting && ((this.stars[i].velocity.y || this.stars[i].velocity.x) < this.speed)) {
                // Increase star velocity while thrusting
                this.stars[i].velocity.x *= 1.1;
                this.stars[i].velocity.y *= 2.1;
            } else if (spaceship.revThrusting && ((this.stars[i].velocity.y || this.stars[i].velocity.x) > -this.speed)) {
                // Reverse thrusting effect: Decrease star velocity in the opposite direction
                this.stars[i].velocity.x *= -1.1; // Adjust the factor as needed
                this.stars[i].velocity.y *= -2.1; // Adjust the factor as needed
            } else {
                // Gradually reduce velocity back to original when not thrusting
                if (this.stars[i].originalVelocity) {
                    this.stars[i].velocity.x += (this.stars[i].originalVelocity.x - this.stars[i].velocity.x) * 0.02;
                    this.stars[i].velocity.y += (this.stars[i].originalVelocity.y - this.stars[i].velocity.y) * 0.02;
                }
            }
    
            this.stars[i].position.x += this.stars[i].velocity.x * deltaTime * this.game.data.STAR_VELOCITY_RATIO;
            this.stars[i].position.y += this.stars[i].velocity.y * deltaTime * this.game.data.STAR_VELOCITY_RATIO;
            // Stars wrap around the screen edges
            handleEdgeOfScreen(this.stars[i], this.game.width, this.game.height);
        }
    }
    // Function to draw a custom star shape using Bézier curves
    draw(context, x, y, radius) {
        context.save(); // Save the current drawing state

        context.beginPath(); // Begin a new drawing path
        context.fillStyle = randomRGB(); // Set a random fill color for the star

        // Loop to create the points of the star
        for (let i = 0; i < 5; i++) {
            // Calculate the angle for the outer point of the star
            const angle = (Math.PI * 2 * i) / 5;
            const outerX = x + Math.cos(angle) * radius; // Calculate the x-coordinate of the outer point
            const outerY = y + Math.sin(angle) * radius; // Calculate the y-coordinate of the outer point
            context.lineTo(outerX, outerY); // Connect to the outer point

            // Calculate the angle for the inner point of the star (between the outer points)
            const innerAngle = angle + (Math.PI / 5);
            const innerX = x + Math.cos(innerAngle) * (radius / 3); // Calculate the x-coordinate of the inner point
            const innerY = y + Math.sin(innerAngle) * (radius / 3); // Calculate the y-coordinate of the inner point
            context.lineTo(innerX, innerY); // Connect to the inner point

            // Define control points for Bézier curves to create the inner curves of the star
            const innerControl1X = x + Math.cos(innerAngle - (Math.PI / 12)) * (radius / 2.7);
            const innerControl1Y = y + Math.sin(innerAngle - (Math.PI / 12)) * (radius / 2.7);
            const innerControl2X = x + Math.cos(innerAngle + (Math.PI / 12)) * (radius / 2.7);
            const innerControl2Y = y + Math.sin(innerAngle + (Math.PI / 12)) * (radius / 2.7);

            // Use bezierCurveTo to create a smooth curve between the inner point and the control points
            context.bezierCurveTo(innerControl1X, innerControl1Y, innerControl2X, innerControl2Y, innerX, innerY);
        }

        context.closePath(); // Close the path to connect the last point to the first
        context.fill(); // Fill the star shape with the chosen fill color

        context.restore(); // Restore the original drawing state
    }

    
    
    // Function to draw a star shape on a canvas option 2
    // draw(context, x, y, radius) {
    //     context.save(); // Save the current drawing state
        
    //     const spikes = 5; // Number of spikes on the star
    //     const outerRadius = radius; // Radius of the outer points of the star
    //     const innerRadius = radius / 2; // Radius of the inner points of the star
        
    //     context.beginPath(); // Begin a new drawing path
        
    //     // Calculate the angle step between each spike (dividing a full circle by the number of spikes)
    //     const angleStep = (degToRad(360)) / (spikes * 2);
        
    //     // Loop to create the points of the star
    //     for (let i = 0; i < spikes * 2; i++) {
    //         // Determine whether the current point is an outer or inner point based on 'i'
    //         const radius = i % 2 === 0 ? outerRadius : innerRadius;
            
    //         // Calculate the angle for the current point
    //         const angle = i * angleStep;
            
    //         // Calculate the coordinates (x1, y1) for the current point based on the angle and radius
    //         const x1 = x + Math.cos(angle) * radius;
    //         const y1 = y + Math.sin(angle) * radius;
            
    //         // Check if it's the first point to start a new path, or subsequent points to connect with a line
    //         if (i === 0) {
    //             context.moveTo(x1, y1); // Start a new path
    //         } else {
    //             context.lineTo(x1, y1); // Connect to the previous point with a line
    //         }
    //     }
        
    //     context.closePath(); // Close the path to connect the last point to the first
    //     context.fillStyle = randomRGB(); // Set a random fill color for the star
    //     context.fill(); // Fill the star shape with the chosen fill color
        
    //     context.restore(); // Restore the original drawing state
    // }

    
    init() {
        // Initialize all the stars
        this.stars = [];
        for (let i = 0; i < this.game.data.STAR_NUM; i++) {
            const speedMult = randomNum(this.game.data.STAR_SPEED_MULT_MIN, this.game.data.STAR_SPEED_MULT_MAX);
            const starVelocityX = this.starSpeed * randomSign() * Math.random();
            const starVelocityY = Math.sqrt(Math.pow(this.starSpeed, 2) - Math.pow(starVelocityX, 2) * randomSign());
    
            // Generate a random value between -1 and 1 to represent rotation direction
            const rotationDirection = (Math.random() < 0.5) ? -1 : 1;
    
            this.star = {
                radius: this.game.data.STAR_SIZE * Math.random() * this.game.width / 2,
                position: {
                    x: Math.floor(Math.random() * this.game.width),
                    y: Math.floor(Math.random() * this.game.width),
                },
                velocity: {
                    x: starVelocityX * speedMult / this.game.data.FPS,
                    y: starVelocityY * speedMult / this.game.data.FPS,
                },
                originalVelocity: {
                    x: starVelocityX * speedMult / this.game.data.FPS,
                    y: starVelocityY * speedMult / this.game.data.FPS,
                },
                rotationDirection: rotationDirection, // Assign the random rotation direction
                angle: Math.random() * Math.PI * 2, // Assign a random initial angle
            };
            this.stars.push(this.star);
        }
    }
    
    
    
}