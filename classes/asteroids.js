import { distanceBetweenPoints, randomSign,randomRGB, degToRad, calculateProbability, handleEdgeOfScreen, collideBounceOff, randomNum, perlin} from "../utilityFunctions/utilityFunctions.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "../userInterface/gameUserInterface.js";
import { SelectReward } from "./reward.js";

 // Define an array of colors
//  const ASTEROIDCOLORS = ["#FF5733", "#FFD733", "#33FF57", "#334DFF", "#FF33E1"];
   // Assign a color based on the asteroid's index (you can use a different criteria if you prefer)
            // const colorIndex = i % ASTEROIDCOLORS.length;
            // context.fillStyle = ASTEROIDCOLORS[colorIndex];
export class Asteroid {
    constructor(game){
        this.game = game;
        this.image = document.querySelector("#Desert");
        this.collisionDamage = 0;
        this.maxAsteroids = 5;
        this.timer = 0;
        this.asteroids = [];
        this.timeInterval = 100000 / this.game.data.FPS;
        this.init();
    }
    init() {
        // Initialize asteroid shapes
        this.asteroids = [];
        let x, y;
        for (let i = 0; i < this.game.data.ASTEROID_NUM; i++) {
            do{
                 x = Math.floor(Math.random() * this.game.width); 
                 y = Math.floor(Math.random() * this.game.height);
                //used to ensure that no asteroid is place ontop of a ship
            }while(distanceBetweenPoints(this.game.spaceship.position.x, this.game.spaceship.position.y, x, y) < this.game.data.ASTEROID_SIZE * 2 + this.game.spaceship.radius) 
            const radius = Math.random() * (this.game.data.ASTEROID_MAX_RADIUS - this.game.data.ASTEROID_MIN_RADIUS) + this.game.data.ASTEROID_MIN_RADIUS;
            this.newAsteroid(x, y, radius)
        }
    }
    draw(context) {
        context.strokeStyle = this.game.data.ASTEROID_STROKE_COLOR;
        context.lineWidth = this.game.data.ASTEROID_LINEWIDTH;

        const pattern = context.createPattern(this.image, "repeat");
        context.fillStyle = pattern
        for (let i = 0; i < this.asteroids.length; i++) {
            const asteroid = this.asteroids[i];
            const x = asteroid.position.x;
            const y = asteroid.position.y;
            const vertices = asteroid.vertices;
            const offsets = asteroid.offsets;

            context.beginPath();
            for (let j = 0; j < vertices; j++) {
                const angle = (j / vertices) * 2 * Math.PI;
                const xOffset = offsets[j] * Math.cos(angle);
                const yOffset = offsets[j] * Math.sin(angle);
                context.lineTo(x + xOffset, y + yOffset);
            }
            context.closePath();
            context.fill();
            context.stroke();
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
                const asteriod = this.asteroids[i]; //for bounce off effect
    
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
                //create a collide bounce off effect
                if (this.asteroids.length > 1) {
                    for (let j = i + 1; j < this.asteroids.length; j++) {  
                        const otherAsteroid = this.asteroids[j];
                        const speed = Math.random() * 0.01 + 1;
                        const result = collideBounceOff(asteriod, otherAsteroid, speed)
                        if(result){
                            asteriod.velocity = result[0];
                            otherAsteroid.velocity = result[1]
                        }
                    }
                } 
            }
        } 
    }
    newAsteroid(x, y, radius){
        const vertices = randomNum(this.game.data.ASTEROID_VERTICES_MIN, this.game.data.ASTEROID_VERTICES_MAX); // Number of vertices for the asteroid
        const offsets = [];
        
        for (let j = 0; j < vertices; j++) {
            const angle = (j / vertices) * 2 * Math.PI;
            const noiseValue = perlin(Math.cos(angle), Math.sin(angle)); // Use 2D Perlin noise
            const offset = radius + radius * noiseValue * 0.4; // Adjust the noise multiplier for irregularity
            offsets.push(offset);

        }
        this.asteroids.push({
            position: { x, y },
            radius,
            vertices,
            offsets,
            velocity:{
                x: (Math.random() * this.game.data.ASTEROID_SPEED / this.game.data.FPS) * randomSign(),
                y: (Math.random() * this.game.data.ASTEROID_SPEED / this.game.data.FPS) * randomSign(),
            },
            width: radius * 2,
            height: radius * 2,
            // direction: Math.random() * Math.PI /2,//degToRad(Math.random()),
            destructionTime: 0,
            hasReward: calculateProbability(0.1),
            free: false
                
        });
    }
    
    start(){ /// used to create a new asteroid after the time interval has passed and the asteroid array is empty
        if(this.asteroids.length <= 0){
            for (let i = 0; i < this.game.data.ASTEROID_NUM; i++) {
                let x, y;
                const direction = Math.floor(Math.random() * 3); // Randomly select a direction (0, 1, 2, or 3)
                
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
                this.newAsteroid(x, y, Math.ceil(this.game.data.ASTEROID_SIZE * Math.random()));
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
                    if(asteroids.radius >= Math.ceil(data.ASTEROID_SIZE /2)){ //asign damage based on asteroid size
                        damage = data.ASTEROID_DAMAGE_IMPACT;
                        // console.log("original: ",damage);
                    }
                    else if(asteroids.radius >= Math.ceil(data.ASTEROID_SIZE /4)){
                        damage = data.ASTEROID_DAMAGE_IMPACT /2;
                        // console.log("half: ",damage);
                    }
                    else if(asteroids.radius >= Math.ceil(data.ASTEROID_SIZE /8)) {
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
        if (radius >= Math.ceil(data.ASTEROID_SIZE/2)){ // if original size split
            this.newAsteroid(x,y, Math.ceil(data.ASTEROID_SIZE / randomNum(2,4)));  // new asteroid one
            this.newAsteroid(x,y, Math.ceil(data.ASTEROID_SIZE / randomNum(2,4)));  // new asteroid two
        }
        else if (radius >= Math.ceil(data.ASTEROID_SIZE / 4)){ // if medium size split
            this.newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / randomNum(4,8)));  // new asteroid one
            this.newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / randomNum(4,8)));  // new asteroid two
            this.newAsteroid(x,y,Math.ceil(data.ASTEROID_SIZE / randomNum(4,8)));  // new asteroid three
        }
        if(this.asteroids[index].hasReward){
            //create a function to give a random reward 
            const reward = new SelectReward(this.game, x, y);
            console.log("has reward")
        }
        this.asteroids[index].free = true;
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.free);
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
                    if(!spaceship.lasers[j].free){
                        //grab laser properties
                        lx = spaceship.lasers[j].x;
                        ly = spaceship.lasers[j].y;
                        //detect hit
                        if(spaceship.lasers[j].explodeTime === 0 && distanceBetweenPoints(ax, ay, lx,ly) < ar){ 
                            // remove asteroid
                            this.destroyAsteroid(i, this.game.data)
                            this.game.floatingMessage.push(new FloatingMessage(this.game, "+1", ax, ay, this.game.width/2, 40))
                            //increase game score if destroy asteroid
                            this.game.score++; 
                            spaceship.lasers[j].explodeTime = Math.ceil(this.game.data.SPACESHIP_LASER_EXPLODE_DUR * this.game.data.FPS); //reset the explotime time 
                            break;
                        } 
                    }
                }
            }  
        }  
    }
    resize(width, height){ // used to resize the effect when the window size changes
        this.game.width = width;
        this.game.height = height;
        this.init()
    }
}