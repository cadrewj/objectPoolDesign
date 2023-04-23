// convert to radians
export function degToRad(degree){
    const result = degree / 180 * Math.PI
    return result;
}

export function distanceBetweenPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

}
export function collision(object1, object2){
    const dist = distanceBetweenPoints(object1.x, object1.y, object2.x, object2.y)  
    const value = object1.radius + object2.radius;
    const sign = dist <= value ? (true) : (false);
    return sign
}

export function handleEdgeOfScreen(movingObject, width, height){
    //x axis bounds
    if(movingObject.x < 0 - movingObject.radius){  //if the object's x position is less than 0 - the size of the object meaning it of the screen (right)
        movingObject.x = movingObject.radius + width; //then place it at the left of the screen
    }
    else if(movingObject.x > width + movingObject.radius){
        movingObject.x = 0 - movingObject.radius //opposite of the above
    }
// y axis bounds
    if(movingObject.y < 0 - movingObject.radius){ //if the object's y position is less than 0 - the size of the object meaning it of the screen (top)
        movingObject.y = movingObject.radius + height; //then place it at the bottom of the screen
    }
    else if(movingObject.y > height + movingObject.radius){
        movingObject.y = 0 - movingObject.radius //opposite of the above
    }

}
 //function used to return negative or positive sign (e.g: -1 or +1)
 export function randomSign(){
    const result =  Math.random() >= 0.5 ?(1): (-1);
    // console.log(result)
    return result

}
// function to generate random number
export function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomRGB() {
    return  `rgba(${randomNum(0, 255)},${randomNum(0, 255)},${randomNum(0, 255)})`;
}

export function testBoundsOfObject(x,y,radius, data, context, isCircle=true, width=0, height = 0){

    if(data.SHOW_BOUNDING && isCircle){
        context.strokeStyle = "lime";
        context.beginPath();
        context.arc(x, y,radius, 0, degToRad(360), false) // to draw a circle around ship to test for collision
        context.stroke();
    }
    else if(data.SHOW_BOUNDING && !isCircle){
        context.strokeStyle = "lime";
        context.beginPath();
        context.strokeRect(x, y, width, height) // to draw a circle around ship to test for collision
        // context.stroke();
    }
}

export function drawStatusText(context, width, height, data, gameOver){
    // context.font = "10px Helvetica";
    // context.fillStyle = "green"
    // context.fillText("Last input: " + input.lastKey, 10, 20);
    if(gameOver){
        context.beginPath()
        context.font = `${data.FONT_DISPLAY_TEXT_SIZE} ${data.FONT_DISPLAY_TEXT}`;
        context.fillStyle = "white"
        context.textAlign= "center"
        context.fillText("Game Over", width/2, height/2)
        context.beginPath()
        context.font = `${data.FONT_DISPLAY_SUBTEXT_SIZE} ${data.FONT_DISPLAY_SUBTEXT}`;
        context.fillStyle = "white"
        context.textAlign = "center"
        context.fillText("Try Again", width/2 , height/2 + data.FONT_DISPLAY_SUBTEXT_SIZE)

    }
}

export function createPool(arrayPool, maxNumElements, objectClass, width, height, data){
   console.log(typeof(objectClass))
   if(Array.isArray(objectClass)) {
        const numOfTypes = objectClass.length
        
        for(let i = 0; i < maxNumElements; i++){
            const num = randomNum(0, numOfTypes-1)
            const info = objectClass[num];
            arrayPool.push(new info(width, height, data)); //this is used to pass the entire game class to the array of classes
        } 
    }
    else if( typeof(objectClass) === "function"){
        for(let i = 0; i < maxNumElements; i++){
            arrayPool.push(new objectClass(width, height, data)); //this is used to pass the entire game class to the Meteor class
        } 
    }
    else{
        console.log("error in the createPool function of utilities",arrayPool)
    }
    
  
} 

export function getElement(arrayPool){
    for(let i =0; i < arrayPool.length; i++){
        if(arrayPool[i].free){
            return arrayPool[i]; //return the free object
        }
    }
}
export function bounceOff(object1, object2){
    const result = collision(object1, object2)
    if (result === true) {
        console.log("crashed")
        const speed = 4
        // Calculate angle of collision
        const angle = Math.atan2(object1.y - object1.y, object2.x - object2.x);
        
        // Update velocities of both particles
        object1.velocity.x = -speed * Math.cos(angle); // send object1 in the opposite direction
        object1.velocity.y = -speed * Math.sin(angle);
        object2.velocity.x = speed * Math.cos(angle); // send object2 in the opposite direction
        object2.velocity.y = speed * Math.sin(angle);
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


