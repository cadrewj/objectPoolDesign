
class Symbol{ // used to manage symbols
    constructor(x, y, fontSize, canvasHeight, gradient){
        this.x = x;
        this.y = y;
        this.gradient = gradient
        this.velocity = {
            x: 0,
            y: 1
        }
        this.fontSize = fontSize;
        this.canvasHeight = canvasHeight;
        this.characters = `アァカサタナハマヤャラワガザダバパイィキシチ
                            ニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベ
                            ペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
        this.text =""; // currently active symbol;

    }
    draw(context, applyGradient) { // Update the draw method to accept a new argument
        if (applyGradient) {
          context.fillStyle = this.gradient; // Apply the gradient if applyGradient is true
        } else {
          context.fillStyle = "#0aff0a"; // Use the default color otherwise
        }
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
      }
    update(){
        // console.log("drawing")
        if(this.y * this.fontSize > this.canvasHeight && Math.random() > 0.98){ //add math.random to randomize the reset of the symbol
            this.y = 0
        }else{
            this.y += this.velocity.y;
        }
    }
}

export class RainEffect{ // used to manage the entire effect
    constructor(width, height, context){
        this.canvasWidth = width
        this.canvasHeight = height;
        this.context = context
        this.fontSize = 25;
        this.columns = this.canvasWidth/ this.fontSize // to determine the amount of column of characters to display;
        this.symbols = []
        this.startingPoint = 0;
        

        //x1, y1, r1 starting point of inner circle and its radius
        //x2, y2, r2 of the outer circle
        this.gradient = this.context.createRadialGradient(this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth*0.05, this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth/2); //not gradient is set to the background not the element

        // let colors =["red", "cyan", "magenta"];
        this.gradient.addColorStop(0, "red")//colors [Math.floor(Math.random() * 2)]);

        this.gradient.addColorStop(0.05, "cyan");

        this.gradient.addColorStop(0.1, "magenta");
        this.#initialize();

    }
    #initialize(){
        for(let i = 0; i < this.columns; i++){
            this.symbols[i] = new Symbol(i, this.startingPoint, this.fontSize, this.canvasHeight, this.gradient);
        }
    }
    resize(width, height){ // used to resize the effect when the window size changes
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = this.canvasWidth / this.fontSize; // recalculate the number of columns
        this.symbols = []//delete all the old symbols
        this.#initialize()// reinitial the array
    }
}
