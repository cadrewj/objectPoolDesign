import { degToRad, randomDecimal, randomNum } from "../utilityFunctions/utilityFunctions.js";
class Planet{
    constructor(planet){
        this.planet = planet;
        this.name = this.planet.name;
        this.position= this.planet.position;
        this.color = this.planet.color;
        this.radius = this.planet.radius;
        this.halo = this.planet.halo;
        this.velocity = {
            x: randomDecimal(-0.5, 0.6),
            y: randomDecimal(-0.5, 0.6),
            angle: randomDecimal(-0.5, 0.6),
        }
        this.angle = 0;
        this.known = false;
    }
}
export class Universe{
    constructor(game){
        this.image = document.querySelector("#bg")
        this.game = game;
        this.width = 60000;
        this.height = 60000;
        this.centerPoint = {
            x:this.width/2,
            y:this.height/2
        };
        this.position = {
            x: -this.centerPoint.x,
            y: -this.centerPoint.y,
        }
        this.velocity ={
            x: 0,
            y: 0
        }
        this.angle = 0;


        this.planets = [
            {
            name: "Sun",
            radius: 100,
            color: "yellow",
            position: {
                x: this.centerPoint.x,
                y: this.centerPoint.y
            },
            halo: "red"

            }, 
            {
                name: "Mercury",
                radius: 10,
                color: "pink",
                position: {
                    x: this.centerPoint.x,
                    y: this.centerPoint.y
                },
                halo: "red"
            
            }, 
            {
                name: "Mars",
                radius: 10,
                color: "red",
                position: {
                    x: this.centerPoint.x,
                    y: this.centerPoint.y
                },
                halo: "pink"
            }
        ]
        this.solarSystem =[]

        //used to create a nebula shadow over the black canvas
        // this.gradient = context.createLinearGradient(0,this.height, this.width, 0)
        // this.gradient.addColorStop(0, "red")
        // this.gradient.addColorStop(0.2, "yellow")
        // this.gradient.addColorStop(0.4, "green")
        // this.gradient.addColorStop(0.5, "cyan");
        // this.gradient.addColorStop(0.8, "blue")
        // this.gradient.addColorStop(1, "magenta");

        // this.init()
        // console.log(this.solarSystem)
    }


    draw(context){
        context.save()
        // context.translate(this.position.x/2, this.position.y/2);
        // context.rotate(this.angle);
        // context.beginPath()
        // context.fillStyle = this.gradient;
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
        // context.fillRect(0, 0, this.width, this.height);
        // context.beginPath()
        // context.fillStyle = "rgba(0,0,0, 0.95)";
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        // context.fillRect(0, 0, this.width, this.height);

        // this.solarSystem.forEach(planet => {
        //     context.beginPath();
        //     context.fillStyle = planet.color;
        //     context.arc(planet.position.x, planet.position.y, planet.radius, 0, degToRad(360))
        //     context.fill()
            
        // });
        context.restore()

       

    }
    update(){

        //move the universe background 
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // console.log(this.position.x, this.position.y)

        // for(let i = 0; i < this.solarSystem.length; i++){
        //     // this.solarSystem[i].angle += this.solarSystem[i].velocity.angle
        //     this.solarSystem[i].position.x += this.solarSystem[i].velocity.x //* Math.sin(this.solarSystem[i].angle) ;
        //     this.solarSystem[i].position.y += this.solarSystem[i].velocity.y //* Math.cos(this.solarSystem[i].angle) ;
        //     // console.log(this.solarSystem[i].position.x , this.solarSystem[i].position.y)
        // }

    }
    init(){
        // for(let i = 0; i < this.planets.length; i++){
        //     this.planets[i].position.x *= (i + 1);
        //     this.planets[i].position.y *= (i + 1 );
        //     this.solarSystem[i] = new Planet(this.planets[i]);
        // }     
    }
}


