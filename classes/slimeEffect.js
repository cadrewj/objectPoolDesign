export class Ball{
    constructor(slimeEffect){
        this.slimeEffect = slimeEffect;
        this.threshold = 120;
        this.x = this.slimeEffect.width/2; 
        this.y = this.slimeEffect.height/2;
        this.radius = Math.random() * 60 + 30;
        this.angle = 0;
        this.gravity = Math.random() * 0.005;
        this.velocity ={
            x: Math.random() - 0.9, // make move in every direction
            y: Math.random() - 0.7,  // make move in every direction
            angle: Math.random() * 0.1 - 0.05,
        }   
        this.range = Math.random() * 20   
        // console.log(this.threshold) 
    }
    update(){
        const distanceToCenterY = Math.abs(this.y - this.slimeEffect.height / 2);
        const distanceToCenterX = Math.abs(this.x - this.slimeEffect.width / 2);

        if (this.y < 0 || this.y > this.slimeEffect.height){
            this.reset()
        }
        else if(distanceToCenterX <= this.threshold && distanceToCenterY <= this.threshold){ 
            this.angle += this.velocity.angle;
            this.x += this.velocity.x   * Math.sin(this.angle) * this.range;
            this.y += this.velocity.y * Math.cos(this.angle) * this.range
            // this.y += this.velocity.y * Math.sin(this.angle) * this.range
        }
        else{
            if(this.radius > 1){
                this.velocity.y *=-1 // change the direction on y axis
                this.velocity.y += this.gravity;
                this.angle += this.velocity.angle;
                this.radius -=0.09; // slowly reduce the size of the slime
                this.y += this.radius * 0.05 // make the slime drop   
            }
            else{
                this.reset(); //reset the position of the slime
            }
        }
    }
    draw(context){
        context.beginPath();
        //slime colors
        context.fillStyle = "rgba(152, 204, 4, 0.88)"//rgba(101, 255, 0, 0.79)" //"rgb(161, 226, 3)"; 
        // context.arc(this.slimeEffect.width/2, this.slimeEffect.height/2, 70, 0, Math.PI * 2);
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }
    reset(){
        this.x = this.slimeEffect.width * 0.5; // reset the position
        this.y = this.slimeEffect.height * 0.5;
        this.radius = Math.random() * 60 + 30;
        this.range = Math.random() *20  
        this.velocity ={
            x: Math.random() - 0.9, // make move in every direction
            y: Math.random() - 0.7,  // make move in every direction
            angle: Math.random() * 0.1 - 0.05,
        }       
    }
}

export class SlimeEffect{
    constructor(canvasWidth, canvasHeight){
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.slimeBallArray = [];
    }
    init(numberOfBalls){
        for(let i=0; i < numberOfBalls; i++){
            this.slimeBallArray.push(new Ball(this))
        }
    }
    update(){
  
    //slime effect
        this.slimeBallArray.forEach(slimeball=>{
            slimeball.update();
        })
    }
    draw(context){
        this.slimeBallArray.forEach(slimeball=>{
            slimeball.draw(context);
        })
    }
    reset(newWidth, newHeight){
        this.width = newWidth;
        this.height = newHeight;
        this.slimeBallArray.forEach(slimeball=>{
            slimeball.reset()
        })
    }
    // Function to toggle the slime effect filter on the canvas
    toggleSlimeEffect(enable = false, canvas) {
    if (enable) {
      canvas.classList.add("slime-effect-active");
    } else {
      canvas.classList.remove("slime-effect-active");
    }
  } 
}


