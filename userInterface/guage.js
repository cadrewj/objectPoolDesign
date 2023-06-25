let guageSize  = 40;
// Function to draw the fuel gauge
export function drawFuelGauge(context, percentage, centerX, centerY) {
    let radius = guageSize - 10;
    let startAngle = 1.2 * Math.PI;
    let endAngle = 1.8 * Math.PI;

    // Draw the background arc
    context.beginPath();
    context.lineCap="butt";
    context.arc(centerX, centerY, radius, startAngle, endAngle);
    context.lineWidth = 10;
    context.strokeStyle = "rgba(204, 204, 204, 0.5)"//"#ccc";
    context.stroke();

    // Calculate the fuel arc color based on the percentage
    let fuelColor = getColorForPercentage(percentage);

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

    // Draw the text
    context.font = "12px Arial";
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.textBaseline = "bottom"
    const fuelPercentage = percentage * 100;
    context.fillText(" "+ fuelPercentage.toFixed(0) + "%", centerX, centerY);
    context.font = "8px Arial";
    context.fillText("E", centerX - radius, centerY);
    context.fillText("F", centerX + radius, centerY);
}

// Function to calculate the fuel arc color based on the percentage
function getColorForPercentage(percentage) {
    let hue = (percentage) * 120; // Calculate hue value from 0 to 120 (red to green)
    let color = "hsl(" + hue + ", 120%, 50%)"; // Convert hue to HSL color format
    // console.log(hue, color)
    return color;
}

// Usage example
//let fuelPercentage = 70; // Change this value to set the fuel percentage
//let centerX = canvas.width / 2; // Change this value to set the x-coordinate of the fuel gauge
//let centerY = canvas.height / 2; // Change this value to set the y-coordinate of the fuel gauge
// drawFuelGauge(context, fuelPercentage / 100, centerX, centerY);
