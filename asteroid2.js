import {degToRad, randomNum, randomRGB, handleEdgeOfScreen, collision} from "./utilityFunctions/utilityFunctions.js"


class Particles{
    constructor(width, height, data){
        this.game = {
            width: width,
            height: height,
            data: data,
        }; // pass the game details to the particles class
        this.particlesArray = []; // define an empty particles array

        for(let i = 0; i< data.PARTICLES_NUM; i++){
        let newParticle = this.initParticles()
        this.particlesArray.push(newParticle);
        }
    } 
    updateParticles(context) {
        for (let i = 0; i < this.particlesArray.length; i++) {
            const particle = this.particlesArray[i];
    
            // Draw the particle
            this.drawParticles(particle.x, particle.y, particle.radius, particle.color, context);
        
            // Handle edge of screen
            handleEdgeOfScreen(particle);
        
            // Check for collisions with other particles
            if (this.particlesArray.length > 1) {
                    for (let j = i + 1; j < this.particlesArray.length; j++) {
                    const otherParticle = this.particlesArray[j];
                    const speed = 4;
                    // const result = collision(particle, otherParticle);
                    const result = collision(particle, otherParticle);
                    if (result === true) {
                        // Calculate angle of collision
                        const angle = Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
            
                        // Update velocities of both particles
                        
                        particle.velocityX = -speed * Math.cos(angle); // send object1 in the opposite direction
                        particle.velocityY = -speed * Math.sin(angle);
                        otherParticle.velocityX = speed * Math.cos(angle); // send object2 in the opposite direction
                        otherParticle.velocityY = speed * Math.sin(angle);
                    }
                    
                }
            }
            // Update particle position based on velocity
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
        }
    }
    drawParticles(x,y,radius, color, context){
        context.beginPath()
        context.fillStyle = color;
        context.arc(x, y, radius, 0, degToRad(360),false);
        context.fill()
    }
    initParticles(){ 
        let particle={
            x: randomNum(0, this.game.width),
            y: randomNum(0, this.game.height),
            radius: randomNum (10, 20),
            color: randomRGB(),
            velocityX: randomNum(1,2),
            velocityY: randomNum(1,2)
        }
        return particle;
    }
}
export default Particles