export class GameUserInterface{
    constructor(game){
        this.game =  game;
        this.fontSize = this.game.data.FONT_HEADING_TEXT_SIZE
        this.fontFamily = this.game.data.FONT_HEADING_TEXT
    }
    drawScore(context){
        context.font =  "32px Space Grotesk"//this.fontSize + this.fontFamily;
        context.textAlign = "center";
        context.textBaseline = "middle"
        context.fillStyle = "rgba(255,255,255, 0.5)";
        context.fillText(this.game.score, this.game.width/2 , 20)
    } 
}

export class FloatingMessage{
    constructor (game, value, floatingX, floatingY, targetX, targetY, textSize = "40px", speed = 0.03, maxFloatTime = 100){
        this.game = game;
        this.floatingX = floatingX;
        this.floatingY = floatingY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.value = value;
        this.markedForDeletion = false;
        this.floatingTimer = 0
        this.textSize = textSize;
        this.speed = speed;
        this.maxFloatTime = maxFloatTime
    }
    draw(context){
        context.font =  `${this.textSize} Nanum Pen Script`;
        context.fillStyle = "rgba(255, 255, 255, 1)";
        context.fillText(this.value, this.floatingX, this.floatingY);

        if(this.value === "+1"){
            context.font =  `${this.textSize} Nanum Pen Script`;
            context.fillStyle = "rgba(0, 0, 0, 1)";
            context.fillText(this.value, this.floatingX + 2, this.floatingY+ 2);
        }
    }
    update(){
        //update the floating message
        this.floatingX += (this.targetX - this.floatingX) * this.speed;
        this.floatingY += (this.targetY - this.floatingY) * this.speed;
        this.floatingTimer++;

        if(this.floatingTimer > this.maxFloatTime){
            this.markedForDeletion = true;
            if(this.value === "+1"){
                this.game.score++;
            }
        }

    }
}

