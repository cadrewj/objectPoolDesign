

export class BallPulse {
  constructor(radius, color, x, y) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.color = color;
    this.lineWidth = 1;
    this.angle = 0;
    this.centerScale = 1;
    this.range = 0.5;
    this.speed = 0.05;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
    
    context.lineWidth = this.lineWidth;
    context.fillStyle = this.color;
    context.beginPath();
    //x, y, radius, start_angle, end_angle, anti-clockwise
    context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.restore();
  }
  update(context){
    this.draw(context)
    this.scaleX = this.centerScale + Math.sin(this.angle) * this.range; //changes the draw scale to create the illusion of expanding
    this.scaleY = this.centerScale + Math.sin(this.angle) * this.range;
    this.angle += this.speed;
  }
} 

