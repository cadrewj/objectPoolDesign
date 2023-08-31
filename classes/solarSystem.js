import { degToRad } from "../utilityFunctions/utilityFunctions.js";
export class SolarSystem {
    constructor(game) {
        this.game = game;
        this.dist = 2307;
    
        // Define the sun
        this.sun = {
            position:{
                x: 0, 
                y: 0 
            },
            radius: 80, // Sun's radius
            color: 'yellow'
        };
    
        // Define planets with realistic properties
        // Define planets and celestial bodies with realistic properties
        this.planets = [
            { name: 'Mercury', radius: 40, distance: this.dist, angle: 0, speed: 0.006, color: 'gray', rotationSpeed: 0.005, position:{x:0,y:0} },
            { name: 'Venus', radius: 45, distance: this.dist * 2, angle: 0, speed: -0.0045, color: 'orange', rotationSpeed: -0.002, position:{x:0,y:0} },
            { name: 'Earth', radius: 45, distance: this.dist * 3, angle: 0, speed: 0.003, color: 'purple', rotationSpeed: 0.003, position:{x:0,y:0} },
            { name: 'Mars', radius: 42, distance: this.dist * 4, angle: 0, speed: 0.0024, color: 'red', rotationSpeed: 0.002 , position:{x:0,y:0}},
            { name: 'Jupiter', radius: 60, distance: this.dist * 5, angle: 0, speed: 0.0015, color: 'orange', rotationSpeed: 0.001 , position:{x:0,y:0}},
            { name: 'Saturn', radius: 58, distance: this.dist * 6, angle: 0, speed: 0.0012, color: 'green', rotationSpeed: 0.001 , position:{x:0,y:0}},
            { name: 'Uranus', radius: 52, distance: this.dist * 7, angle: 0, speed: 0.0015, color: 'lightgreen', rotationSpeed: -0.002 , position:{x:0,y:0}},
            { name: 'Neptune', radius: 50, distance: this.dist * 8, angle: 0, speed: 0.00075, color: 'wheat', rotationSpeed: 0.002 , position:{x:0,y:0}},
            { name: 'Pluto', radius: 38, distance: this.dist * 9, angle: 0, speed: 0.0006, color: 'lightgray', rotationSpeed: -0.001, position:{x:0,y:0} },
            { name: 'Ceres', radius: 35, distance: this.dist * 10, angle: 0, speed: 0.00045, color: 'brown', rotationSpeed: 0.0015 , position:{x:0,y:0}},
            { name: 'Eris', radius: 40, distance: this.dist * 11, angle: 0, speed: 0.00036, color: 'pink', rotationSpeed: -0.0012 , position:{x:0,y:0}},
            { name: 'Haumea', radius: 39, distance: this.dist * 12, angle: 0, speed: 0.0003, color: 'lightred', rotationSpeed: 0.0011, position:{x:0,y:0} },
            { name: 'Makemake', radius: 38, distance: this.dist * 13, angle: 0, speed: 0.00018, color: 'darkorange', rotationSpeed: -0.001, position:{x:0,y:0} },
            // You can continue to add more celestial bodies here...
        ];
    }
  
    draw(context) {
        
        // Draw the sun
        context.save()
        context.fillStyle = this.sun.color;
        context.beginPath();
        context.arc(this.sun.position.x, this.sun.position.y, this.sun.radius, 0, degToRad(360));
        context.fill();

        this.planets.forEach((planet) => {     
            // Rotate the planet itself around its center
            context.translate(planet.position.x, planet.position.y); // Translate to planet's position
            context.rotate(planet.rotationSpeed); // Rotate the canvas context
            context.translate(-planet.position.x, -planet.position.y); // Translate back to origin
    
            context.beginPath();
            context.fillStyle = planet.color;
            context.arc(planet.position.x, planet.position.y, planet.radius, 0, degToRad(360));
            context.fill();
    
            // Reset the canvas transformation for the next iteration
            // context.setTransform(1, 0, 0, 1, 0, 0);
    
            // Draw labels for celestial bodies and planets
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(planet.name, planet.position.x, planet.position.y + planet.radius + 10);
            
        });
        context.restore()

    }
    update(){
        // Draw planets and celestial bodies
        this.planets.forEach((planet) => {   
            // Update the angle for orbital motion
            planet.angle += planet.speed;

            // Calculate planet's position based on its angle and distance from the sun
            const x = this.sun.position.x + planet.distance * Math.cos(planet.angle);
            const y = this.sun.position.y + planet.distance * Math.sin(planet.angle);
            
            planet.position.x = x;
            planet.position.y = y; 
        });
    }
    getPlanetPosition(){
        // Access the positions of all the planets
        const planetPositions = this.planets.map(planet => {
            return {
                name: planet.name,
                x: planet.position.x,
                y: planet.position.y
            };
        });
  
    }
}
  
  