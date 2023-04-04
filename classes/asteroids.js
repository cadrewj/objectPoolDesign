import data from "../../data/data.json" assert { type: "json" }
import { degToRad, handleEdgeOfScreen, randomSign, testBoundsOfObject, distanceBetweenPoints, collision } from "../utilities/utilityFunctions.js";
// import { exploding, spaceship, spaceshipHealth} from "./spaceship.js";
import {Spaceship} from "./spaceship.js";
import { randomNum } from "../utilities/utilityFunctions.js";
import { createOxygenBall } from "./oxygenBall.js";
import {createFoods} from "./foodBall.js"
import { drawPhantomWave } from "./phantomWave.js";

const spaceship = Spaceship
const canvas = document.querySelector(".main");
const ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener("resize",()=>{
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
})

export let asteroids = [];



function createAsteroid(){
    
    let x, y;
    asteroids = [];
    for(let i = 0; i < data.ASTEROID_NUM; i++){
        do{
             x = Math.floor(Math.random() * width); 
             y = Math.floor(Math.random() * height);
            
             //used to ensure that no asteroid is place ontop of a ship
        }while(distanceBetweenPoints(spaceship.x, spaceship.y, x, y) < data.ASTEROID_SIZE * 2 + spaceship.radius) 
        asteroids.push(newAsteroid(x,y, Math.ceil(data.ASTEROID_SIZE / 2)))
    }
}
createAsteroid();

function newAsteroid(x,y, radius){

   const asteroid = {
        x: x,
        y: y,
        velocityX: Math.random() * data.ASTEROID_SPEED / data.FPS * randomSign(),
        velocityY: Math.random() * data.ASTEROID_SPEED / data.FPS * randomSign(),
        radius: radius, 
        direction: Math.random() * Math.PI /2,//degToRad(Math.random()),
        vertices: Math.floor(Math.random() * (data.ASTEROID_VERTICES + 1) + data.ASTEROID_VERTICES/2),
        offsets: [],
        destructionTime: 0,
        rewarding: {
            yes:false,
            x:0,
            y:0,
        }
       
    }
    //create the vertex offset array, (note: 0 = none, 1 = alot)
    for (let i = 0; i < asteroid.vertices; i++){
         asteroid.offsets.push(Math.random() * data.ASTEROID_JAG * 2 + 1 - data.ASTEROID_JAG) //give a number between  0.5 and 1.5
        // asteroid.offsets.push(Math.random() * randomNum(data.ASTEROID_JAG, data.ASTEROID_JAG * 2))//
    }
    return asteroid;
}

