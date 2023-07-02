import { FloatingMessage } from "../userInterface/gameUserInterface.js";
import { distanceBetweenPoints, randomSign, degToRad, probability, handleEdgeOfScreen} from "../utilityFunctions/utilityFunctions.js";
import { CollisionAnimation } from "./collisionAnimation.js";
export class Asteroid{
    constructor(game){
        this.game = game;
        this.asteroids;
        this.collisionDamage = 0;
        this.maxAsteroids = 5;
        this.timer = 0;
        this.timeInterval = 100000/this.game.data.FPS;
        this.initAsteroids()
    }
    initAsteroids(){
        let x, y;
        this.asteroids = [];
        for(let i = 0; i < this.game.data.ASTEROID_NUM; i++){
            do{
                 x = Math.floor(Math.random() * this.game.width); 
                 y = Math.floor(Math.random() * this.game.height);
                 //used to ensure that no asteroid is place ontop of a ship
            }while(distanceBetweenPoints(this.game.spaceship.position.x, this.game.spaceship.position.y, x, y) < this.game.data.ASTEROID_SIZE * 2 + this.game.spaceship.ship.radius) 
            this.asteroids.push(this.newAsteroid(x,y, Math.ceil(this.game.data.ASTEROID_SIZE / 2)))
        }
    }
    newAsteroid(x,y, radius){
    const asteroid = {
        position:{
            x: x,
            y: y,
        },
        velocity:{
            x: Math.random() * this.game.data.ASTEROID_SPEED / this.game.data.FPS * randomSign(),
            y: Math.random() * this.game.data.ASTEROID_SPEED / this.game.data.FPS * randomSign(),
        },
        radius: radius, 
        direction: Math.random() * Math.PI /2,//degToRad(Math.random()),
        vertices: Math.floor(Math.random() * (this.game.data.ASTEROID_VERTICES + 1) + this.game.data.ASTEROID_VERTICES/2),
        offsets: [],
        destructionTime: 0,
        hasReward: probability(0.2),
        free: false
        }
        //create the vertex offset array, (note: 0 = none, 1 = alot)
        for (let i = 0; i < asteroid.vertices; i++){
            asteroid.offsets.push(Math.random() * this.game.data.ASTEROID_JAG * 2 + 1 - this.game.data.ASTEROID_JAG) //give a number between  0.5 and 1.5
            // asteroid.offsets.push(Math.random() * randomNum(this.game.data.ASTEROID_JAG, this.game.data.ASTEROID_JAG * 2))//
        }
        return asteroid;
    }
    draw(context){
        context.fillStyle = this.game.data.ASTEROID_COLOR;
        context.strokeStyle = this.game.data.ASTEROID_STROKE_COLOR;
        context.lineWidth = this.game.data.ASTEROID_LINEWIDTH;

        for(let i = 0; i < this.asteroids.length; i++) {
            if(!this.asteroids[i].free){
                const x = this.asteroids[i].position.x;
                const y = this.asteroids[i].position.y;
                const radius = this.asteroids[i].radius;
                const direction = this.asteroids[i].direction;
                const vertices = this.asteroids[i].vertices;
                const offsets = this.asteroids[i].offsets;
            
                context.beginPath();
                //draw jagged asteroids
                context.moveTo(x + radius * offsets[0] * Math.cos(direction), 
                y + radius * offsets[0] * Math.sin(direction));
                for (let j = 1; j < vertices; j++) {
                    context.lineTo(x + radius * offsets[j]* Math.cos(direction + j * degToRad(360) / vertices), 
                    y + radius * offsets[j] * Math.sin(direction + j * degToRad(360) / vertices))
                }
                context.closePath();
                context.stroke();
                context.fill()
            } 
        }
    }
    update(spaceship){
        if(this.timer > this.timeInterval){ // animate player sprite //used to slow down the speed of the animation between frames
            // console.log("start")
            this.start();
            this.timer = 0;
        }
        else{
            this.timer ++;
        }
        //used to limit laser check for only when their is an asteriod and when the ship has fuel or canShoot
        if(spaceship.canShoot && this.asteroids.length > 0){//to avoid unnecessary checks for collision
            this.laserHitAsteroid(spaceship);
        }
            
        //move the asteriods
        for(let i = 0; i < this.asteroids.length; i++){
            if(!this.asteroids[i].free){
                this.asteroids[i].position.x += this.asteroids[i].velocity.x;
                this.asteroids[i].position.y += this.asteroids[i].velocity.y;
    
                //reposition the asteroid on the screen if out of bounds
                handleEdgeOfScreen(this.asteroids[i], this.game.width, this.game.height)

                //check for collision with ship and asteroid
                if(spaceship.health > 0){
                    this.collisionDamage = this.handleAsteroidCollision(spaceship, this.asteroids[i], this.game.data, i);
                    if(this.collisionDamage){
                        spaceship.health += this.collisionDamage;
                        this.collisionDamage = 0;
                    }
                } 
            }
        } 
    }
    start(){ /// used to create a new asteroid after the time interval has passed and the asteroid array is empty
        if(this.asteroids.length <= 0){
            for (let i = 0; i < this.game.data.ASTEROID_NUM; i++) {
                let x, y;
                const direction = Math.floor(Math.random() * 4); // Randomly select a direction (0, 1, 2, or 3)
                
                switch (direction) { //make the asteroid pop up in a random direction offscreen
                  case 0: // Top of the screen
                    x = Math.floor(Math.random() * this.game.width);
                    y = -this.game.data.ASTEROID_SIZE;
                    break;
                  case 1: // Right side of the screen
                    x = this.game.width + this.game.data.ASTEROID_SIZE;
                    y = Math.floor(Math.random() * this.game.height);
                    break;
                  case 2: // Bottom of the screen
                    x = Math.floor(Math.random() * this.game.width);
                    y = this.game.height + this.game.data.ASTEROID_SIZE;
                    break;
                  case 3: // Left side of the screen
                    x = -this.game.data.ASTEROID_SIZE;
                    y = Math.floor(Math.random() * this.game.height);
                    break;
                }
                this.asteroids.push(this.newAsteroid(x, y, Math.ceil(this.game.data.ASTEROID_SIZE / 2)));
            }     
        }  
    }
    handleAsteroidCollision(spaceship, asteroids, data, index){
         //used to check if two objects collide (e.g: the spaceship collide with the asteroid, then call a function to reduce the damage to the ship)
         if(!spaceship.exploding){
            if(spaceship.blinkNum == 0){ //handle collisions if ship isn't blinking
                let damage = 0;
                if(distanceBetweenPoints(spaceship.position.x, spaceship.position.y, asteroids.position.x, asteroids.position.y) 
                    < spaceship.hitCircle.radius + asteroids.radius){
                        this.game.collisions.push(new CollisionAnimation(this.game, this.asteroids[index].position, this.asteroids[index].radius * 2, this.asteroids[index].radius * 2))
                    if(asteroids.radius === Math.ceil(data.ASTEROID_SIZE /2)){ //asign damage based on asteroid size
                        damage = data.ASTEROID_DAMAGE_IMPACT;
                        // console.log("original: ",damage);
                    }
                    else if(asteroids.radius === Math.ceil(data.ASTEROID_SIZE /4)){
                        damage = data.ASTEROID_DAMAGE_IMPACT /2;
                        // console.log("half: ",damage);
                    }
                    else if(asteroids.radius === Math.ceil(data.ASTEROID_SIZE /8)) {
                        damage = data.ASTEROID_DAMAGE_IMPACT/4
                        // console.log("quater: ",damage);
                    }
                    else{
                        damage = data.ASTEROID_DAMAGE_IMPACT/8
                        // console.log("eight: ",damage);
                    }
                    
                    this.destroyAsteroid(index, data)
                    return damage;
                }      
            }
        }
    }
    ///need to convert to object model using free///////////////////////////
    destroyAsteroid(index, data){
        let x = this.asteroids[index].position.x
        let y = this.asteroids[index].position.y
        let radius = this.asteroids[index].radius;
        //split asteroids in two
        if (radius === Math.ceil(data.ASTEROID_SIZE/2)){ // if original size split
            this.asteroids.push(this.newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 4)));  // new asteroid one
            this.asteroids.push(this.newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 4)));  // new asteroid two
        }
        else if (radius === Math.ceil(data.ASTEROID_SIZE / 4)){ // if medium size split
            this.asteroids.push(this.newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 8)));  // new asteroid one
            this.asteroids.push(this.newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 8)));  // new asteroid two
            this.asteroids.push(this.newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / 8)));  // new asteroid three
        }
        if(this.asteroids[index].hasReward){
            console.log("rewarding")
            // selectReward(x,y,index);
        }
        this.asteroids[index].free = true;
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.free);

        // console.log(this.asteroids)
    }

    laserHitAsteroid(spaceship){ 
        let ax, ay, ar, lx, ly;
        // console.log(this.asteroids)
        for (let i = 0; i < this.asteroids.length; i++){
            if(!this.asteroids[i].free){
                //grab asteroid properties
                ax = this.asteroids[i].position.x;
                ay = this.asteroids[i].position.y;
                ar = this.asteroids[i].radius;

                for(let j = 0; j < spaceship.lasers.length; j++){
                    //grab laser properties
                    lx = spaceship.lasers[j].x;
                    ly = spaceship.lasers[j].y;
                    // console.log("laser info: ", lx, ly)
                    //detect hit
                    if(spaceship.lasers[j].explodeTime === 0 && distanceBetweenPoints(ax, ay, lx,ly) < ar){ 
                        // remove asteroid
                        this.destroyAsteroid(i, this.game.data)
                        this.game.floatingMessage.push(new FloatingMessage(this.game, "+1", ax, ay, this.game.width/2, 0))
                        //increase game score if destroy asteroid
                        this.game.score++; 

                        spaceship.lasers[j].explodeTime = Math.ceil(this.game.data.SPACESHIP_LASER_EXPLODE_DUR * this.game.data.FPS); //reset the explotime time 
                        
                        //create a function to give a random reward 
                        break;
                    } 
                }
            }
           
        }  
    }
}