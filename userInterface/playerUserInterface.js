export class PlayerUserInterface{
    constructor(data, width, height) {
        this.data = data;
        this.width = width;
        this.height = height;
        this.spacer = 20;
        this.heartWidth = 15; 
        this.heartHeight = 15;
        this.x = 10;
        this.y = 10;
        this.dimension = Math.min(this.heartWidth, this.heartHeight);
    }

    update(context, lives, percentage, hurt) {  
        for (let i = 0; i < lives; i++) {
            this.drawHeart(context, i);
        }
        this.handleHeartHealth(context, lives, percentage, hurt)
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
        context.lineWidth = 2.0;
        context.strokeStyle = color;
        context.translate(lives * this.spacer, 0);
        context.fillStyle = this.getColorForPercentage(percentage);
        this.heartShape(context)
        context.fill();
        context.stroke();
        context.restore();
    }
    heartShape(context){
        context.moveTo(this.x, this.y + this.dimension / 4);
        context.quadraticCurveTo(this.x, this.y, this.x + this.dimension / 4, this.y);
        context.quadraticCurveTo(this.x + this.dimension / 2, this.y, this.x + this.dimension / 2, this.y + this.dimension / 4);
        context.quadraticCurveTo(this.x + this.dimension / 2, this.y, this.x + (3 * this.dimension) / 4, this.y);
        context.quadraticCurveTo(this.x + this.dimension, this.y, this.x + this.dimension, this.y + this.dimension / 4);
        context.quadraticCurveTo(this.x + this.dimension, this.y + this.dimension / 2, this.x + (3 * this.dimension) / 4, this.y + (3 * this.dimension) / 4);
        context.lineTo(this.x + this.dimension / 2, this.y + this.dimension);
        context.lineTo(this.x + this.dimension / 4, this.y + (3 * this.dimension) / 4);
        context.quadraticCurveTo(this.x, this.y + this.dimension / 2, this.x, this.y + this.dimension / 4);
    }
    getColorForPercentage(percentage, colorRange = 60) {
        let hue = (1 - percentage) * colorRange; // Calculate hue value from 0 to 60 (red to yellow)
        let saturation = 100; // Set saturation to 100% for a vibrant color
        let lightness = 50; // Set lightness to 50% for a balanced color
        let alpha = percentage; // Set alpha to 0.5 for a semi-transparent color
        let color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`; // Convert hue to HSLA color format
        return color;
    }
}



