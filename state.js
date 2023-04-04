const states ={
    THRUSTING: 0,
    ROTATE_LEFT: 1,
    ROTATE_RIGHT: 2,
    REVERSE_THRUST: 3,
    SHOOTING: 4,
    SHIP_ABILITY: 5,
    ENTER_PLANET: 6,
    PAUSE_GAME: 7
}

class State {
    constructor(state){
        this.state = state
    }
}

class Thrusting extends State{
    constructor(spaceship){
        super("THRUSTING")
        this.spaceship = spaceship; 
    }
    pressed(){

    }
    handleInput(input){

    }

}

class RotateRight extends State{
    constructor(spaceship){
        super("ROTATE_RIGHT")
        this.spaceship = spaceship; 
    }
    pressed(){

    }
    handleInput(input){
        if(input === "PRESSED RIGHT"){
            
        }
        
    }

}

class RotateLeft extends State{
    constructor(spaceship){
        super("ROTATE_LEFT")
        this.spaceship = spaceship; 
    }
    pressed(){

    }
    handleInput(input){
        if(input === "PRESSED LEFT"){

        }
        
    }

}

class RevereThrusting extends State{
    constructor(spaceship){ 
        super("REVERSE_THRUST")
        this.spaceship = spaceship; 
    }
    pressed(){

    }
    handleInput(input){

    }

}