import { degToRad } from "../utilityFunctions/utilityFunctions.js";

const messageBox = document.querySelector("#messageBox");

// Define variables for x and y coordinates for mouth
const x1 = 50, y1 = 50;
const x2 = 75, y2 = 25;
const x3 = 100, y3 = 50;
const offest = 15; //to offset the position of the mouth to the center

// Scale down the coordinates by multiplying with 0.2
const s1 = {x:x1 * 0.2, y: y1 * 0.2};
const s2 = {x:x2 * 0.2, y: y2 * 0.2};
const s3 = {x:x3 * 0.2, y: y3 * 0.2};


// Draw assistant
export function assistantUI(context, dx, dy ,angle) {
    //define variables for the head
    const p1 = { x: 50, y: 50 };
    const p2 = { x: 75, y: 25 };
    const p3 = { x: 100, y: 50 };
    const radius = 27 // set the radius of the curved angle for head
    const r = Math.abs(Math.cos(angle) * radius) > 6 ? Math.abs(Math.cos(angle) * radius) : 6;
    // Move the drawing to a new position
    const mouthPlacementX = (p1.x+p2.x+p3.x)/3 - offest, mouthPlacementY = (p1.y+p2.y+p3.y)/3 + offest;

    context.beginPath();

    context.strokeStyle = "white"
    context.lineWidth = 3;
    context.lineCap = "round" // to make the end/ edge of the line round
    context.lineJoin = "round" // make the corner where the line meet round
    //move the assitant to a position on the canvas
    context.translate(dx, dy); 

    //draw top of head
    context.moveTo(p1.x, p1.y);
    context.arcTo(p2.x, p2.y, p3.x, p3.y, r);
    context.lineTo(p3.x, p3.y);
    
    context.translate(mouthPlacementX, mouthPlacementY);
    
    // draw mouth
    context.moveTo(s1.x, s1.y);
    context.arcTo(s2.x, s2.y, s3.x, s3.y, r * 0.2);
    context.lineTo(s3.x, s3.y);   
    context.moveTo(s1.x, s1.y);
    context.arcTo(s2.x, s2.y + (y3-y2), s3.x, s3.y, r * 0.2);
    context.lineTo(s3.x, s3.y);
    
    // Reset the canvas origin to the original position
    context.translate(-mouthPlacementX, -mouthPlacementY);
    
    //draw cheeks
    context.moveTo(80, 100); 
    context.arcTo(105, 50, 50, 25, 10) // right cheek
    context.moveTo(70, 100); 
    context.arcTo(46, 50, 90, 25, 10); //left cheek //originally 45 but  i move it to make the shape look more smooth
    
    //draw chin
    context.moveTo(75, 90);
    context.lineTo(70,100); //left part of chin
    context.moveTo(75, 90);
    context.lineTo(80,100); //right part of chin
    
    //draw eyes
    context.moveTo(50, 55);  // center of the left eye
    context.ellipse(50,55,10,20,0,0, degToRad(360))// left eye
    context.moveTo(100, 55); //center of the right eye
    context.ellipse(100,55,10,20,degToRad(180),0, degToRad(360)) //right eye
    context.stroke();

    // Reset the canvas origin to the original position
    context.translate(-dx, -dy);
}


