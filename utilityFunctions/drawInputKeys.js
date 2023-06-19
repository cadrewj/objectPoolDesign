export default function drawInputKeys(context, input, player, spaceship){
    context.beginPath()
    context.fillStyle = "lime";
    context.font = '10px Helvetica';
    context.fillText("Player Last Input: " + input.lastKey, 20, 20)
    context.fillText("Active State: " + player.currentState.state, 20, 40)

    context.fillText("Ship Last Input: " + input.shipLastKey, 20, 60)
    context.fillText("Active State: " + spaceship.currentState.state, 20, 80)
}