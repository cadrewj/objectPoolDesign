import { degToRad } from "../utilityFunctions/utilityFunctions.js";
export class SolarSystem {
    constructor(game) {
        this.game = game;
        this.dist = 2307;

        this.patterns = [
            document.querySelector("#Stormy"), // sun
            document.querySelector("#Volcanic"), // mercury
            document.querySelector("#AlpineClouds"), // venus
            document.querySelector("#Oceanic"), // earth
            document.querySelector("#RedPlanet"), //mars
            document.querySelector("#Rocky"), //jupiter
            document.querySelector("#GasGiant"), //saturn
            document.querySelector("#Tropical"), //Uranus
            document.querySelector("#Radiated"), //neptune
            document.querySelector("#Ice"), //Pluto
            document.querySelector("#Cracked"), //Ceres
            document.querySelector("#Poison"), //Eris
            document.querySelector("#OceanClouds"), //Haumea
            document.querySelector("#Moon"), //Makemake


        ]
    
        // Define the sun
        this.sun = {
            position:{
                x: 0, 
                y: 0 
            },
            radius: 80, // Sun's radius
            color: this.patterns[0]
        };
        
       
    
        // Define planets with realistic properties
        // Define planets and celestial bodies with realistic properties
        this.planets = [
            { name: 'Mercury', radius: 40, distance: this.dist, angle: 0, speed: 0.00006, color: this.patterns[1], rotationSpeed: 0.0005, position:{x:0,y:0} },
            { name: 'Venus', radius: 45, distance: this.dist * 2, angle: 0, speed: -0.000045, color: this.patterns[2], rotationSpeed: -0.0002, position:{x:0,y:0} },
            { name: 'Earth', radius: 45, distance: this.dist * 3, angle: 0, speed: 0.00003, color: this.patterns[3], rotationSpeed: 0.0003, position:{x:0,y:0} },
            { name: 'Mars', radius: 42, distance: this.dist * 4, angle: 0, speed: 0.000024, color: this.patterns[4], rotationSpeed: 0.0002 , position:{x:0,y:0}},
            { name: 'Jupiter', radius: 60, distance: this.dist * 5, angle: 0, speed: 0.000015, color: this.patterns[5], rotationSpeed: 0.0001 , position:{x:0,y:0}},
            { name: 'Saturn', radius: 58, distance: this.dist * 6, angle: 0, speed: 0.000012, color:this.patterns[6], rotationSpeed: 0.0001 , position:{x:0,y:0}},
            { name: 'Uranus', radius: 52, distance: this.dist * 7, angle: 0, speed: 0.000015, color:this.patterns[7], rotationSpeed: -0.0002 , position:{x:0,y:0}},
            { name: 'Neptune', radius: 50, distance: this.dist * 8, angle: 0, speed: 0.0000075, color:this.patterns[8], rotationSpeed: 0.0002 , position:{x:0,y:0}},
            { name: 'Pluto', radius: 38, distance: this.dist * 9, angle: 0, speed: 0.000006, color:this.patterns[9], rotationSpeed: -0.0001, position:{x:0,y:0} },
            { name: 'Ceres', radius: 35, distance: this.dist * 10, angle: 0, speed: 0.0000045, color:this.patterns[10], rotationSpeed: 0.00015 , position:{x:0,y:0}},
            { name: 'Eris', radius: 40, distance: this.dist * 11, angle: 0, speed: 0.0000036, color:this.patterns[11], rotationSpeed: -0.00012 , position:{x:0,y:0}},
            { name: 'Haumea', radius: 39, distance: this.dist * 12, angle: 0, speed: 0.000003, color:this.patterns[12], rotationSpeed: 0.00011, position:{x:0,y:0} },
            { name: 'Makemake', radius: 38, distance: this.dist * 13, angle: 0, speed: 0.0000018, color:this.patterns[13], rotationSpeed: -0.0001, position:{x:0,y:0} },
            // You can continue to add more celestial bodies here...
        ];
    }
  
    draw(context) {
        
        // Draw the sun
        context.save();
        const pattern = context.createPattern(this.sun.color, "repeat");
        context.fillStyle = pattern;
        // context.fillStyle = this.sun.color;
        context.beginPath();
        context.arc(this.sun.position.x, this.sun.position.y, this.sun.radius, 0, degToRad(360));
        context.fill();

        this.planets.forEach((planet) => {     
            // Rotate the planet itself around its center
            context.translate(planet.position.x, planet.position.y); // Translate to planet's position
            context.rotate(planet.rotationSpeed); // Rotate the canvas context
            context.translate(-planet.position.x, -planet.position.y); // Translate back to origin
    
            context.beginPath();
            const pattern2 = context.createPattern(planet.color, "repeat");
            context.fillStyle = pattern2;
            context.arc(planet.position.x, planet.position.y, planet.radius, 0, degToRad(360));
            context.fill();
    
            // Reset the canvas transformation for the next iteration
            // context.setTransform(1, 0, 0, 1, 0, 0);
    
            // Draw labels for celestial bodies and planets
            context.fillStyle = "rgba(255,255,255, 1)";
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
    resize(width, height){ // used to resize the effect when the window size changes
        this.game.width = width;
        this.game.height = height;
    }  
}
  
  