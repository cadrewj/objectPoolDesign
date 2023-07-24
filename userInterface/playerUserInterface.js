import { degToRad } from "../utilityFunctions/utilityFunctions.js";
// context, this.player.lives, this.player.health/100, this.player.hurt, this.player.oxygenLevel
export class PlayerUserInterface{
    constructor(data, width, height) {
        this.data = data;
        this.width = width;
        this.height = height;
        this.spacer = 20;
        this.heartWidth = 15; 
        this.heartHeight = 15;
        // this.x = 10;
        // this.y = 10;
        // this.dimension = Math.min(this.heartWidth, this.heartHeight);
    }
    update(context, lives, percentage, hurt, oxygenLevel) {  
        for (let i = 0; i < lives; i++) {
            this.drawHeart(context, i);
        }
        if(lives > 0){
            this.handleHeartHealth(context, lives, percentage, hurt)
        }
        context.save();
            this.oxygenTank(context, oxygenLevel)  
        context.restore();
    }
    drawHeart(context, i) {
        context.beginPath()
        context.save();
        context.translate(i * this.spacer, 0);
        context.strokeStyle = "rgba(0, 0, 0, 1)";
        context.lineWidth = 2.0;
        context.shadowOffsetX = 4.0;
        context.shadowOffsetY = 4.0;
        context.fillStyle = "rgba(255, 0, 0, 0.7)";
        this.heartShape(context);
        context.stroke();
        context.fill();
        context.restore();
    }
    handleHeartHealth(context, lives, percentage, hurt){
        let color = hurt ? "red" :`rgba(255, 255, 255, 1)`;
        context.beginPath()
        context.save();
        context.fillStyle = this.getColorForPercentage(percentage);
        context.lineWidth = 2.0;
        context.strokeStyle = color;
        context.translate(lives * this.spacer, 0);
       
        this.heartShape(context)
        context.fill();
        context.stroke();
        context.restore();
    }
    heartShape(context, dx=10, dy=10, dimension = Math.min(this.heartWidth, this.heartHeight)){
        context.moveTo(dx, dy + dimension / 4);
        context.quadraticCurveTo(dx, dy, dx + dimension / 4, dy);
        context.quadraticCurveTo(dx + dimension / 2, dy, dx + dimension / 2, dy + dimension / 4);
        context.quadraticCurveTo(dx + dimension / 2, dy, dx + (3 * dimension) / 4, dy);
        context.quadraticCurveTo(dx + dimension, dy, dx + dimension, dy + dimension / 4);
        context.quadraticCurveTo(dx + dimension, dy + dimension / 2, dx + (3 * dimension) / 4, dy + (3 * dimension) / 4);
        context.lineTo(dx + dimension / 2, dy + dimension);
        context.lineTo(dx + dimension / 4, dy + (3 * dimension) / 4);
        context.quadraticCurveTo(dx, dy + dimension / 2, dx, dy + dimension / 4);
    }
    getColorForPercentage(percentage, colorRange = 60) {
        let hue = (1 - percentage) * colorRange; // Calculate hue value from 0 to 60 (red to yellow)
        let saturation = 100; // Set saturation to 100% for a vibrant color
        let lightness = 50; // Set lightness to 50% for a balanced color
        let alpha = percentage; // Set alpha to 0.5 for a semi-transparent color
        let color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`; // Convert hue to HSLA color format
        return color;
    }
    
    //cool pink "rgba(255, 105, 180, 0.8)";
    oxygenTank(context, oxygenLevel, dx = 60, dy = 60, consumptionPerMinute = 0.1) {
        const now = new Date();
        //daw the clock at the correct position
        context.translate(dx, dy);
        //change the size of the clock
        context.scale(0.15, 0.15);



        context.rotate(-Math.PI / 2);
        context.strokeStyle = "rgba(255, 105, 180, 0.8)";
        context.fillStyle = "blue";
        context.lineWidth = 8;
        context.lineCap = "round";
      
        // draw Hour marks lines / dashs on the clock
        context.save();
        for (let i = 0; i < 12; i++) {
          context.beginPath();
          context.rotate(Math.PI / 6);
          context.moveTo(100, 0);
          context.lineTo(120, 0);
          context.stroke();
        }
        context.restore();
      
        // draw Minute marks lines / dashs on the clock
        context.save();
        context.lineWidth = 5;
        for (let i = 0; i < 60; i++) {
          if (i % 5 !== 0) {
            context.beginPath();
            context.moveTo(117, 0);
            context.lineTo(120, 0);
            context.stroke();
          }
          context.rotate(Math.PI / 30);
        }
        context.restore();
      
      
        // Draw the seconds hand on the clock
        const seconds = now.getSeconds();
        context.save();
        context.rotate((seconds * Math.PI) / 30);
        context.strokeStyle = "#D40000";
        context.fillStyle = "#D40000";
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(-30, 0);
        context.lineTo(83, 0);
        context.stroke();
        context.beginPath();
        context.arc(0, 0, 12, 0, Math.PI * 2, true);
        context.fill();
        context.beginPath();
        context.arc(95, 0, 10, 0, Math.PI * 2, true);
        context.stroke();
        context.fillStyle = "rgba(0, 0, 0, 0)";
        context.arc(0, 0, 3, 0, Math.PI * 2, true);
        context.fill();
        context.restore();
        // context.restore();
      }
      
}



