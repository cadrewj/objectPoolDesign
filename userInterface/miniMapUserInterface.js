export class MiniMapUserInterface{
    constructor(gameWidth, gameHeight, miniMapWidth, miniMapHeight, playerX, playerY, shipX, shipY){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        //define map
        this.miniMapWidth = miniMapWidth;
        this.miniMapHeight = miniMapHeight;    
        this.mapScale = this.miniMapWidth / this.gameWidth;
        
        //define map player
        this.playerX = playerX;
        this.playerY = playerY;
        this.playerSize = 5;

        //define map ship
        this.shipX = shipX;
        this.shipY = shipY;
        this.shipSize = 5;

    }
    draw(miniMapCtx){
        miniMapCtx.clearRect(0,0,this.miniMapWidth, this.miniMapHeight)
        // Draw the player on the mini-map canvas
        miniMapCtx.fillStyle = 'red';
        miniMapCtx.fillRect(
            Math.max(0, Math.min(this.miniMapWidth - this.playerSize, this.playerX * this.mapScale - this.playerSize / 2)),
            Math.max(0, Math.min(this.miniMapHeight - this.playerSize, this.playerY * this.mapScale - this.playerSize / 2)),
            this.playerSize,
            this.playerSize
        );

        // Draw the spaceship on the mini-map canvas
        miniMapCtx.fillStyle = 'blue';
        miniMapCtx.fillRect(
            Math.max(0, Math.min(this.miniMapWidth - this.shipSize, this.shipX * this.mapScale - this.shipSize / 2)),
            Math.max(0, Math.min(this.miniMapHeight - this.shipSize, this.shipY * this.mapScale - this.shipSize / 2)),
            this.shipSize,
            this.shipSize
        );

        //add text information to the map
        miniMapCtx.fillStyle = "rgb(255,255,255)";
        miniMapCtx.textAlign ="center"
        miniMapCtx.font =  '10px Space Grotesk'//'10px Helvetica';
        
        //player info
        miniMapCtx.fillText(`(${this.playerX.toFixed(0)}, ${this.playerY.toFixed(0)})`, 
        this.playerX * this.mapScale - this.playerSize / 2, 
        this.playerY * this.mapScale - this.playerSize / 2)

        //ship info
        miniMapCtx.fillText(`(${this.shipX.toFixed(0)}, ${this.shipY.toFixed(0)})`, 
        this.shipX * this.mapScale - this.shipSize / 2, 
        this.shipY * this.mapScale - this.shipSize / 2)
    }
    update(playerX, playerY, shipX, shipY){
        // set the new player position
        this.playerX = playerX ;
        this.playerY = playerY;

        // set the new ship position
        this.shipX =  shipX;
        this.shipY = shipY;
    }
}