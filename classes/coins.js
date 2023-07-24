import { degToRad, randomNum } from "../utilityFunctions/utilityFunctions.js";
class Coins{
    constructor(width, height, data){
        this.game ={
            width: width,
            height: height,
            data: data
        }
        this.maxCoins = 10;
        this.coinArray;
        this.coins = {
            name: "Helix",
            total: 0,
            x: 10,
            y:  45,
            radius: 10,

        }
        this.init();

    }
    draw(context){
        //draw coin icon
        context.beginPath()
        context.fillStyle ="lime"
        context.arc(this.coins.x, this.coins.y, this.coins.radius, 0, degToRad(360))
        context.fill();

         //draw coins on the screen
         this.coinArray.forEach(coin => {
            context.beginPath()
            context.fillStyle ="yellow"
            context.arc(coin.x, coin.y, coin.radius, 0, degToRad(360))
            context.fill();
         });
      

    }
    update(context){
        this.draw(context)
        this.displayCoins(context);
       
    }
    displayCoins(context){
        context.font = `${this.game.data.FONT_BODY_TEXT_SIZE} ${this.game.data.FONT_BODY_TEXT}`;
        context.fillStyle = "lime";
        context.fillText(`${this.coins.name}: ${this.coins.total}`, 20, 50);
        context.fillStyle = "white";
        context.fillText(`${this.coins.name}: ${this.coins.total}`, 21, 51);
    }
    init(){
        this.coinArray = []
        for(let i = 0; i < this.maxCoins; i++){
           const coin ={
                x: randomNum(this.coins.radius * 2, this.game.width - this.coins.radius * 2),
                y: randomNum(this.coins.radius * 2, this.game.height - this.coins.radius * 2),
                radius: this.coins.radius * 2,
           } 
           this.coinArray.push(coin);
        }
    }
}

export default Coins;