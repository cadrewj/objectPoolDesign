//1440 764
export class SpaceshipUserInterface{
    constructor(data, width, height){
        this.data = data;
        this.width = width;
        this.height = height;
    }
    drawSpaceshipHealthBar(context, spaceship){
        let colorRange = 120;
        context.beginPath()
        let color = spaceship.exploding ? "red" :  "rgba(128, 0 , 128, 1)";
        context.strokeStyle = color; 
        context.strokeRect(this.width - this.width * 0.111, this.height - this.height * 0.026, this.height * 0.0130, -this.data.SPACESHIP_MAX_HEALTH) // HEALTH BAR  //160 20 10 
        if(!spaceship.exploding){
            context.fillStyle = this.getColorForPercentage(spaceship.health / 100, colorRange) 
            context.fillRect(this.width - this.width * 0.11, this.height -this.height * 0.026, this.height * 0.0117, -spaceship.health); //159 20 9
        }
    }    
    drawSpaceshipLives(context, spaceship){
        let color = spaceship.exploding ? "rgb(255,0,0)" : "rgb(225,255,255)"; //red or purple
        if(spaceship.lives >= 0){
            let x = this.width - 175, y = this.height - 160; 
            let shipLifeWidth = this.data.SPACESHIP_SIZE * 0.40;
            let shipLifeHeight = this.data.SPACESHIP_SIZE * 0.40;
            context.strokeStyle = color;
            context.beginPath()
            context.textAlign = "center";
            context.textBaseline = "hanger"
            context.fillStyle = color;
            context.font =  "20px Space Grotesk"//"20px Pacifico" //dejavu sans mono;
            context.drawImage(spaceship.image, 
                0, 0, 
                spaceship.sw, spaceship.sh, // crop width and height
                x, y, //where to place it on the screen
                shipLifeWidth, shipLifeHeight); //size of the image in screen
            context.fillText(spaceship.lives + "x", this.width - 185 , this.height - 130)
            context.stroke()
        }
    }
    
    // Function to draw the fuel gauge
    drawFuelGauge(context, percentage, centerX, centerY) {
        let radius = this.data.GUAGE_SIZE - 10;
        let startAngle = 1.2 * Math.PI;
        let endAngle = 1.8 * Math.PI;
        let colorRange = 120

        // Draw the background arc
        context.beginPath();
        context.lineCap = "butt";
        context.arc(centerX, centerY, radius, startAngle, endAngle);
        context.lineWidth = 10;
        context.strokeStyle = "rgba(128,0,128, 0.8)"//purple // "rgba(204, 204, 204, 0.5)"//"#ccc";
        context.stroke();

        // Calculate the fuel arc color based on the percentage
        let fuelColor = this.getColorForPercentage(percentage, colorRange);

        // Draw the fuel arc
        let fuelLevel = (endAngle - startAngle) * percentage;
        context.beginPath();
        context.arc(centerX, centerY, radius, startAngle, startAngle + fuelLevel, false);
        context.lineWidth = 6;
        context.strokeStyle = fuelColor;
        context.stroke();

        // Draw the meter stick
        context.beginPath();
        context.lineCap= "round";
        context.moveTo(centerX - radius - 5, centerY);
        context.lineTo(centerX + radius + 5, centerY);
        context.lineWidth = 0.5;
        context.strokeStyle = "rgba(187, 187, 187, 0.5)"//"#bbb";
        context.stroke();

        // Draw the ticks
        let tickCount = 11;
        let tickLength = 8;
        let tickSpacing = (endAngle - startAngle) / tickCount;
        let tickStartAngle = startAngle - tickSpacing / 2;

        for (let i = 1; i <= tickCount; i++) {
            let tickAngle = tickStartAngle + i * tickSpacing;
            let startX = centerX + (radius - 5) * Math.cos(tickAngle);
            let startY = centerY + (radius - 5) * Math.sin(tickAngle);
            let endX = centerX + (radius - tickLength - 5) * Math.cos(tickAngle);
            let endY = centerY + (radius - tickLength - 5) * Math.sin(tickAngle);

            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.lineWidth = 1;
            context.lineCap= "round";
            context.strokeStyle = "rgba(255, 187, 255, 0.5)"; //"#fbf"
            context.stroke();
        }

        // Draw the text of guage percentage
        context.font =  "12px Space Grotesk"//"12px Arial";
        context.fillStyle = "rgba(255,255,255,1)";
        context.textAlign = "center";
        context.textBaseline = "bottom"
        const fuelPercentage = percentage * 100;
        context.fillText(" "+ fuelPercentage.toFixed(0) + "%", centerX, centerY);
        context.font = "8px Space Grotesk"//"8px Arial";
        context.fillText("E", centerX - radius, centerY);
        context.fillText("F", centerX + radius, centerY);

        // Usage example
        //let fuelPercentage = 70; // Change this value to set the fuel percentage
        //let centerX = canvas.width / 2; // Change this value to set the x-coordinate of the fuel gauge
        //let centerY = canvas.height / 2; // Change this value to set the y-coordinate of the fuel gauge
        // drawFuelGauge(context, fuelPercentage / 100, centerX, centerY);
    }
    getColorForPercentage(percentage, colorRange = 120){// Function to calculate the fuel arc color based on the percentage
        let hue = (percentage) * colorRange; // Calculate hue value from 0 to 120 (red to green)
        let color = `hsla( ${hue}, ${colorRange}%, 45%, 0.5)`; // Convert hue to HSL color format
        // console.log(hue, color)
        return color;
    }
}