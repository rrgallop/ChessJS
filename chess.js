// want 2 chessboards. one for moves and one to think about moves.
class chessBoard{
    constructor(){        
        let tiles = new Array(8);
        console.log('shithead');
        this.game = game;
        this.tiles = tiles;
        for (let i = 0; i < 8; i++){
            this.tiles[i] = new Array(8);
        }
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                tiles[i][j] = new Tile(i,j);
                let newPawn = new Pawn('w');
                newPawn.moveTo(i,j);
                console.log("we in here");
            }
        }
    }
    getTile(x,y){
        console.log('yep')
    }
}

class Tile {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.occupant = null;
    }
}

class ChessGame {
    constructor(){
        this.game = 'get fucked'
    }
}

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

game = new ChessGame();
gameBoard = new chessBoard(game);