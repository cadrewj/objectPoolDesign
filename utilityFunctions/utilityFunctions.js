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
    const sign = dist <= value ? (true) : (false);
    return sign
}
export function collisionBlockDectection(player, enemy){
    return (
           enemy.position.x <= player.position.x + player.hitCircle.width 
                && enemy.position.x + enemy.width >= player.position.x
                &&  enemy.position.y <= player.position.y + player.hitCircle.height 
                && enemy.position.y + enemy.height >= player.position.y
        );

}
// object1.position.y + object1.height  > object2.position.y && 
// object1.position.y < object2.position.y + object2.height &&
// object1.position.x < object2.position.x + object2.width &&
// object1.position.x + object1.width  > object2.position.x  

// enemy.position.x < this.position.x + this.hitCircle.width 
//                 && enemy.position.x + enemy.enemy.width > this.position.x
//                 &&  enemy.position.y < this.position.y + this.hitCircle.height 
//                 && enemy.position.y + enemy.enemy.height > this.position.y

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
export function probability(decimal){
    const result =  Math.random() < decimal ?(true): (false);
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

export function createPool(arrayPool, maxNumElements, objectClass, width, height, data){
//    console.log(typeof(objectClass))
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


