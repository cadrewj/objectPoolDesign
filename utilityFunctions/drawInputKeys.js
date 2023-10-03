export default function drawInputKeys(context, input, game ){
    context.fillStyle = "lime";
    context.textAlign = "left"
    context.font =  '10px Helvetica';
    context.fillText("Player Last Input: " + input.lastKey, 20, 120)
    context.fillText("Active State: " + game.player.currentState.state, 20, 140)

    context.fillText("Ship Last Input: " + input.shipLastKey, 20, 160)
    context.fillText("Active State: " + game.spaceship.currentState.state, 20, 180)

    context.fillText("Game Last Input: " + input.gameLastKey, 20, 200)
    context.fillText("Game Active State: " + game.currentState.state, 20, 220)
    context.fillText("Debug Mode: " + game.debug, 20, 240)
    // console.log(currentState)
}