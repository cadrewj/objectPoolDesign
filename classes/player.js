// import { testBoundsOfObject } from "../utilityFunctions/utilityFunctions.js";
import {Player_Standing_Left, Player_Standing_Right }from "../states/PlayerBehavior/PlayerStanding.js";
import {Player_Running_Left, Player_Running_Right} from "../states/PlayerBehavior/PlayerRunning.js";
import {Player_Jumping_Left, Player_Jumping_Right}from "../states/PlayerBehavior/PlayerJumping.js";
import {Player_Falling_Left, Player_Falling_Right}from "../states/PlayerBehavior/PlayerFalling.js";
import {Player_Sheild_Left, Player_Sheild_Right} from "../states/PlayerBehavior/PlayerSheild.js";
import {Player_Shell_Smash_Left, Player_Shell_Smash_Right} from "../states/PlayerBehavior/PlayerShellSmash.js";


class Player{
    constructor(game, playerInfo){
        this.game = {
            width: game.width,
            height: game.height,
            data: game.data,
        };
        this.playerInfo = {...playerInfo};
        this.frame = {
            x: 0,
            y: 0,
        }
        this.maxFrames = 6; //set initial max to six cuz the default image is 6 frames long
        this.isOnPlanet = true;
        this.FPS = this.game.data.FPS;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.FPS;
        
        this.states = [new Player_Standing_Left(this),  //state 0
            new Player_Standing_Right(this), //state 1
            new Player_Sheild_Left(this), //state 2
            new Player_Sheild_Right(this),//state 3
            new Player_Running_Left(this),  //state 4
            new Player_Running_Right(this), // state 5
            new Player_Jumping_Left(this), // state 6
            new Player_Jumping_Right(this), // state 7
            new Player_Falling_Left(this), // state 8
            new Player_Falling_Right(this), //state 9
            new Player_Shell_Smash_Left(this), //state 10
            new Player_Shell_Smash_Right(this),//state 11
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
            x: this.game.width * 0.1,
            y: this.game.height - this.playerInfo.height, // place the player at the bottom of the canvas
        }
        this.hitbox = {
            position:{
                x: this.position.x,
                y: this.position.y,
            },
            width: this.playerInfo.width,
            height: this.playerInfo.height,
        } 
        this.camerabox = {
            position:{
                x: this.position.x - this.game.width * 0.22,
                y: this.position.y - this.playerInfo.height
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
        return(this.position.y >= this.game.height - this.playerInfo.height)
    }

    draw(context, deltaTime){
        if(this.game.data.SHOW_BOUNDING){ //used for testing
            //draw cameraBox
            context.beginPath()
            context.fillStyle = "rgba(211,232,200,0.1)";
            context.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height);

            //draw hitbox
            context.beginPath()
            context.strokeStyle = "red";
            context.strokeRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        }

        this.animateFrames(deltaTime)
        context.fillStyle = "rgba(255, 0, 0, 1)"
        // context.fillRect(this.position.x, this.position.y, this.player.width, this.player.height);
        context.drawImage(this.playerInfo.image, 
            this.frame.x * this.playerInfo.sw, 
            this.frame.y * this.playerInfo.sh,
            this.playerInfo.sw,
            this.playerInfo.sh,
            this.position.x, 
            this.position.y,
            this.playerInfo.width,
            this.playerInfo.height);   
    }
    update(input, enemyPool, camera){
        this.currentState.handleInput(input,camera); 

        this.handleScreen()  //used to ensure the player doesn't fall off the screen
        this.updateHitBox();
        this.updateCameraBox();



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
            if(this.position.y > this.game.height - this.playerInfo.height){// ensure player doesn't fall off screen
                this.position.y = this.game.height - this.playerInfo.height;
            }
        } 
        
         //set up collision with player
        //  enemyPool.forEach(e => {
        //     // const enemy = e.enemy
        //     const dx = e.position.x - this.position.x;
        //     const dy = e.position.y - this.position.y;
        //     const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        //     if(distance < e.enemy.width/2 + this.hitbox.width){
        //         console.log("gameover")
        //         // this.game.gameOver = true;a
        //     }
            
        // });
    }

    setState(state){ //the passed state is an index number
        this.currentState = this.states[state]; //set the current state
        this.currentState.enter(); // calls the enter method on the current state you are on 
    }
    animateFrames(deltaTime){
        if(this.playerInfo.image.complete){
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
        if(this.hitbox.position.x + this.velocity.x>= this.game.width - this.hitbox.width){   //add the velocity to check a few pixels in advance
            this.position.x = this.game.width - this.hitbox.width
        }
        else if(this.hitbox.position.x + this.velocity.x <= 0){ //add the velocity to check a few pixels in advance
            this.position.x = 0;
        }
    }
    updateHitBox(){
        this.hitbox = {
            position:{
                x: this.position.x,
                y: this.position.y,
            },
            width: this.playerInfo.width,
            height: this.playerInfo.height,
        } 
    }
    updateCameraBox(){
        this.camerabox = {
            position:{
                x: this.position.x - this.game.width * 0.22,
                y: this.position.y - this.playerInfo.height
            },
            width: this.game.width * 0.5,
            height: this.game.height * 0.4,
        } 
    }
    shouldPanCameraToLeft(camera){
        const cameraBoxRightSide = this.camerabox.position.x + this.camerabox.width;
        if(cameraBoxRightSide + this.velocity.x >= this.game.width){ //prevent panning beyond width of background
            return
        }
        if(cameraBoxRightSide + this.velocity.x >= this.game.width + Math.abs(camera.position.x)){ //pan when the right side of the camera collide   
            camera.position.x -= this.velocity.x  //translate left
        }

    }
    shouldPanCameraToRight(camera){
        const cameraBoxLeftSide = this.camerabox.position.x;
        if(cameraBoxLeftSide + this.velocity.x <= 0){ //prevent panning beyond 0
            return
        }
        if(cameraBoxLeftSide + this.velocity.x <= Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x  // translate right
        }

    }
    shouldPanCameraUp(camera){
        const cameraBoxBottom = this.camerabox.position.y + this.camerabox.height;
        if(cameraBoxBottom + this.velocity.y >= this.game.height){ //prevent panning beyond width of background
            return
        }
        if(cameraBoxBottom >= this.game.height + Math.abs(camera.position.y)){ //pan when the bottom side of the camera collide   
            camera.position.y -= this.velocity.y  //translate up
        }

    }
    shouldPanCameraDown(camera){
        const cameraBoxTop = this.camerabox.position.y;
        if(cameraBoxTop + this.velocity.y <= 0){ //prevent panning beyond 0
            return
        }
        if(cameraBoxTop + this.velocity.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.velocity.y  // translate down;  note: this.velocity is negative, so two negatives = positive
        }
        
    }
}


export default Player;