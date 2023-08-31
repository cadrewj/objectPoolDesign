import { degToRad, distanceBetweenPoints } from "../utilityFunctions/utilityFunctions.js";

export class MiniMapUserInterface{
    constructor(game){
        this.game = game
        this.gameWidth = this.game.universe.width;
        this.gameHeight = this.game.universe.height;

        //define map
        this.miniMapWidth = this.game.miniMapWidth;
        this.miniMapHeight = this.game.miniMapHeight;    
        this.mapScale = this.miniMapWidth / this.gameWidth;
        
        //define map player
        this.player = {
            x: this.game.player.position.x,
            y: this.game.player.position.y,
            size: 4
        }

        //define map ship
        this.spaceship ={
            x: this.game.spaceship.position.x,
            y: this.game.spaceship.position.y,
            size: 4
        }
        this.playerIsInSpace = this.game.playerIsInSpace

        this.planetsSize = 3;
        this.solarSystem = this.game.solarSystem;
    }
    draw(miniMapCtx){
        miniMapCtx.clearRect(0,0,this.miniMapWidth, this.miniMapHeight)
        miniMapCtx.strokeStyle = "rgba(255,255,255, 0.5)";
        miniMapCtx.lineWidth = 0.5
        miniMapCtx.arc(88,88,this.miniMapWidth/2, 0, degToRad(360), false)
        miniMapCtx.stroke();

        //draw the sun
        miniMapCtx.beginPath()
        miniMapCtx.fillStyle = this.solarSystem.sun.color
        miniMapCtx.arc(
            Math.max(0, Math.min(this.miniMapWidth - this.planetsSize, (this.solarSystem.sun.position.x + this.gameWidth/2)* this.mapScale - this.planetsSize / 2)),
            Math.max(0, Math.min(this.miniMapHeight - this.planetsSize, (this.solarSystem.sun.position.y + this.gameHeight/2) * this.mapScale - this.planetsSize / 2)),
           this.planetsSize, 0, degToRad(360),false
        );
        miniMapCtx.fill();

        this.solarSystem.planets.forEach(planet => {
            miniMapCtx.beginPath()
            miniMapCtx.fillStyle = planet.color
            miniMapCtx.arc(
                Math.max(0, Math.min(this.miniMapWidth - this.planetsSize, (planet.position.x + this.gameWidth/2) * this.mapScale - this.planetsSize / 2)),
                Math.max(0, Math.min(this.miniMapHeight - this.planetsSize, (planet.position.y  + this.gameHeight/2)* this.mapScale - this.planetsSize / 2)),
               this.planetsSize, 0, degToRad(360),false
            );
            miniMapCtx.fill();
        });

        // Draw the spaceship on the mini-map canvas
        miniMapCtx.beginPath()
        miniMapCtx.fillStyle = 'blue';
        miniMapCtx.fillRect(
            Math.max(0, Math.min(this.miniMapWidth - this.spaceship.size, this.spaceship.x * this.mapScale - this.spaceship.size / 2)),
            Math.max(0, Math.min(this.miniMapHeight - this.spaceship.size, this.spaceship.y * this.mapScale - this.spaceship.size / 2)),
            this.spaceship.size,
            this.spaceship.size
        );

        //add text information to the map
        miniMapCtx.fillStyle = "rgb(255,255,255)";
        miniMapCtx.textAlign ="center"
        miniMapCtx.font =  '10px Space Grotesk'//'10px Helvetica';
        const shipPosition ={
            x: this.spaceship.x/1000,
            y: this.spaceship.y/1000
        }

        if(!this.playerIsInSpace){
            //ship info
            miniMapCtx.fillStyle = "white"
            miniMapCtx.fillText(`(${shipPosition.x.toFixed(1)}, ${shipPosition.y.toFixed(1)})`, 
            this.spaceship.x * this.mapScale - this.spaceship.size / 2, 
            this.spaceship.y * this.mapScale - this.spaceship.size / 2)
        }
        else{
            //player distance from ship info
            const distanceFromShip = (Math.hypot(this.player.x - this.spaceship.x, this.player.y - this.spaceship.y));
            miniMapCtx.fillStyle = "white"
            miniMapCtx.fillText(`(${distanceFromShip.toFixed(1)})`, 
            this.player.x * this.mapScale - this.player.size / 2, 
            this.player.y * this.mapScale - this.player.size / 2)

            // Draw the player on the mini-map canvas
            miniMapCtx.beginPath()
            miniMapCtx.fillStyle = 'red';
            miniMapCtx.fillRect(
            Math.max(0, Math.min(this.miniMapWidth - this.player.size, this.player.x * this.mapScale - this.player.size / 2)),
            Math.max(0, Math.min(this.miniMapHeight - this.player.size, this.player.y * this.mapScale - this.player.size / 2)),
            this.player.size,
            this.player.size
            );
        }  
    }
    update(playerX, playerY, spaceshipX, spaceshipY, planets, playerIsInSpace){
        // set the new player position
        this.player.x = playerX + this.gameWidth/2;
        this.player.y = playerY + this.gameHeight/2;
        this.playerIsInSpace = playerIsInSpace
        
        // set the new ship position
        this.spaceship.x = spaceshipX + this.gameWidth/2;
        this.spaceship.y = spaceshipY + this.gameHeight/2; 

        this.solarSystem.sun.position.x = this.solarSystem.sun.position.x;
        this.solarSystem.sun.position.y = this.solarSystem.sun.position.y;

        this.solarSystem.planets = planets;
        this.solarSystem.planets.forEach(planet => {
            planet.position.x = planet.position.x;
            planet.position.y = planet.position.y; 
        });
    }
}