import {Player_Standing_Left, Player_Standing_Right } from "../states/PlayerBehavior/PlayerStanding.js";
import {Player_Running_Left, Player_Running_Right} from "../states/PlayerBehavior/PlayerRunning.js";
import {Player_Jumping_Left, Player_Jumping_Right} from "../states/PlayerBehavior/PlayerJumping.js";
import {Player_Falling_Left, Player_Falling_Right} from "../states/PlayerBehavior/PlayerFalling.js";
import {Player_Sheild_Left, Player_Sheild_Right} from "../states/PlayerBehavior/PlayerSheild.js";
import {Player_Shell_Smash_Left, Player_Shell_Smash_Right} from "../states/PlayerBehavior/PlayerShellSmash.js";
import { Player_Collision_Behavior_Left, Player_Collision_Behavior_Right } from "../states/PlayerBehavior/PlayerCollisionBehavior.js";
import { Player_Spacewalk_Left, Player_Spacewalk_Right, Player_Spacewalk_Up, Player_Spacewalk_Down } from "../states/PlayerBehavior/PlayerSpaceWalk.js";
import { Player_Spacewalk_Standing_Left, Player_Spacewalk_Standing_Right, Player_Spacewalk_Standing_Up, Player_Spacewalk_Standing_Down } from "../states/PlayerBehavior/PlayerSpaceStanding.js";

import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "../userInterface/gameUserInterface.js";
import { collisionBlockDectection, collisionCircleDetection } from "../utilityFunctions/utilityFunctions.js";

class Player{
    constructor(game){
        this.game = game;
       
        this.frame = {
            x: 0,
            y: 0,
        }
        this.width = this.game.data.PLAYER_SIZE;
        this.height = this.game.data.PLAYER_SIZE;
        this.image = document.getElementById("player");
        this.sw = 200;
        this.sh = 181.83;

        this.health = this.game.data.PLAYER_MAX_HEALTH;
        this.lives = this.game.data.PLAYER_LIVES;
        this.maxFrames = 6; //set initial max to six cuz the default image is 6 frames long

        this.isOnPlanet = true;
        this.isInSpace = false;
        
        this.FPS = this.game.data.FPS;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.FPS;
        this.oxygenLevel = 6000//this.game.data.PLAYER_OXYGEN_LEVEL;

        this.hurt = false;
        this.hurtTime = 0;
        
        this.states = [
            new Player_Standing_Left(this.game),  //state 0
            new Player_Standing_Right(this.game), //state 1
            new Player_Sheild_Left(this.game), //state 2
            new Player_Sheild_Right(this.game),//state 3
            new Player_Running_Left(this.game),  //state 4
            new Player_Running_Right(this.game), // state 5
            new Player_Jumping_Left(this.game), // state 6
            new Player_Jumping_Right(this.game), // state 7
            new Player_Falling_Left(this.game), // state 8
            new Player_Falling_Right(this.game), //state 9
            new Player_Shell_Smash_Left(this.game), //state 10
            new Player_Shell_Smash_Right(this.game),//state 11
            new Player_Collision_Behavior_Left(this.game), //state 12
            new Player_Collision_Behavior_Right(this.game), //state 13
            new Player_Spacewalk_Left(this.game), //state 14
            new Player_Spacewalk_Right(this.game), //state 15
            new Player_Spacewalk_Up(this.game), //state 16
            new Player_Spacewalk_Down(this.game), //State 17
            new Player_Spacewalk_Standing_Left(this.game), //state 18
            new Player_Spacewalk_Standing_Right(this.game), //state 19
            new Player_Spacewalk_Standing_Up(this.game), // state 20
            new Player_Spacewalk_Standing_Down(this.game), //state 21
        ]; 
        this.currentState = this.states[1]; //state standing right (1)
        
        this.friction = 0.99;
        this.weight = 0.5;
        this.maxSpeed = 10;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.position = {
            x: this.game.spaceship.position.x -this.game.spaceship.width/2,// this.game.width * 0.1,
            y: this.game.spaceship.position.y -this.game.spaceship.height/2//this.game.height - this.height, // place the player at the bottom of the canvas
        }
        this.hitCircle = {
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/3 + 20,
            },
            width: this.width/3,
            height: this.height/3,
        } 
        this.camerabox = {
            position:{
                x: this.position.x - this.game.width * 0.22,
                y: this.position.y - this.height
            },
            width: this.game.width * 0.5,
            height: this.game.height * 0.4,
        } 
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    onGround(){
        return(this.position.y >= this.game.height - this.height - this.game.groundMargin)
    }