export function drawAsteroid(){
    for(let i = 0; i < asteroids.length; i++) {
        ctx.fillStyle = data.ASTEROID_COLOR;
        ctx.strokeStyle = data.ASTEROID_STROKE_COLOR;
        ctx.lineWidth = data.ASTEROID_LINEWIDTH;
        const x = asteroids[i].x;
        const y = asteroids[i].y;
        const radius = asteroids[i].radius;
        const direction = asteroids[i].direction;
        const vertices = asteroids[i].vertices;
        const offsets = asteroids[i].offsets;
       
        ctx.beginPath();
        //draw jagged asteroids
        ctx.moveTo(x + radius * offsets[0] * Math.cos(direction), 
        y + radius * offsets[0] * Math.sin(direction));
       
        for (let j = 1; j < vertices; j++) {
            ctx.lineTo(x + radius * offsets[j]* Math.cos(direction + j * degToRad(360) / vertices), 
            y + radius * offsets[j] * Math.sin(direction + j * degToRad(360) / vertices))
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill()

        // change direction of asteroid if collision occurs
        const roid1 = asteroids[i];
        if (asteroids.length > 1) { // make sure there is more than one asteroid
            for (let j = i + 1; j < asteroids.length; j++) {
              const roid2 = asteroids[j];
              const speed = data.ASTEROID_SPEED / data.FPS;
              const result = collision(roid1, roid2);
              if (result === true) {
                // Calculate angle of collision
                const angle = Math.atan2(roid2.y - roid1.y, roid2.x - roid1.x);

                // Update velocities of both particles
                // destroyAsteroid(j)
                roid1.velocityX = -speed * Math.cos(angle); // send object1 in the opposite direction
                roid1.velocityY = -speed * Math.sin(angle);
                roid2.velocityX = speed * Math.cos(angle); // send object2 in the opposite direction
                roid2.velocityY = speed * Math.sin(angle);
              }            
            }
          }
        //move the asteriod
        asteroids[i].x += asteroids[i].velocityX;
        asteroids[i].y += asteroids[i].velocityY;

        //reposition the asteroid on the screen if out of bounds
        handleEdgeOfScreen(asteroids[i])

         //used for testing to show the collision area of an asteroid
        testBoundsOfObject(asteroids[i].x,asteroids[i].y,asteroids[i].radius); 

        //used to check if two objects collide (e.g: the spaceship collide with the asteroid, then call a function to reduce the damage to the ship)
        if(!exploding){
            if(spaceship.blinkNum == 0){ //handle collisions if ship isn't blinking
                let damage = 0;

                for (let i = 0; i < asteroids.length; i++){
                    if(distanceBetweenPoints(spaceship.x, spaceship.y, asteroids[i].x, asteroids[i].y) < spaceship.radius + asteroids[i].radius){
                        if(asteroids[i].radius === Math.ceil(data.ASTEROID_SIZE /2)){
                            damage = data.ASTEROID_DAMAGE_IMPACT;
                            // console.log("original: ",damage);
                        }
                        else if(asteroids[i].radius === Math.ceil(data.ASTEROID_SIZE /4)){
                            damage = data.ASTEROID_DAMAGE_IMPACT /2;
                            // console.log("half: ",damage);
                        }
                        else if(asteroids[i].radius === Math.ceil(data.ASTEROID_SIZE /8)) {
                            damage = data.ASTEROID_DAMAGE_IMPACT/4
                            // console.log("quater: ",damage);
                        }
                        else{
                            damage = data.ASTEROID_DAMAGE_IMPACT/8
                            // console.log("quater: ",damage);
                        }
                        spaceship.explodeTime = Math.ceil(data.SPACESHIP_EXPLODING_DUR * data.FPS);
                        spaceshipHealth(damage)
                        destroyAsteroid(i)

                        break;
                    
                    }
                }         
            }
        } 
    }   
}


export function hitAsteroid(){ 
    let ax, ay, ar, lx, ly;
    for (let i = 0; i < asteroids.length; i++){
        //grab asteroid properties
        ax = asteroids[i].x;
        ay = asteroids[i].y;
        ar = asteroids[i].radius;

        for(let j = 0; j < spaceship.lasers.length; j++){
            //grab laser properties
            lx = spaceship.lasers[j].x;
            ly = spaceship.lasers[j].y;
             //detect hit
            if(spaceship.lasers[j].explodeTime === 0 && distanceBetweenPoints(ax,ay, lx,ly) < ar){
                
                // remove asteroid
                destroyAsteroid(i)

                spaceship.lasers[j].explodeTime = Math.ceil(data.SPACESHIP_LASER_EXPLODE_DUR * data.FPS);
                
                //create a function to give a random reward 
                break;
            } 

        }
    }  
}

export function destroyAsteroid(index){


    
    let x = asteroids[index].x
    let y = asteroids[index].y
    let radius = asteroids[index].radius;

    //split asteroids in two
    if (radius === Math.ceil(data.ASTEROID_SIZE/2)){ // if original size split
        asteroids.push(newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 4)));  // new asteroid one
        asteroids.push(newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 4)));  // new asteroid two
        // rewarding.yes = false;

    }
    else if (radius === Math.ceil(data.ASTEROID_SIZE / 4)){ // if medium size split
        asteroids.push(newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 8)));  // new asteroid one
        asteroids.push(newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 8)));  // new asteroid two
        asteroids.push(newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 8)));  // new asteroid three
     

    }
    else if (radius === Math.ceil(data.ASTEROID_SIZE / 8)){ // if medium size split
        asteroids.push(newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 12)));  // new asteroid one
        asteroids.push(newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 12)));  // new asteroid two
        // rewarding.yes = false;
        asteroids[index].rewarding.yes = true;
        selectReward(x,y,index);
    }
      
    asteroids.splice(index,1);
}

let positionX; let positionY;

const rewardArray = [];
rewardArray.length = 3//randomNum(0,  3);
let rewardOptions = 
[ 
    ()=>{
    // console.log(positionX,positionY, "create food")
    return createFoods(positionX,positionY)
    },
    ()=>{
        // console.log(positionX,positionY, "oxygenBall")
       return createOxygenBall(positionX,positionY)
    },
    ()=>{
        // console.log(positionX,positionY, "oxygenBall2")
       return drawOxygenBall2(positionX,positionY)
    },
    ()=>{
        // console.log(positionX,positionY, "drawPhantomWave")
        return drawPhantomWave(positionX,positionY,100, 80, '#7e04a7')
    }
]
    //[(x, y)=>drawOxygenBall(x,y), (x, y)=>drawOxygenBall2(x,y), (positionX, positionY)=>{createFoods(positionX,positionY)
    // console.log("called create"), (x, y)=>drawPhantomWave(x,y,100, 80, '#7e04a7')]

function createReward(){
    // console.log("called create Reward")
    if(rewardArray){
        // console.log("called")
        for(let i = 0; i<rewardArray.length;i++){
            if(rewardArray[i]){
                // console.log("not empty has a value: ",rewardArray[i])
                continue;
            }
            else{
                rewardArray[i]=rewardOptions[i];
                // console.log("empty adding a value: ",rewardOptions[i], "to", rewardArray[i])
            }
        }
    }
}
createReward()

// console.log(" Reward Array", rewardArray);
export function selectReward(x,y,i){
    // console.log("finding reward")
    if(asteroids[i].rewarding.yes === true){
        // console.log("rewarding info", x, y,i)
        let randomIndex = randomNum(0, rewardArray.length)
        
        
        // rewards position of the new reward (x,y);
        positionX = x; // x axis where the asteroid was destroyed
        positionY = y;// y axis where the asteroid was destroyed
        // rewardArray[randomIndex]()
        rewardArray[0](); // reward the player with an item from reward array eg.: food.
        // console.log("reward id: ",randomIndex, positionX, positionY)


    }
}