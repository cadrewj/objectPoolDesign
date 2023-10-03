//1440 758

export class SpaceshipUserInterface{
    constructor(canvas, data, width, height){
        this.data = data;
        this.width = width;
        this.height = height;
        this.canvas = canvas;


        //define wifiIcon wave
        this.positionX1 = 0;
        this.positionX2 = 0;
        this.barSpacing = 6.25;
        this.centerX = 0;
        this.centerY = 0;
        this.totalBars = 3;
        this.filledBars = 0;
        this.FPS = 60;
        this.frameInterval = 50000 / this.FPS;
        this.barWidth = 2.5;
        this.initialHeight = 15;
        this.lineWidth = 3.75
        this.heightIncrementValue = 15/4;
        this.curveAmount = 10; // Adjust the curve amount as needed
        this.lastFrameTime = 0;
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
    drawSpaceshipLives(context, spaceship, deltaTime){
        let color = spaceship.exploding ? "rgb(255,0,0)" : "rgb(225,255,255)"; //red or purple
        if(spaceship.lives >= 0){
            let offsetX = 0.1112 * this.width;
            let offsetY = 0.222 * this.height
            let offsetLivesX = 0.1285 * this.width;
            let offsetLivesY = 0.18151 * this.height
            let autoButtonX = this.width - offsetX;
            let autoButtonY = this.height - offsetY; 
            let shipLifeWidth = this.data.SPACESHIP_SIZE * 0.40;
            let shipLifeHeight = this.data.SPACESHIP_SIZE * 0.40;
            let radii = 5;

            this.autopilotButton(context, spaceship, autoButtonX, autoButtonY, shipLifeWidth, shipLifeHeight, radii);

            context.strokeStyle = color;
            context.beginPath()
            context.textAlign = "center";
            context.textBaseline = "hanger"
            context.fillStyle = color;
            context.font =  "20px Space Grotesk"//"20px Pacifico" //dejavu sans mono;
            context.drawImage(spaceship.image, 
                0, 0, 
                spaceship.sw, spaceship.sh, // crop width and height
                autoButtonX, autoButtonY, //where to place it on the screen
                shipLifeWidth, shipLifeHeight); //size of the image in screen
            context.fillText(spaceship.lives + "x", this.width - offsetLivesX , this.height - offsetLivesY)
            context.stroke()
        }
    }
    autopilotButton(context, spaceship, x, y, width, height, radii){
        let lineWidth = 1
        let offset = 10;
        let isOnboxWidth = width * 0.25;
        let isOnboxHeight = height * 0.25;
        let isOnboxX = x + width - isOnboxWidth;
        let isOnboxY = y + height - isOnboxHeight;

        //define the position of the wifiWaveIcon
        this.positionX1 = x;
        this.positionX2 = isOnboxX + offset;
        this.centerY = y - offset * 2;

        //define the button text (button name)
        context.beginPath();
        context.font = "bold 8px Arial";
        context.textBaseline = "hanging";
        context.textAlign = "left";
        context.fillStyle = "rgba(255,255,255, 0.5)"
        context.fillText(`AUTO`, x + lineWidth, y + offset / 5)
        context.fillText(`PILOT`, x + lineWidth, y + offset)
  
        if(spaceship.automationOn){//tiny box for on text info
            context.beginPath();
            context.fillStyle = "green"
            context.roundRect( isOnboxX, isOnboxY, isOnboxWidth, isOnboxHeight, [radii/2]);
            context.fill();

            //define the on text info for autopilot
            context.font = "bold 4px Arial";
            context.textBaseline = "middle";
            context.textAlign = "center";
            context.fillStyle = "rgba(255,255,255, 0.5)"
            context.fillText("ON", isOnboxX + isOnboxWidth/2, isOnboxY + isOnboxHeight/2)

            //round box button
            context.beginPath()
            context.strokeStyle = "green";
            context.roundRect(x, y, width, height, [radii]);
            context.stroke();
        }
        else{//tiny box for off text info
            context.beginPath();
            context.fillStyle = "purple"
            context.roundRect( isOnboxX, isOnboxY, isOnboxWidth, isOnboxHeight, [radii/2]);
            context.fill();

            //define the off text info for autopilot
            context.font = "bold 4px arial";
            context.textBaseline = "middle";
            context.textAlign = "center";
            context.fillStyle = "rgba(255,255,255, 0.5)"
            context.fillText("OFF", isOnboxX + isOnboxWidth/2, isOnboxY + isOnboxHeight/2)

            //round box button
            context.beginPath();
            context.strokeStyle = "purple";
            context.roundRect(x, y, width, height, [radii]);
            context.stroke();
        }
    } 
    wifiIconWave(context, deltaTime, automationOn, angle1 = 0, angle2 = 0) {
        if(!automationOn){
            return;
        }
        // Apply transformations on the first set of waves
        context.save() //the right set of wave curves
        this.centerX = this.positionX2; // position on the x axis
        context.translate(this.centerX, this.centerY);
        context.rotate((Math.PI / 180) * angle1);
        this.waveCurve(context)
        context.restore()

        // Apply transformations on the second set of waves
        context.save() //the left set of wave curves
        this.centerX = this.positionX1;  // position on the x axis
        context.translate(this.centerX, this.centerY);
        context.rotate((Math.PI / 180) * angle2);
        this.waveCurve(context)
        context.restore()

        this.updateWifiWaveIcon(deltaTime); //update wave Icon
    
    }
    waveCurve(context){
        for (let i = 0; i < this.totalBars; i++) {
            const isBarFilled = i < this.filledBars;
            const barHeight = isBarFilled ? this.initialHeight + i * this.heightIncrementValue : 0;
            const x = -((this.barWidth + this.barSpacing) * this.totalBars) / 2 + i * (this.barWidth + this.barSpacing);

            context.strokeStyle = isBarFilled ? "rgba(51,51,51, 1)" : "rgba(0,0,0,0)";
            context.beginPath();
            context.lineCap = "round";
            context.moveTo(x, -barHeight / 2);
            context.lineWidth = this.lineWidth;

            const controlX = x + this.curveAmount;
            const controlY = 0;

            context.quadraticCurveTo(controlX, controlY, x, barHeight / 2);
            context.stroke();
        }
    }
    updateWifiWaveIcon(deltaTime){
        this.frameInterval -= deltaTime; // Decrease the frameInterval by deltaTime
        if (this.frameInterval <= 0) {
            this.filledBars++;
            if (this.filledBars > this.totalBars) {
                this.filledBars = 0;
            }
            this.frameInterval = 20000 / this.FPS; // Reset the frameInterval to its original value
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
    resize(width, height){ // used to resize the effect when the window size changes
        this.width = width;
        this.height = height;
    }
  
}

