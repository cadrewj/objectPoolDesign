import { degToRad } from "../utilityFunctions/utilityFunctions.js";

class Map{
    constructor(player, spaceship){
        this.player = player;
        this.spaceship = spaceship;
        this.miniMap = {
            radius: 200,
            centerPointX: innerHeight - this.miniMap.size,
            centerPointY: innerWidth - this.miniMap.size,
            spaceshipIconRadius: 10,
            playerIconRadius: 10,
        }



    }
    draw(context){
        context.fillStyle = "rgba(0,128,128, 0.5)"
        context.arc(this.miniMap.centerPointX, this.miniMap.centerPointY, this.miniMap.radius, 0, degToRad(360), false)
        context.fill()
        context.fillStyle = "rgba(255, 192, 0, 0.7)"
        context.arc(this.spaceship.position.x, this.spaceship.position.y, this.miniMap.spaceshipIconRadius, 0, degToRad(360), false)
        context.fill();
    }
}