    draw(context, deltaTime){
        this.animateFrames(deltaTime)
        //draw the player on the screen
        context.drawImage(this.image, 
            this.frame.x * this.sw, 
            this.frame.y * this.sh,
            this.sw,
            this.sh,
            this.position.x, 
            this.position.y,
            this.width,
            this.height);   
    }
    update(input, camera){
        this.checkForCollisions()
        this.updateHitCircle();
        this.currentState.handleInput(input, camera); 
        // console.log(this.velocity.y)
        // this.handleScreen()  //used to ensure the player doesn't fall off the screen
        this.updateCameraBox();

        //check if the player is hurt
        this.hurt = this.hurtTime > 0
        if(this.hurt){
            this.hurtTime--;
        }
        
        ////////horizontal movement////////////////
        this.position.x += this.velocity.x;

        ////////Vertical movement////////////////
        this.position.y += this.velocity.y;
        if(this.isOnPlanet){
            if(!this.onGround()){
                this.velocity.y += this.weight;
            }
            else{
                this.velocity.y = 0; // make player fall after jump
            }
            if(this.position.y > this.game.height - this.height){// ensure player doesn't fall off screen
                this.position.y = this.game.height - this.height - this.game.groundMargin;
            }
        } 
        //handle lives
        if(this.health <= 0 && this.lives > 0){
            this.lives --;
            this.health = this.game.data.PLAYER_MAX_HEALTH;
        }
        else if(this.lives <= 0){
            this.hurtTime = Math.ceil(this.game.data.PLAYER_HURT_DURATION * this.game.data.FPS); 
            this.game.setState(1);
        }

    }

