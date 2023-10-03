import { degToRad } from "../utilityFunctions/utilityFunctions.js";
 
export class ShootSlimeBall{
    constructor(canvasWidth, canvasHeight){
        this.dx = 100;
        this.dy = canvasHeight - 40;
        this.image = document.querySelector("#playerSprite")
        this.player ={
            position:{
                x: 0,
                y: canvasHeight-30
            },
            width: 100,
            height: 100,
            sw: 72,
            sh: 72,
        }
        this.frame = {
            x:1,
            y:2,
        }
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight
        this.centerCanvasX = this.canvasWidth / 2;
        this.centerCanvasY = this.canvasHeight / 2;

        this.width = 40;
        this.slimeBallArray = [];
        this.radius = 20//this.width/2;
        this.maxRadius = 50
        this.velocity = 12;
        this.angle = 0
        this.init(10)
        this.threshold = 50;
        this.range = 5;


    }
    init(numberOfBalls){
       
        for(let i=0; i < numberOfBalls; i++){
            const ball ={
                x: this.dx,
                y: this.dy,
                miniRadius: Math.random() * 7 + 5,
                miniAngle: 0,
                miniVelocity:{
                    x: Math.random() - 0.9, // make move in every direction
                    y: Math.random() - 0.7,  // make move in every direction
                    miniAngle: Math.random() * 0.1 - 0.05,
                }
            }  
            this.slimeBallArray.push({...ball})
        }
    }
    draw(context){
        //main slime ball
        context.beginPath();
        context.fillStyle =  "rgba(152, 204, 4, 0.88)"
        context.arc(this.dx, this.dy, this.radius, 0, degToRad(360))
        context.fill()
   
        // //draw the player
        context.save()
        context.translate(this.player.position.x, this.player.position.y)
        context.rotate(degToRad(320))
        context.drawImage(this.image, 
            this.player.sw * this.frame.x, this.player.sh * this.frame.y,
            this.player.sw, this.player.sh,
            0,
            0,
            this.player.width, this.player.height

            )
            context.translate(-this.player.position.x, -this.player.position.y)
        context.restore();        
    }
    update() {
        // calculate the angle of the center of the screen
        this.distanceToCenter = Math.sqrt((this.dx - this.centerCanvasX) ** 2 + (this.dy - this.centerCanvasY) ** 2);
        this.angle = Math.atan2(this.centerCanvasY - this.dy, this.centerCanvasX - this.dx);
    
        this.dx += this.velocity * Math.cos(this.angle); // send object1 in the opposite direction
        this.dy += this.velocity * Math.sin(this.angle);
    
        if (this.radius < this.maxRadius) {
            this.radius += 0.1;
        }    
        this.slimeBallArray.forEach((slimeball) => {
            const distanceToCenterY = Math.abs(slimeball.y - this.dy/2);
            const distanceToCenterX = Math.abs(slimeball.x - this.dx/2);
    
            if (distanceToCenterX <= this.threshold || distanceToCenterY <= this.threshold) {
                slimeball.miniAngle += slimeball.miniVelocity.miniAngle;
                slimeball.x += slimeball.miniVelocity.x * Math.cos(slimeball.miniAngle) * this.range;
                slimeball.y += slimeball.miniVelocity.y * Math.sin(slimeball.miniAngle) * this.range;
            } else {
                slimeball.miniVelocity.x *= -1;
                slimeball.miniVelocity.y *= -1;
            }
        });      
    }
}







