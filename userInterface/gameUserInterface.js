
export class GameUserInterface{
    constructor(game){
        this.game =  game;
        this.fontSize = this.game.data.FONT_HEADING_TEXT_SIZE
        this.fontFamily = this.game.data.FONT_HEADING_TEXT

    }
    drawScore(context){
        context.beginPath()
        context.font = this.fontSize + this.fontFamily;
        context.textAlign = "center";
        context.textBaseline = "middle"
        context.fillStyle = "rgba(255,255,255, 0.5)";
        context.fillText(this.game.score, this.game.width/2 , 20)
    }
}

