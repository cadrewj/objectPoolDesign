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
}

export class Dust extends Particle{
    constructor(game,  position, sign){
        super(game)
        this.sign = sign
        this.size = randomNum(10, 20) // random number between 10 and 20
        this.position ={
            x: position.x + this.game.player.playerInfo.width / 2 ,
            y: position.y + this.game.player.playerInfo.height
        }
        this.velocity ={
            x: Math.random(),
            y: Math.random()
        } 
        this.color = "rgba(201, 193, 181, 0.1)" // dust color #C9C1B5
    }
    draw(context){
        context.beginPath()
        context.fillStyle = this.color;
        context.arc(this.position.x, this.position.y, this.size, 0, degToRad(360), false);
        context.fill();
    }
    update(){
        super.update()
        this.position.x += (this.velocity.x + this.game.velocity.x) * this.sign; //change the direction of the particle if facing left
    }
}


export class Fire extends Particle{
    constructor(game,  position, sign){
        super(game)
        this.sign = sign
        this.image = document.querySelector("#flameTexture")
        this.size = randomNum(50, 200) // random number between 10 and 20
        this.position ={
            x: position.x +this.game.player.playerInfo.width / 2,
            y: position.y + this.game.player.playerInfo.height / 2
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
        this.angle += this.velocity.angle;
        this.position.x += (this.velocity.x + this.game.velocity.x) * this.sign; //use sign to change the direction of the paritcle if facing left

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
            x: position.x -this.size * 0.4, //+this.game.player.playerInfo.width / 2,
            y: position.y  -this.size * 0.4//+ this.game.player.playerInfo.height / 2
        }
        this.velocity ={
            x: Math.random() * 6 - 3 , //number between - 3 and +3
            y: Math.random() * 2 + 2, //number between 2 and + 4,
            // angle: Math.random() * 0.2 - 0.1  //number between - 0.1 and + 0.1
        } 
        // this.angle = 0;
        this.gravity = 0;
 
    }
    update(){
        super.update();
        this.gravity += 0.1
        this.position.y += this.gravity;
    }
    draw(context){
        context.drawImage(this.image, this.position.x + this.game.player.playerInfo.width * 0.5, this.position.y + this.game.player.playerInfo.height * 0.5, this.size, this.size) 
    }
}
