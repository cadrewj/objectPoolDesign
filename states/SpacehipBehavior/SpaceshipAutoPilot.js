import { State, shipStates } from "../state.js"
import { NeuralNetwork } from "../../classes/neuralNetwork.js";
import { normaliseInput , angleToPoint, degToRad, randomNum} from "../../utilityFunctions/utilityFunctions.js";


export default class SpaceshipAutopilot extends State{
    constructor(game){
        super("SPACESHIP AUTOPILOT", game); // used to access and call method on object's parent. meaning everything in their constructor; 
        this.game = game;
        //neural network parameters
        this.numOfInputs = this.game.data.NN_NUM_INPUTS;
        this.numOfHidden = this.game.data.NN_NUM_HIDDEN; //note the high the more complicated processing it can do
        this.numOfOutputs = this.game.data.NN_NUM_OUTPUTS;
        this.numOfSamples = this.game.data.NN_NUM_SAMPLES;
        this.nn;
    }
    enter(){
        console.log("autopilot");
        
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
            sa = degToRad(randomNum(0,360)) //Math.random() * degToRad(360);
            // sx = this.game.spaceship.position.x; //only because didn't plan to move ship;
            // sy = this.game.spaceship.position.y;
            sx = this.game.spaceship.position.x //+ this.game.spaceship.radius * Math.cos(sa)
            sy = this.game.spaceship.position.y //+ this.game.spaceship.radius * Math.sin(sa)

            //calculate the angle to the asteroid
            let angle = angleToPoint(sx, sy, sa, ax, ay);

            //determine the direction to turn
            let direction = angle > degToRad(180) ? (this.game.data.NN_OUTPUT_LEFT) : (this.game.data.NN_OUTPUT_RIGHT); //meaning spaceship turn left or turn right

            //train the network
            this.nn.trainNetwork(normaliseInput(this.game.data.ASTEROID_SIZE, this.game.canvas, ax, ay, angle, sa),[direction])
            // console.log("trained")
        }  
           
    }
    handleInput(input, context, playerIsInSpace, automationOn){
        if(this.game.spaceship.exploding){
            this.game.spaceship.setState(shipStates.SPACESHIP_EXPLODING);
        }
       else if(automationOn && !this.game.spaceship.exploding){
            // console.log("handle called")
            this.makePrediction() 
            // console.log("done")
        }
        
        else if(!automationOn){
            this.game.spaceship.setState(shipStates.SPACESHIP_IDLE);
        } 
    }
    makePrediction(){
        //make a prediction based on current data
        let ax = this.game.asteroids.asteroids[0].position.x;
        let ay = this.game.asteroids.asteroids[0].position.y;

        let sa = this.game.spaceship.angle // - degToRad(90)
        let sx = this.game.spaceship.position.x //+ this.game.spaceship.radius * Math.cos(sa)
        let sy = this.game.spaceship.position.y //+ this.game.spaceship.radius * Math.sin(sa)
        let angle = angleToPoint(sx, sy, sa, ax, ay);

        let predict = this.nn.feedForward(normaliseInput(this.game.asteroids.asteroids[0].width, this.game.canvas, ax, ay, angle, sa)).data[0][0]
        console.log("predict: "+ predict)
        //make a turn
        let deltaLeft = Math.abs(predict - this.game.data.NN_OUTPUT_LEFT);
        let deltaRight = Math.abs(predict - this.game.data.NN_OUTPUT_RIGHT);

        //note: threshold is how close the prediction needs to be to commit to a turn
        if(deltaLeft < this.game.data.NN_OUTPUT_THRESHOLD){ 
            this.game.spaceship.rotateShip(false) // false equals left
    
        }
        else if (deltaRight < this.game.data.NN_OUTPUT_THRESHOLD){
            this.game.spaceship.rotateShip(true) // false equals left
        }
        else{
            //stop rotation 
            this.game.spaceship.rotation = 0;
            console.log("STOP: ")
        } 
        // this.shootLaser()
        
    }
    shootLaser(){
        for(let i = 0; i < this.game.spaceship.lasers.length; i++){
            const canShoot = this.game.spaceship.fuel > 0;
            this.game.spaceship.canShoot = canShoot;
            let laser = this.game.spaceship.lasers[i]
            if(canShoot && laser.free){
                let angle = this.game.spaceship.angle -  degToRad(90); //Math.PI / 2; // adjust for the image facing upwards
                 //the location you are shooting from is the nose of the ship
                laser = {
                    x: this.game.spaceship.position.x + this.game.spaceship.radius * Math.cos(angle), // from center of the ship draw a line
                    y: this.game.spaceship.position.y + this.game.spaceship.radius * Math.sin(angle),
                    velocity: {
                        x:this.game.data.SPACESHIP_LASER_SPEED * Math.cos(angle) / this.game.data.FPS,
                        y: this.game.data.SPACESHIP_LASER_SPEED * Math.sin(angle) / this.game.data.FPS,
                    },
                    dist: 0,
                    explodeTime: 0,
                    free: false
                }
                this.game.spaceship.lasers[i] = laser;
                return;
            }
        }     
    }
        
   
}





