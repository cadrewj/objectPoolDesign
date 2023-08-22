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
    }

    draw(context){
        context.save()
        context.beginPath()
        context.fillStyle = "rgba(0,0,0, 0.95)";
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
        // context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        // context.fillRect(0, 0, this.width, this.height)
        context.restore()
    }
    update(){

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}


