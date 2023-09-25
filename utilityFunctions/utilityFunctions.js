// convert to radians
export function degToRad(degree){
    const result = degree / 180 * Math.PI
    return result;
}

export function distanceBetweenPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

}
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
    // console.log(result)
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

export function createPool(arrayPool, maxNumElements, objectClass, game){
//    console.log(typeof(objectClass))
   if(Array.isArray(objectClass)) {
        const numOfTypes = objectClass.length
        
        for(let i = 0; i < maxNumElements; i++){
            const num = randomNum(0, numOfTypes-1)
            const info = objectClass[num];
            arrayPool.push(new info(game)); //this is used to pass the entire game class to the array of classes
        } 
    }
    else if( typeof(objectClass) === "function"){
        for(let i = 0; i < maxNumElements; i++){
            arrayPool.push(new objectClass(game)); //this is used to pass the entire game class to the Meteor class
        } 
    }
    else{
        // console.log("error in the createPool function of utilities",arrayPool)
    } 
} 

export function getElement(arrayPool){
    for(let i =0; i < arrayPool.length; i++){
        if(arrayPool[i].free){
            return arrayPool[i]; //return the free object
        }
    }
}

export function periodicInterval(timer, interval, deltaTime, arrayPool, context, gameFrames){
    //create element periodically
    if(timer > interval){
       //add a new element to be rendered from the pool
       const pool = getElement(arrayPool);
       if(pool){ // if it return a free element then call start
           pool.start()
       }
       //reset the timer
       timer = 0;
    }
    else{
       timer += deltaTime; // increase the value of the timer 
    }
    arrayPool.forEach(p => {
       p.update(context, gameFrames)
    });
    return timer;
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
    return (diff + degToRad(360)) % (degToRad(360))//thus convert and find remainer. making result between 0 & 360 degrees
}
export function normaliseInput(asteroidSize, canvas ,asteroidX, asteroidY, asteroidAngle, spaceshipAngle){
    //normalise the values between 0 and 1
    let input = [];
    input[0] = (asteroidX + asteroidSize / 2) / (canvas.width + asteroidSize)
    input[1] = (asteroidY + asteroidSize / 2) / (canvas.height + asteroidSize)
    input[2] = asteroidAngle / degToRad(360);
    input[3] = spaceshipAngle / degToRad(360);
    return input;
}
 

