export default function drawInputKeys(context, input, shipLastKey, player, spaceship){
    context.beginPath()
    context.fillStyle = "lime";
    context.font = '10px Helvetica';
    context.fillText("Player Last Input: " + input, 20, 20)
    context.fillText("Active State: " + player.currentState.state, 20, 40)

    context.fillText("Ship Last Input: " + shipLastKey, 20, 60)
    context.fillText("Active State: " + spaceship.currentState.state, 20, 80)
}