    setState(state){ //the passed state is an index number
        this.currentState = this.states[state]; //set the current state
        this.currentState.enter(); // calls the enter method on the current state you are on 
    }
    animateFrames(deltaTime){
        if(this.image.complete){
            if(this.frameTimer > this.frameInterval){ // animate player sprite
                if(this.frame.x < this.maxFrames){
                    this.frame.x++;
                }
                else{
                    this.frame.x = 0;
                }
                this.frameTimer = 0;
            }
            else{
                this.frameTimer += deltaTime;
            }
        }
    }
    handleScreen(){ //has small bug
        if(this.position.x + this.velocity.x >= this.game.universe.width/4 - this.width){   //add the velocity to check a few pixels in advance
            this.position.x = this.game.universe.width/4 - this.width;
            this.velocity.x = 0;
            console.log("pass")
        }
        else if(this.position.x + this.velocity.x <= 0 - this.game.universe.centerPoint.x/2){ //add the velocity to check a few pixels in advance
            this.position.x = 0 - this.game.universe.centerPoint.x/2 + Math.abs(this.velocity.x)
            this.velocity.x = 0; //stop player from moving and the universe from movings
        }
    }
    updateHitCircle(){
        this.hitCircle = {
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/3 + 20,
            },
            width: this.width/3.5,
            height: this.height/3.5,
        } 
    }
    updateCameraBox(){
        this.camerabox = {
            position:{
                x: this.position.x - this.game.width * 0.22,
                y: this.position.y - this.height
            },
            width: this.game.width * 0.5,
            height: this.game.height * 0.4,
        } 
    }
    shouldPanCameraToLeft(camera){
        const cameraBoxRightSide = this.camerabox.position.x + this.camerabox.width;
        // if(cameraBoxRightSide + this.velocity.x >= this.game.universe.width/4){ //prevent panning beyond width of background
        //     return
        // }
        if(cameraBoxRightSide + this.velocity.x >= this.game.width + Math.abs(camera.position.x)){ //pan when the right side of the camera collide   
            camera.position.x -= this.velocity.x  //translate left
        }
    }
    shouldPanCameraToRight(camera){
        const cameraBoxLeftSide = this.camerabox.position.x;
        // if(cameraBoxLeftSide + this.velocity.x <= 0 - this.game.universe.centerPoint.x/2){ //prevent panning beyond 0
        //     return
        // }
        if(cameraBoxLeftSide + this.velocity.x <= Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x  // translate right
        }
    }
    shouldPanCameraDown(camera){
        const cameraBoxBottom = this.camerabox.position.y + this.camerabox.height;
        // if(cameraBoxBottom + this.velocity.y >= this.game.height){ //prevent panning beyond width of background
        //     return
        // }
        if(cameraBoxBottom >= this.game.height + Math.abs(camera.position.y)){ //pan when the bottom side of the camera collide   
            camera.position.y -= this.velocity.y  //translate up
        }
    }
    shouldPanCameraUp(camera){
        const cameraBoxTop = this.camerabox.position.y;
        // if(cameraBoxTop + this.velocity.y <= 0){ //prevent panning beyond 0
        //     return
        // }
        if(cameraBoxTop + this.velocity.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.velocity.y  // translate down;  note: this.velocity is negative, so two negatives = positive
        } 
    }
    checkForCollisions(){
        this.game.rewards.forEach(reward=>{
            if(collisionCircleDetection(this, reward)){
                if(reward.type === "food"){
                    if(this.lives >= this.game.data.PLAYER_LIVES && this.health >= this.game.data.PLAYER_MAX_HEALTH){
                        this.game.inventory.push("lives");
                        console.log("new life")
                    }
                    else{
                        this.lives += Math.floor(reward.vertices / 3);
                    }
                    // reward.markedForDeletion = true;
                }
                else if(reward.type === "oxygen"){
                    if(this.oxygenLevel >= this.game.data.PLAYER_OXYGEN_LEVEL){
                        this.game.inventory.push("oxygen");
                        console.log("new oxg")
                    }
                    else{
                        this.oxygenLevel += reward.width;
                        // console.log(this.oxygenLevel, "O2")
                    }
                    // reward.markedForDeletion = true;
                }
                else if(reward.type === "mineral"){
                    this.game.inventory.push("mineral")
                    console.log("new mineral")
                    // reward.markedForDeletion = true;
                }
                reward.markedForDeletion = true;
            }
            // console.log(this.game.inventory, "inventory")
        })

        this.game.enemies.forEach(enemy => {
            // if(collisionCircleDetection(this.hitCircle, enemy.hitCircle)){
            if(collisionBlockDectection(this.hitCircle, enemy)){
                // add a collision animation to the collision array
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.position, enemy.width, enemy.height))
                
                if(this.currentState === this.states[10] || this.currentState === this.states[11]){
                    let x = enemy.position.x
                    let y = enemy.position.y
                    this.game.floatingMessage.push(new FloatingMessage(this.game, "+1", x, y, this.game.width/2, 40))
                    // enemy.reset(); //mark for deletion;
                    enemy.markedForDeletion = true;
                    
                }
                else{//next to add left right condition
                    this.hurtTime = Math.ceil(this.game.data.PLAYER_HURT_DURATION * this.game.data.FPS); 
                    this.health -= enemy.width * 0.7;
                    let positionX = this.hitCircle.position.x + this.hitCircle.width
                    let positionY = this.hitCircle.position.y;
                    let textSize = "10";
                    let floatSpeed = 0.08;
                    let floatTime = 50;
                    let margin = 8;
                    //curse using symbols &#%!@?!
                    this.game.floatingMessage.push(
                        new FloatingMessage(this.game, "&", positionX, positionY, positionX + margin, positionY -margin, textSize, floatSpeed, floatTime), 
                        new FloatingMessage(this.game, "#", positionX, positionY, positionX + margin * 2, positionY -margin * 2, textSize, floatSpeed, floatTime), 
                        new FloatingMessage(this.game, "%", positionX, positionY, positionX + margin * 3, positionY -margin * 3, textSize, floatSpeed, floatTime),
                        new FloatingMessage(this.game, "!", positionX, positionY, positionX + margin * 4, positionY -margin * 4, textSize, floatSpeed, floatTime),
                        new FloatingMessage(this.game, "@", positionX, positionY, positionX + margin * 5, positionY -margin * 5, textSize, floatSpeed, floatTime),
                        new FloatingMessage(this.game, "?", positionX, positionY, positionX + margin * 6, positionY -margin * 6, textSize, floatSpeed, floatTime),
                        new FloatingMessage(this.game, "!", positionX, positionY, positionX + margin * 7, positionY -margin * 7, textSize, floatSpeed, floatTime))
                    // console.log("hurt");
                    // this.setState(12)
                }  
            }
        });
    }
}


export default Player;