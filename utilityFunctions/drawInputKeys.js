export default function drawInputKeys(context, input, game ){
    context.fillStyle = "lime";
    context.textAlign ="left"
    context.font =  '10px Nanum Pen Script'//'10px Helvetica';
    context.fillText("Player Last Input: " + input.lastKey, 20, 20)
    context.fillText("Active State: " + game.player.currentState.state, 20, 40)

    context.fillText("Ship Last Input: " + input.shipLastKey, 20, 60)
    context.fillText("Active State: " + game.spaceship.currentState.state, 20, 80)

    context.fillText("Game Last Input: " + input.gameLastKey, 20, 100)
    context.fillText("Game Active State: " + game.currentState.state, 20, 120)
    context.fillText("Debug Mode: " + game.debug, 20, 140)
    // console.log(currentState)
}