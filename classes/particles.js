import { degToRad, randomNum } from "../utilityFunctions/utilityFunctions.js";

class Particle{
    constructor(game){
        this.game = game;
        this.markedForDeletion = false;
    }
    update(){
       this.position.x += this.velocity.x + this.game.velocity.x;
       this.position.y += this.velocity.y;
       this.size *= 0.95; //make the trail longer the larger the number is
       if(this.size < 0.5){
            this.markedForDeletion = true;
       }
    }
    resize(width, height){ // used to resize the effect when the window size changes
        this.game.width = width;
        this.game.height = height;
    }
}

export class Dust extends Particle{
    constructor(game,  position, sign){
        super(game)
        this.sign = sign
        this.size = randomNum(10, 20) // random number between 10 and 20
        this.offset = 5
        this.position ={
            x: position.x + this.game.player.width / 2 ,
            y: position.y + this.game.player.height
        }
        this.velocity ={
            x: Math.random(),
            y: Math.random()
        } 
        this.color = "rgba(201, 193, 181, 0.1)" // dust color #C9C1B5
        this.angle = 0;
    }
 
    update(){
        super.update()
        this.velocity.x *= this.sign
        this.position.x *= this.sign;
        this.position.x += Math.sin(this.angle * 10);  // add horizontal wabble  to the dust
        this.position.x += this.velocity.x //+ this.game.velocity.x; //change the direction of the particle if facing left
    }
    draw(context){
        context.beginPath()
        context.fillStyle = this.color;
        context.arc(this.position.x, this.position.y-this.offset, this.size, 0, degToRad(360), false);
        context.fill();
    }
}
export class Fire extends Particle{
    constructor(game,  position, sign){
        super(game)
        this.sign = sign
        this.image = document.querySelector("#flameTexture")
        this.size = randomNum(50, 200) // random number between 10 and 20
        this.position ={
            x: position.x +this.game.player.width / 2,
            y: position.y + this.game.player.height / 2
        }
        this.velocity ={
            x: 1,
            y: 1,
            angle: Math.random() * 0.2 - 0.1  //number between - 0.1 and + 0.1
        } 
        this.angle = 0;
    }
    update(){
        super.update()
        this.velocity.x *=this.sign;
        this.position.x *= this.sign; //use sign to change the direction of the paritcle if facing left
        this.angle += this.velocity.angle;
        this.position.x += this.velocity.x //+ this.game.velocity.x
        this.position.x += Math.sin(this.angle * 10);  // add horizontal wabble  
    }
    draw(context){
        context.save()
        context.translate(this.position.x, this.position.y)
        context.rotate(this.angle)
        context.drawImage(this.image, -this.size/2, -this.size/2, this.size, this.size) 
        context.restore()
    }
}

export class Splash  extends Particle{
    constructor(game,  position){
        super(game)
        this.image = document.querySelector("#flameTexture")
        this.size = randomNum(10, 200) // random number between 10 and 20
        this.position ={
            x: position.x -this.size * 0.4, //+this.game.player.width / 2,
            y: position.y  -this.size * 0.4//+ this.game.player.height / 2
        }
        this.velocity ={
            x: Math.random() * 6 - 3 , //number between - 3 and +3
            y: Math.random() * 2 + 2, //number between 2 and + 4,
            angle: Math.random() * 0.2 - 0.1  //number between - 0.1 and + 0.1
        } 
        this.angle = 0;
        this.gravity = 0;
    }
    update(){
        super.update();
        this.velocity.x *=this.sign;
        this.position.x *= this.sign;
       
        this.angle += this.velocity.angle;
        this.position.y += this.gravity;
        this.gravity += 0.1
    }
    draw(context){
        context.save()
        context.rotate(this.angle)
        context.drawImage(this.image,this.position.x, this.position.y, this.size, this.size) 
        context.restore()
    }
} 
export class Fireworks {
    constructor(game, position, sign) {
        this.game = game;
        this.sign = sign;
        this.image = document.querySelector("#flameTexture");
        this.size = randomNum(10, 20);
        this.position = {
            x: position.x - this.size * 0.5,
            y: position.y - this.size * 0.5
        };
        this.velocity = {
            x: Math.random() * 6 - 3,
            y: Math.random() * -3 - 3
        };
        this.gravity = 0.5;
        this.opacity = 1;
        this.color = getRandomColor();
        this.rotation = Math.random() * Math.PI * 2;
    }
    update() {
        this.position.x *= this.sign;
        this.velocity.x *= this.sign;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y + this.gravity;
        this.gravity += 0.1;
        this.opacity -= 0.02;
        this.rotation += Math.random() * 0.1 - 0.05;
    }
    draw(context) {
        context.save();
        context.globalAlpha = this.opacity;
        context.translate(this.position.x + this.size * 0.5, this.position.y + this.size * 0.5);
        context.rotate(this.rotation);
        context.drawImage( this.image,-this.size * 0.5, -this.size * 0.5,this.size,this.size);
        context.restore();
    }
}
  
function getRandomColor() {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    return colors[Math.floor(Math.random() * colors.length)];
}
  