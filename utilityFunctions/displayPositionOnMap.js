export function displayPositionOnMap(context, player, spaceship, width, height){
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign ="left"
    context.font =  '10px Space Grotesk'//'10px Helvetica';
    context.fillText(`Player Position: ${player.position.x.toFixed(1)}, ${player.position.y.toFixed(1)}`, width - 140, height - 80)
    context.fillText(`Ship Position: ${spaceship.position.x.toFixed(1)}, ${spaceship.position.y.toFixed(1)}`, width - 140, height - 100)

}