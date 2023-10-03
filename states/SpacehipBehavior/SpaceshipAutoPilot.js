import { State, shipStates } from "../state.js"
import { NeuralNetwork } from "../../classes/neuralNetwork.js";
import { normaliseInput , angleToPoint, degToRad, randomNum, distanceBetweenPoints} from "../../utilityFunctions/utilityFunctions.js";

export default class SpaceshipAutopilot extends State{
    constructor(game){
        super("SPACESHIP AUTOPILOT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        //neural network parameters
        this.numOfInputs = this.game.data.NN_NUM_INPUTS;
        this.numOfHidden = this.game.data.NN_NUM_HIDDEN; //note the high the more complicated processing it can do
        this.numOfOutputs = this.game.data.NN_NUM_OUTPUTS;
        this.numOfSamples = this.game.data.NN_NUM_SAMPLES;
        this.nn = null;
        this.aiShootTime = 0;
        this.keyPressed = false;
    }
    enter(){
        // console.log("autopilot");
        this.game.spaceship.rotation = 0;
        
        //todo neural network
        this.nn = new NeuralNetwork(this.game.data, this.numOfInputs, this.numOfHidden, this.numOfOutputs)
        
        //train the network
        let ax, ay, sa, sx, sy;
        //automation is on 
        for(let i = 0; i < this.numOfSamples; i ++){
            // random asteroid location (include off-screen data)
            ax = Math.random() * (this.game.canvas.width + this.game.data.ASTEROID_SIZE) - this.game.data.ASTEROID_SIZE / 2;
            ay = Math.random() * (this.game.canvas.height + this.game.data.ASTEROID_SIZE) - this.game.data.ASTEROID_SIZE / 2;

            //ships angle and position
            sa = degToRad(randomNum(0, 360)) //Math.random() * degToRad(360);
             
            //only because didn't plan to move ship;
            sx = this.game.spaceship.position.x //+ this.game.spaceship.radius //* Math.cos(this.game.spaceship.angle - degToRad(90))
            sy = this.game.spaceship.position.y //+ this.game.spaceship.radius //* Math.sin(this.game.spaceship.angle - degToRad(90))

            //calculate the angle to the asteroid
            let asteroidAngle = angleToPoint(sx, sy, sa, ax, ay)// - degToRad(90);

            //determine the direction to turn
            let direction = asteroidAngle > Math.PI ? this.game.data.NN_OUTPUT_LEFT : this.game.data.NN_OUTPUT_RIGHT; //meaning spaceship turn left or turn right

            //train the network
            this.nn.trainNetwork(normaliseInput(this.game.data.ASTEROID_SIZE, this.game.canvas, ax, ay, asteroidAngle, sa),[direction])
        }       
    }
    handleInput(input, context, playerIsInSpace){
        if(this.game.spaceship.exploding){
            this.game.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
        }
       else if(this.game.spaceship.automationOn && !this.game.spaceship.exploding && this.game.spaceship.fuel > 0){
            if(this.game.asteroids.asteroids.length > 0){
                this.makePrediction() 
            } 
            else{
                this.game.spaceship.rotation = 0;
            }     
        }
        
        else if(!this.game.spaceship.automationOn){
            this.game.spaceship.setState(shipStates.SPACESHIP_IDLE);
        } 
    }
    // makePrediction(){
    //     if (!this.nn) {
    //         // Ensure the neural network is initialized
    //         return;
    //     }
    //     if (this.game.asteroids.asteroids.length === 0) {
    //         return; // No asteroids to target
    //     }
    //     //compute the closest asteroid
    //     let closestIndex = 0
    //     let closestDistance = distanceBetweenPoints(this.game.spaceship.position.x + this.game.spaceship.radius, 
    //         this.game.spaceship.position.y + this.game.spaceship.radius,
    //         this.game.asteroids.asteroids[0].position.x, 
    //         this.game.asteroids.asteroids[0].position.y
    //     );
        
    //     for(let i = 1; i < this.game.asteroids.asteroids.length; i++){
    //         let distance1 = distanceBetweenPoints(this.game.spaceship.position.x + this.game.spaceship.radius, 
    //             this.game.spaceship.position.y + this.game.spaceship.radius,
    //             this.game.asteroids.asteroids[i].position.x, 
    //             this.game.asteroids.asteroids[i].position.y
    //         );
    //         if(distance1 < closestDistance){
    //             closestDistance = distance1;
    //             closestIndex = i;

    //         }

    //     }
    //     //make a prediction based on current data
    //     let ax = this.game.asteroids.asteroids[closestIndex].position.x;
    //     let ay = this.game.asteroids.asteroids[closestIndex].position.y;
    //     let sa = this.game.spaceship.angle
    //     let sx = this.game.spaceship.position.x + this.game.spaceship.radius //* Math.cos(this.game.spaceship.angle - degToRad(90))
    //     let sy = this.game.spaceship.position.y + this.game.spaceship.radius //* Math.sin(this.game.spaceship.angle - degToRad(90))

    //     console.log("closest Asteroid " + ax +", " + ay)
    //     console.log("spaceship info " + sa +", " + sx + ", " + sy)
    //     //calculate the angle to the asteroid
    //     let asteroidAngle = angleToPoint(sx, sy, sa, ax, ay);
    //     const input = normaliseInput(this.game.data.ASTEROID_SIZE, this.game.canvas, ax, ay, asteroidAngle, sa)
      
    //     let predict = this.nn.feedForward(input).data[0][0]
    //     console.log("Predicted Rotation: " + predict);
    //     //make a turn
    //     // let deltaLeft = Math.abs(predict - this.game.data.NN_OUTPUT_LEFT);
    //     // let deltaRight = Math.abs(predict - this.game.data.NN_OUTPUT_RIGHT);

    //     //note: threshold is how close the prediction needs to be to commit to a turn
    //     if(predict < -this.game.data.NN_OUTPUT_THRESHOLD){ 
    //         this.game.spaceship.rotateShip(false) // false equals left
    //         console.log("Rotate Left");
    
    //     }
    //     else if (predict > this.game.data.NN_OUTPUT_THRESHOLD){
    //         this.game.spaceship.rotateShip(true) // false equals left
    //         console.log("Rotate Right");
    //     }
    //     else{
    //         //stop rotation 
    //         this.game.spaceship.rotation = 0;
    //         console.log("Stop Rotation");
    //           // Check if the spaceship's angle is close to the asteroid's angle
    //         const angleThreshold = 0.1; // Adjust this threshold as needed
    //         if (Math.abs(asteroidAngle - this.game.spaceship.angle) < angleThreshold) {
    //             // Align the spaceship's angle with the asteroid and fire
    //             this.game.spaceship.angle = asteroidAngle;
    //             this.aiFuelConsumption()
    //             this.game.spaceship.shootLaser()
                
    //             console.log("Aligned with Asteroid and Fired");
    //         }
            
    //     }     
    // }
    // makePrediction() {
    //     if (!this.nn) {
    //         // Ensure the neural network is initialized
    //         return;
    //     }
    //     if (this.game.asteroids.asteroids.length === 0) {
    //         return; // No asteroids to target
    //     }
        
    //     // Compute the closest asteroid
    //     let closestIndex = 0;
    //     let closestDistance = distanceBetweenPoints(
    //         this.game.spaceship.position.x + this.game.spaceship.radius,
    //         this.game.spaceship.position.y + this.game.spaceship.radius,
    //         this.game.asteroids.asteroids[0].position.x,
    //         this.game.asteroids.asteroids[0].position.y
    //     );
        
    //     for (let i = 1; i < this.game.asteroids.asteroids.length; i++) {
    //         let distance1 = distanceBetweenPoints(
    //             this.game.spaceship.position.x + this.game.spaceship.radius,
    //             this.game.spaceship.position.y + this.game.spaceship.radius,
    //             this.game.asteroids.asteroids[i].position.x,
    //             this.game.asteroids.asteroids[i].position.y
    //         );
    //         if (distance1 < closestDistance) {
    //             closestDistance = distance1;
    //             closestIndex = i;
    //         }
    //     }
    
    //     // Make a prediction based on current data
    //     let ax = this.game.asteroids.asteroids[closestIndex].position.x;
    //     let ay = this.game.asteroids.asteroids[closestIndex].position.y;
    //     let sa = this.game.spaceship.angle;
    //     let sx = this.game.spaceship.position.x + this.game.spaceship.radius;
    //     let sy = this.game.spaceship.position.y + this.game.spaceship.radius;
    
    //     // Calculate the angle to the asteroid
    //     let asteroidAngle = angleToPoint(sx, sy, sa, ax, ay);
    //     const input = normaliseInput(this.game.data.ASTEROID_SIZE, this.game.canvas, ax, ay, asteroidAngle, sa);
    
    //     let predict = this.nn.feedForward(input).data[0][0];
    
    //     // Adjust this threshold as needed
    //     const rotationThreshold = 0.99;
    
    //     if (predict < -rotationThreshold) {
    //         this.game.spaceship.rotateShip(false); // Rotate left
    //     } else if (predict > rotationThreshold) {
    //         this.game.spaceship.rotateShip(true); // Rotate right
    //     } else {
    //         // Stop rotation
    //         this.game.spaceship.rotation = 0;
    
    //         // Check if the spaceship's angle is close to the asteroid's angle
    //         const angleThreshold = 0.1; // Adjust this threshold as needed
    //         if (Math.abs(asteroidAngle - this.game.spaceship.angle) < angleThreshold) {
    //             // Align the spaceship's angle with the asteroid and fire
    //             this.game.spaceship.angle = asteroidAngle;
    //             this.aiFuelConsumption();
    //             this.game.spaceship.shootLaser();
    
    //             console.log("STOP");
    //         }
    //     }
    // }
    makePrediction() {
        if (!this.nn) {
            // Ensure the neural network is initialized
            return;
        }
        if (this.game.asteroids.asteroids.length === 0) {
            return; // No asteroids to target
        }
    
        // Compute the closest asteroid
        let closestIndex = 0;
        let closestDistance = distanceBetweenPoints(
            this.game.spaceship.position.x + this.game.spaceship.radius,
            this.game.spaceship.position.y + this.game.spaceship.radius,
            this.game.asteroids.asteroids[0].position.x,
            this.game.asteroids.asteroids[0].position.y
        );
    
        for (let i = 1; i < this.game.asteroids.asteroids.length; i++) {
            let distance1 = distanceBetweenPoints(
                this.game.spaceship.position.x + this.game.spaceship.radius,
                this.game.spaceship.position.y + this.game.spaceship.radius,
                this.game.asteroids.asteroids[i].position.x,
                this.game.asteroids.asteroids[i].position.y
            );
            if (distance1 < closestDistance) {
                closestDistance = distance1;
                closestIndex = i;
            }
        }
    
        // Make a prediction based on current data
        let ax = this.game.asteroids.asteroids[closestIndex].position.x;
        let ay = this.game.asteroids.asteroids[closestIndex].position.y;
        let sa = this.game.spaceship.angle;
        let sx = this.game.spaceship.position.x //+ this.game.spaceship.radius;
        let sy = this.game.spaceship.position.y //+ this.game.spaceship.radius;
    
        // Calculate the angle to the asteroid
        let asteroidAngle = (angleToPoint(sx, sy, sa, ax, ay) - degToRad(90));
        const input = normaliseInput(this.game.data.ASTEROID_SIZE, this.game.canvas, ax, ay, asteroidAngle, sa);
    
        let predict = this.nn.feedForward(input).data[0][0];
    
        // Adjust this threshold as needed
        const rotationThreshold = 0.99;
    
        if (predict < -rotationThreshold) {
            this.game.spaceship.rotateShip(false); // Rotate left
        } else if (predict > rotationThreshold) {
            this.game.spaceship.rotateShip(true); // Rotate right
        } else {
            // Stop rotation
            this.game.spaceship.rotation = 0;
    
            // Check if the spaceship's angle is close to the asteroid's angle
            const angleThreshold = 0.25; // Adjust this threshold as needed
            if (Math.abs(asteroidAngle - this.game.spaceship.angle) < angleThreshold) {
                // Align the spaceship's angle with the asteroid and fire
                this.game.spaceship.angle = asteroidAngle;
                this.aiFuelConsumption();
                this.game.spaceship.shootLaser();
    
                console.log("Aligned with Asteroid and Fired");
            }
        }
    }
    
  
    aiFuelConsumption(){
        if(this.aiShootTime > 0 && this.game.spaceship.fuel >  0){
            this.game.spaceship.canShoot = true;
            this.game.spaceship.fuelConsumption(this.game.spaceship.canShoot);
            this.game.spaceship.shots++
            this.aiShootTime--;
        }
        else{
            this.game.spaceship.canShoot = false; 
            this.game.spaceship.shots = 0;
            this.aiShootTime = Math.ceil(this.game.data.FPS / this.game.data.SPACESHIP_RATE_OF_FIRE)   
        }
    }
    autoThrustOrRevThrust(){
        //if distance bewteen ship and asteroid < safe range revthrust 
        //if distance between ship and asteroid > shooting range thrust
        //else stay still 

    }
    /*
    else if(input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_LEFT 
            || input.shipLastKey === this.game.data.gameKeys.SPACESHIP_PRESS_RIGHT){  
            this.game.spaceship.setState(shipStates.SPACESHIP_CHANGE_DIRECTION);
            */
    toggleAutopilot(input){
        //toggle in and out of the ship
    //     if(input.shipLastKey === this.game.data.gameKeys.){
    //         if (!this.keyPressed) {
    //             this.game.debug = !this.game.debug;
    //             this.keyPressed = true; // Mark the key as pressed
    //         }
            
    //     } else {
    //         // Reset the keyPressed flag when the key is released
    //         this.keyPressed = false;
    //     }

    }
}





