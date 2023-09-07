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
   
        this.oxygenTankColor = "rgba(146,182,213, 0.5)";
        this.handColor = "rgba(86, 124, 67, 1)";
        this.oxygenTankRadius = 30;
        this.clockRadius = 30;
        
    }
    update(context, player, deltaTime) {  
        const lives = player.lives;
        const percentage = player.health/100;
        const hurt = player.hurt; 
        const oxygenLevel = player.oxygenLevel;

        for (let i = 0; i < lives; i++) {
            this.drawHeart(context, i);
        }
        if(lives > 0){
            this.handleHeartHealth(context, lives, percentage, hurt)
        }
        this.oxygenTank(context, oxygenLevel);
        this.handleOxygen(player, deltaTime);

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
    oxygenTank(context, oxygenLevel, dx = 70, dy = 70, offset = 15) {

        // Draw the oxygen tank
        context.beginPath();
        context.arc(dx, dy, this.oxygenTankRadius, 0, 2 * Math.PI);
        context.fillStyle = this.oxygenTankColor;
        context.fill();

       
    
        // Calculate the angle for the oxygen level
        const startAngle = -Math.PI / 2; // 12 o'clock position
        const endAngle = startAngle + (Math.PI * 2 * (100 - oxygenLevel)) / 100;
    
        // Draw the oxygen level
        context.beginPath();
        context.moveTo(dx, dy);
        context.arc(dx,dy, this.oxygenTankRadius, startAngle, endAngle, true);
        context.lineTo(dx, dy);
        context.fillStyle = 'rgba(0, 0, 255, 0.3)'; // Light bluish color with alpha
    
        //create a blinking effect
        const pulsatingAlpha = 0.3 + Math.abs(Math.sin(Date.now() / 500)) * 0.5;
        if (oxygenLevel <= 15 && oxygenLevel > 0) {
            context.fillStyle = `rgba(255, 0, 0, ${pulsatingAlpha})`; // Pulsating red color
        }
        else if (oxygenLevel === 0) {
        context.fillStyle = 'rgba(255, 0, 0, 0.7)'; // Solid red color
        }
    
        context.fill();
    
        // Draw the clock
        context.beginPath();
        context.arc(dx, dy, this.clockRadius, 0, 2 * Math.PI);
        context.lineWidth = 2;
        context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        context.stroke();
    
        // Draw the hour, minute, and second lines
        const date = new Date();
        const seconds = date.getSeconds();
        const minutes = date.getMinutes();
        const hours = date.getHours() % 12;
    
        this.drawOxygenHand(context, hours * 30 + minutes * 0.5, this.clockRadius * 0.6, 4, dx, dy); // Hour hand
        this.drawOxygenHand(context, minutes * 6, this.clockRadius * 0.8, 2, dx, dy); // Minute hand
        this.drawOxygenHand(context, seconds * 6, this.clockRadius, 1, dx, dy); // Second hand



        // draw percentage of oxygen left
        context.textAlign = "center"
        context.fillStyle = "rgba(245, 222, 179, 1)"
        context.font = "8px Space Grotesk";
        context.fillText(`${oxygenLevel.toFixed(0)}%`, dx ,dy + offset)

      
    }
    drawOxygenHand(context, angle, length, width, dx, dy) {
        context.beginPath();
        context.moveTo(dx, dy);
        const x = dx + Math.sin(angle * (Math.PI / 180)) * length;
        const y = dy - Math.cos(angle * (Math.PI / 180)) * length;
        context.lineTo(x, y);
        context.lineWidth = width;
        context.lineCap = "round"
        context.strokeStyle = this.handColor;
        context.stroke();
    }
    handleOxygen(player, deltaTime){
        //handle oxygen
        if(player.playerIsInSpace){
            if(player.oxygenTimer > player.oxygenInterval){ // animate player sprite
                player.updateOxygenLevel(-1); 
                player.oxygenTimer = 0;
            }
            else{
                player.oxygenTimer += deltaTime;
            }
        }
        else if(!player.playerIsInSpace && player.oxygenLevel < player.oxygenMax){
            if(player.oxygenTimer > player.oxygenInterval){ // animate player sprite
                player.updateOxygenLevel(1); 
                player.oxygenTimer = 0;
            }
            else{
                player.oxygenTimer += deltaTime;
            }
        }
    }
      

      
}



