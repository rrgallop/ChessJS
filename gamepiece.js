// takes 'team', a char either 'w' or 'b'
// pieces are initialized 'off the board', signified
// by location -1,-1
class gamePiece {
    constructor(team){
        let x = -1;
        let y = -1;

        this.x = x;
        this.y = y;
        this.team = team;
        
    }

    moveTo (x,y) {

    }
}

class Pawn extends gamePiece {
    constructor(team){
        super(team);
    }
}

class Bishop extends gamePiece {
    constructor(team) {
        super(team);
    }
}

class Knight extends gamePiece {
    constructor(team) {
        super(team);
    }
}

class Rook extends gamePiece {
    constructor(team){
        super(team);
    }
}

class King extends gamePiece {
    constructor(team){
        super(team);
    }
}

class Queen extends gamePiece {
    constructor(team){
        super(team);
    }
}
