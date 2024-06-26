
export function collisionCircleDetection(object1, object2){
    const dist = distanceBetweenPoints(object1.position.x, object1.position.y, object2.position.x, object2.position.y)  
    const value = object1.width/2 + object2.width/2;
    return dist <= value ? (true) : (false);
}
export function collisionBlockDectection(player, enemy){
    return (
           enemy.position.x <= player.position.x + player.width 
                && enemy.position.x + enemy.width >= player.position.x
                &&  enemy.position.y <= player.position.y + player.height 
                && enemy.position.y + enemy.height >= player.position.y
        );

}
export function collideBounceOff(object1, object2, speed){
    const result = collisionCircleDetection(object1, object2);
    if (result === true) {
        // Calculate angle of collision
        const angle = Math.atan2(object2.position.y - object1.position.y, object2.position.x - object1.position.x);
        // Update velocities of both asteriods to move in opposite direction
        return [object1.velocity ={
            x: -speed * Math.cos(angle), // send object1 in the opposite direction
            y: -speed * Math.sin(angle)
        },
        object2.velocity ={
            x: speed * Math.cos(angle), // send object2 in the opposite direction
            y: speed * Math.sin(angle)
        }]
    }
}

export function handleEdgeOfScreen(movingObject, width, height){
    //x axis bounds
    if(movingObject.position.x < 0 - movingObject.radius){  //if the object's x position is less than 0 - the size of the object meaning it of the screen (right)
        movingObject.position.x = movingObject.radius + width; //then place it at the left of the screen
    }
    else if(movingObject.position.x > width + movingObject.radius){
        movingObject.position.x = 0 - movingObject.radius //opposite of the above
    }
// y axis bounds
    if(movingObject.position.y < 0 - movingObject.radius){ //if the object's y position is less than 0 - the size of the object meaning it of the screen (top)
        movingObject.position.y = movingObject.radius + height; //then place it at the bottom of the screen
    }
    else if(movingObject.position.y > height + movingObject.radius){
        movingObject.position.y = 0 - movingObject.radius //opposite of the above
    }

}
 //function used to return negative or positive sign (e.g: -1 or +1)
 export function randomSign(){
    const result =  Math.random() >= 0.5 ?(1): (-1);
    return result
}
//function that return true or false at a rate determined by the number passed in;
export function calculateProbability(probability) {
    if (probability < 0 || probability > 0.9) {
      throw new Error("Probability must be between 0 and 0.9");
    }
  
    const randomValue = Math.random(); // Generate a random number between 0 and 1
  
    return randomValue < probability;
  }

// function to generate random number
export function randomNum(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

export function randomDecimal(min, max) {
    return Math.random() * (max - min) + min;
}
export function randomRGB() {
    return  `rgba(${randomNum(0, 255)},${randomNum(0, 255)},${randomNum(0, 255)})`;
}


// convert to radians
export function degToRad(degree){
    const result = degree / 180 * Math.PI
    return result;
}

export function distanceBetweenPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

}

 /*A sigmoid function is a mathematical function having a characteristic 
    "S"-shaped curve or sigmoid curve.
    Sigmoid functions most often show a return value (y axis) in the range 0 to 1. 
    Another commonly used range is from −1 to 1.
    */
export function sigmoid(x, derivative = false){
    if(derivative){
        return (x * (1 - x))//where x = sigmoid(x)
    }
    return (1 / (1 + Math.exp(-x)))
}
export function angleToPoint(x, y, bearing, targetX, targetY){
    let angleToTarget = Math.atan2(-targetY + y, targetX - x) // angleToTarget can be negative
    let diff = bearing - angleToTarget; //this can be negative but if we add 360 to it the angle will remain the same just positive
    // console.log("angle " + (diff + degToRad(360)) % (degToRad(360)))
    return (diff + Math.PI * 2) % (Math.PI * 2) //thus convert and find remainer. making result between 0 & 360 degrees
}
export function normaliseInput(asteroidSize, canvas, asteroidX, asteroidY, asteroidAngle, spaceshipAngle){
    //normalise the values between 0 and 1
    let input = [];
    input[0] = (asteroidX + asteroidSize / 2) / (canvas.width + asteroidSize)
    input[1] = (asteroidY + asteroidSize / 2) / (canvas.height + asteroidSize)
    input[2] = asteroidAngle / Math.PI * 2//degToRad(360);
    input[3] = spaceshipAngle / Math.PI * 2//degToRad(360);
    // console.log("input " + input)
    return input;
}
 

// Basic Perlin noise function
export function perlin(x, y) {
    // Define the permutation table (you can use any random permutation)
    const permutation = [...Array(512)].map(() => Math.floor(Math.random() * 255));
    
    // Function to fade curves for smooth interpolation
    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // Function to lerp (linearly interpolate) between values
    function lerp(t, a, b) {
        return a + t * (b - a);
    }

    // Calculate the grid cell coordinates
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    // Calculate the relative coordinates within the cell
    x -= Math.floor(x);
    y -= Math.floor(y);

    // Calculate the fade curves
    const u = fade(x);
    const v = fade(y);

    // Hash coordinates of the 4 cube corners
    const A = permutation[X] + Y;
    const B = permutation[X + 1] + Y;
    const AA = permutation[A];
    const AB = permutation[A + 1];
    const BA = permutation[B];
    const BB = permutation[B + 1];

    // Blend the results from the 8 cube corners
    const result = lerp(v, lerp(u, grad(permutation[AA], x, y), grad(permutation[BA], x - 1, y)), lerp(u, grad(permutation[AB], x, y - 1), grad(permutation[BB], x - 1, y - 1)));

    return (result + 1) / 2; // Normalize to the range [0, 1]
}

// Helper function to calculate gradient vectors
function grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}
