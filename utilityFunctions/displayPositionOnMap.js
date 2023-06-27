export function displayPositionOnMap(context, player, spaceship, width, height){

        
    context.beginPath()
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign ="left"
    context.font = '10px Helvetica';
    // context.fillText("Spaceship Position: " + spaceship.position.x,  spaceship.position.y, width - 200, height - 100)
    context.fillText(`Player Position: ${player.position.x.toFixed(1)}, ${player.position.y.toFixed(1)}`, width - 140, height - 80)
    context.fillText(`Ship Position: ${spaceship.position.x.toFixed(1)}, ${spaceship.position.y.toFixed(1)}`, width - 140, height - 100)

}