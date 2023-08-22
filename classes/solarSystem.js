export class SolarSystem {
    constructor(game) {
        this.game = game;
        this.scaled = 1//35;
    
        // Define the sun
        this.sun = {
            position:{
                x: game.width / 2, //position in the soloar system
                y: game.height / 2, //position in the soloar system
            },
            radius: 50, // Sun's radius
            color: 'yellow'
        };
    
        // Define planets with realistic properties
        // Define planets and celestial bodies with realistic properties
        this.planets = [
                    { name: 'Mercury', radius: 10, distance: 100, angle: 0, speed: 0.006, color: 'gray', rotationSpeed: 0.005, position:{x:0,y:0} },
        { name: 'Venus', radius: 15, distance: 150, angle: 0, speed: -0.0045, color: 'orange', rotationSpeed: -0.002, position:{x:0,y:0} },
        { name: 'Earth', radius: 15, distance: 200, angle: 0, speed: 0.003, color: 'blue', rotationSpeed: 0.003, position:{x:0,y:0} },
        { name: 'Mars', radius: 12, distance: 250, angle: 0, speed: 0.0024, color: 'red', rotationSpeed: 0.002 , position:{x:0,y:0}},
        { name: 'Jupiter', radius: 30, distance: 350, angle: 0, speed: 0.0015, color: 'orange', rotationSpeed: 0.001 , position:{x:0,y:0}},
        { name: 'Saturn', radius: 28, distance: 450, angle: 0, speed: 0.0012, color: 'yellow', rotationSpeed: 0.001 , position:{x:0,y:0}},
        { name: 'Uranus', radius: 22, distance: 550, angle: 0, speed: 0.0015, color: 'lightblue', rotationSpeed: -0.002 , position:{x:0,y:0}},
        { name: 'Neptune', radius: 20, distance: 600, angle: 0, speed: 0.00075, color: 'blue', rotationSpeed: 0.002 , position:{x:0,y:0}},
        { name: 'Pluto', radius: 8, distance: 650, angle: 0, speed: 0.0006, color: 'lightgray', rotationSpeed: -0.001, position:{x:0,y:0} },
        { name: 'Ceres', radius: 5, distance: 700, angle: 0, speed: 0.00045, color: 'brown', rotationSpeed: 0.0015 , position:{x:0,y:0}},
        { name: 'Eris', radius: 10, distance: 750, angle: 0, speed: 0.00036, color: 'pink', rotationSpeed: -0.0012 , position:{x:0,y:0}},
        { name: 'Haumea', radius: 9, distance: 800, angle: 0, speed: 0.0003, color: 'lightred', rotationSpeed: 0.0011, position:{x:0,y:0} },
        { name: 'Makemake', radius: 8, distance: 850, angle: 0, speed: 0.00018, color: 'darkorange', rotationSpeed: -0.001, position:{x:0,y:0} },
        // You can continue to add more celestial bodies here...
        ];


        
    }
  
    draw(context) {
        // Draw the sun
        context.fillStyle = this.sun.color;
        context.beginPath();
        context.arc(this.sun.position.x, this.sun.position.y, this.sun.radius, 0, Math.PI * 2);
        context.fill();
    
        // Draw planets and celestial bodies
        this.planets.forEach((planet) => {
            // Update the angle for orbital motion
            planet.angle += planet.speed;

            // Calculate planet's position based on its angle and distance from the sun
            const x = this.sun.position.x + planet.distance * this.scaled * Math.cos(planet.angle);
            const y = this.sun.position.y + planet.distance * this.scaled * Math.sin(planet.angle);
            planet.position.x = x;
            planet.position.y = y; 
    
            // Rotate the planet itself around its center
            context.translate(x, y); // Translate to planet's position
            context.rotate(planet.rotationSpeed); // Rotate the canvas context
            context.translate(-x, -y); // Translate back to origin
    
            context.fillStyle = planet.color;
            context.beginPath();
            context.arc(x, y, planet.radius, 0, Math.PI * 2);
            context.fill();
    
            // Reset the canvas transformation for the next iteration
            context.setTransform(1, 0, 0, 1, 0, 0);
    
            // Draw labels for celestial bodies and planets
            context.fillStyle = 'white';
            context.fillText(planet.name, x - 15, y + planet.radius + 10);
        });
        // console.log(this.planets)
    }
    getPlanetPosition(){
        // Access the positions of all the planets
        const planetPositions = solarSystem.planets.map(planet => {
            return {
            name: planet.name,
            x: planet.position.x,
            y: planet.position.y
            };
        });
  
    }
}
  
  