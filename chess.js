

class ChessGame {
    constructor(){
        this.whiteTeam = new Team(this, 1);
        this.blackTeam = new Team(this, 2);
        this.gameBoard = new chessBoard(this);
        this.shadowBoard = new chessBoard(this);
        this.whitesTurn = true;
        this.turnOver = false;
        this.setBoard(this.shadowBoard);
    }

    copyBoardState(fromBoard, toBoard){
        let copyTiles = fromBoard.tiles;
        toBoard.tiles = copyTiles;
    }

    setBoard(chessBoard){
        // place pawns
        for (let i = 0; i < 8; i++){
            this.whiteTeam.pawns[i].moveTo(this.shadowBoard, i, 6);
        }
        for (let i = 0; i < 8; i++){
            this.blackTeam.pawns[i].moveTo(this.shadowBoard, i, 1);
        }
        // place rooks
        this.whiteTeam.rooks[0].moveTo(this.shadowBoard, 0, 7);
        this.whiteTeam.rooks[1].moveTo(this.shadowBoard, 7, 7);
        this.blackTeam.rooks[0].moveTo(this.shadowBoard, 0, 0);
        this.blackTeam.rooks[1].moveTo(this.shadowBoard, 7, 0);

        // place knights
        this.whiteTeam.knights[0].moveTo(this.shadowBoard, 1, 7);
        this.whiteTeam.knights[1].moveTo(this.shadowBoard, 6, 7);
        this.blackTeam.knights[0].moveTo(this.shadowBoard, 1, 0);
        this.blackTeam.knights[1].moveTo(this.shadowBoard, 6, 0);

        // place bishops
        this.whiteTeam.bishops[0].moveTo(this.shadowBoard, 2, 7);
        this.whiteTeam.bishops[1].moveTo(this.shadowBoard, 5, 7);
        this.blackTeam.bishops[0].moveTo(this.shadowBoard, 2, 0);
        this.blackTeam.bishops[1].moveTo(this.shadowBoard, 5, 0);

        // place queen
        this.whiteTeam.queen.moveTo(this.shadowBoard, 3, 7);
        this.blackTeam.queen.moveTo(this.shadowBoard, 3, 0);

        // place king
        this.whiteTeam.king.moveTo(this.shadowBoard, 4, 7);
        this.blackTeam.king.moveTo(this.shadowBoard, 4, 0);

        this.copyBoardState(this.shadowBoard, this.gameBoard);
    }

    nextTurn(){
        if (this.whitesTurn){
            this.whitesTurn = false;
            this.whiteTeam.clearMoves();
            this.blackTeam.getAllMoves();
        }
        else {
            this.whitesTurn = true;
            this.blackTeam.clearMoves();
            this.whiteTeam.getAllMoves();
        }
        //this.copyBoardState(gameBoard, shadowBoard);
    }

    shadowMoveCheck(){
        if (this.game.whitesTurn){
            this.blackTeam.getShadowMoves();
        } else {
            // do the opposite
        }
    }

    // send move to shadowboard. shadowboard will make the move, then calculate the movesets of the opposing team.
    // if the king is not present in any of those movesets, then the move is viable, return true.
    // else, if the king is ever added to a moveset of the opposing team, return false, we can't make the move
    // should also return false if a move falls outside the chessboard
    isViableMove(x, y){
        if ((0 <= x && x < 8) && (0 <= y && y < 8)){
            let gotTile = this.gameBoard.getTile(x,y);
            return gotTile;
        }
        
    }
    
    
}

class Team {
    constructor(game, playerNum){
        this.game = game;
        this.player = playerNum;
        this.king = new King(this, game);
        this.queen = new Queen(this, game);
        this.rooks = Array(2);
        this.bishops = Array(2);
        this.knights = Array(2);
        this.pawns = Array(8);
        
        let i;
        
        for (i = 0; i < this.rooks.length; i++){
            this.rooks[i] = new Rook(this, game);
        }
        for (i = 0; i < this.bishops.length; i++){
            this.bishops[i] = new Bishop(this, game);
        }
        for (i = 0; i < this.knights.length; i++){
            this.knights[i] = new Knight(this, game);
        }
        for (i = 0; i < this.pawns.length; i++){
            this.pawns[i] = new Pawn(this, game);
        } 
    }

    getAllMoves(){
        this.king.getMoves();
        this.queen.getMoves();
        this.rooks[0].getMoves();
        this.rooks[1].getMoves();
        this.bishops[0].getMoves();
        this.bishops[1].getMoves();
        this.knights[0].getMoves();
        this.knights[1].getMoves();
        for (let i = 0; i < this.pawns.length; i++){
            this.pawns[i].getMoves();
        }
    }
    // populate the shadowCaptures set of the opposing team.
    // if the king is ever in the opposing team's shadowCaptures set,
    // the move being considered is not viable and can't be added
    getShadowMoves(){
        let shadowboard = true;
        let otherTeam;
        if (this.player == 1) {
            otherTeam = this.game.blackTeam;
        } else {
            otherTeam = this.game.whiteTeam;
        }

        this.king.getMoves(shadowboard);
        if (this.containsKing(this.king, otherTeam)){
            return false;
        }
        this.queen.getMoves(shadowboard);
        this.rooks[0].getMoves(shadowboard);
        this.rooks[1].getMoves(shadowboard);
        this.bishops[0].getMoves(shadowboard);
        this.bishops[1].getMoves(shadowboard);
        this.knights[0].getMoves(shadowboard);
        this.knights[1].getMoves(shadowboard);
        for (let i = 0; i < this.pawns.length; i++){
            this.pawns[i].getMoves();
        }
    }

    containsKing(gamePiece, otherTeam){
        let captures = gamePiece.shadowCaptures;
        for (let i = 0; i < captures.length; i++) {
            if (captures.getOccupant() == otherTeam.king){
                return true;
            }
        }
        
        // king not found
        return false;
    }

    clearMoves(){
        this.king.clearMoves();
        this.queen.clearMoves();
        this.rooks[0].clearMoves();
        this.rooks[1].clearMoves();
        this.bishops[0].clearMoves();
        this.bishops[1].clearMoves();
        this.knights[0].clearMoves();
        this.knights[1].clearMoves();
        for (let i = 0; i < this.pawns.length; i++){
            this.pawns[i].clearMoves();
        }
    }
}


// want 2 chessboards. one for moves and one to think about moves.
class chessBoard{
    constructor(game){
        let tiles = new Array(8);
        this.game = game;
        this.tiles = tiles;
        for (let i = 0; i < 8; i++){
            this.tiles[i] = new Array(8);
        }
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                tiles[i][j] = new Tile(i,j);
                
            }
        }
    }

    getTile(x,y){
        if (0 <= x && x < 8 && 0 <= y && y < 8){
            return this.tiles[x][y];
        } else {
            return null;
        }
    }

}


class Tile {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.occupant = null;
        this.selected = null;
    }
    setOccupant(gamePiece){
        this.occupant = gamePiece;
    }
    getOccupant(){
        return this.occupant;
    }

}


class gamePiece {
    constructor(team){
        let x = -1;
        let y = -1;
        
        this.x = x;                 // int
        this.y = y;                 // int
        this.moves = [];            // array of Tile
        this.captures = [];         // array of Tile
        this.shadowCaptures = [];   // array of Tile
        this.team = team;           // Team
        this.active = true;         // boolean
        this.hasMoved = false;         // boolean
        this.isHeld = false;          // boolean
        this.king = false;
        
    }
    
    moveTo (chessBoard,x,y) {
        let occupant;
        const curTile = chessBoard.getTile(this.x,this.y);
        if (curTile) {
            curTile.setOccupant(null);
        }
        this.x = x;
        this.y = y;
        const tile = chessBoard.getTile(x,y);
        tile.setOccupant(this);
        if (occupant = tile.getOccupant()){
            occupant.active = false;
        }
    }

    // moveSet: pass this.shadowCaptures to handle shadowBoard 
    addMove(moveSet, tile){
        let moveOccupant = tile.getOccupant();
        if (moveOccupant){
            console.log('sorry, occupied')
            if (moveOccupant.team != this.team) {
                moveSet.push(tile);
            }
        } else {
            // this gives me the opportunity to add the move to a different set
            // don't care about moves for the shadowboard
            if (moveSet != this.shadowCaptures){
                this.moves.push(tile);
            }
        }
    }

    clearMoves(){
        this.moves = [];
        this.captures = [];
        this.shadowCaptures = [];
    }

    getDiagonalMoves(shadowboard=false){
        let sx = this.x;
        let sy = this.y;
        let moveTile;
        let mOccupant;
        let moveSet;

        if (shadowboard){
            moveSet = this.shadowCaptures;
        } else {
            moveSet = this.captures;
        }

        do {
            sx += 1;
            sy += 1;
            if (moveTile = this.team.game.isViableMove(sx, sy)){
                
                this.addMove(moveSet, moveTile);
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            sy += 1;
            if (moveTile = this.team.game.isViableMove(sx, sy)){
                
                this.addMove(moveSet, moveTile);
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sx += 1;
            sy -= 1;
            if (moveTile = this.team.game.isViableMove(sx, sy)){
                
                this.addMove(moveSet, moveTile);
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            sy -= 1;
            if (moveTile = this.team.game.isViableMove(sx, sy)){
            
                this.addMove(moveSet, moveTile);
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());
    }

    getStraightMoves(shadowboard=false){
        let sx = this.x;
        let sy = this.y;
        let moveTile;
        let mOccupant;
        let moveSet;
        if (shadowboard){
            moveSet = this.shadowCaptures;
        } else {
            moveSet = this.captures;
        }

        do {
            sx += 1;
            if (moveTile = this.team.game.isViableMove(sx, sy)) {

                this.addMove(moveSet, moveTile);
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            if (moveTile = this.team.game.isViableMove(sx, sy)) {
                
                this.addMove(moveSet, moveTile);
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sy += 1;
            if (moveTile = this.team.game.isViableMove(sx, sy)) {
                
                this.addMove(moveSet, moveTile);
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sy -= 1;
            if (moveTile = this.team.game.isViableMove(sx, sy)) {
                
                this.addMove(moveSet, moveTile);
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());
    }
}

class Pawn extends gamePiece {
    constructor(team){
        super(team);
        if (this.team.player === 1){   // white team
            this.dy = -1;
            this.img = new Image();
            this.img.src = './images/white_pawn.png';
        }
        else {   // black team
            this.dy = 1;
            this.img = new Image();
            this.img.src = './images/black_pawn.png';
        }
    }

    getMoves(shadowboard=false){
        let x = this.x;
        let y = this.y;
        let dx = 1;
        let moveSet;

        if (shadowboard){
            moveSet = this.shadowCaptures;
        } else {
            moveSet = this.captures;
        }

        y = y + this.dy;
        let moveTile = this.team.game.isViableMove(x,y);
        if (moveTile && !shadowboard){
            this.addMove(moveTile);
            if (this.hasMoved == false && !moveTile.getOccupant()) {
                y = y + this.dy;
                if (moveTile = this.team.game.isViableMove(x,y)){
                    this.addMove(moveTile);
                }
            }
        }
        
        y = this.y + this.dy;
        x = this.x + dx;
        
        let captureTile = this.team.game.isViableMove(x,y);
        this.addCapture(moveSet, captureTile);

        dx = -1;
        x = this.x + dx;

        captureTile = this.team.game.isViableMove(x,y);
        this.addCapture(moveSet, captureTile);
    }


    // pawns are a special case when it comes to adding moves
    addMove(tile){
        let moveOccupant = tile.getOccupant();
        if (!moveOccupant){
            this.moves.push(tile);
        }
    }

    addCapture(moveSet, captureTile) {
        let capture;
        if (captureTile){
            if (capture = captureTile.getOccupant()){
                if (capture.team != this.team){
                    moveSet.push(captureTile);
                }
            }
        }
        
    }
}

class Bishop extends gamePiece {
    constructor(team) {
        super(team);
        if (this.team.player === 1){   // white team
            this.img = new Image();
            this.img.src = './images/white_bishop.png';
        }
        else {   // black team
            this.img = new Image();
            this.img.src = './images/black_bishop.png';
        }
    }

    getMoves(shadowboard=false){
        this.getDiagonalMoves(shadowboard);
    }
}

class Knight extends gamePiece {
    constructor(team) {
        super(team);
        if (this.team.player === 1){   // white team
            this.img = new Image();
            this.img.src = './images/white_knight.png';
        }
        else {   // black team
            this.img = new Image();
            this.img.src = './images/black_knight.png';
        }
    }

    getMoves(shadowboard=false){
        let sx = this.x;
        let sy = this.y;
        let moveTile;

        let moveSet;

        if (shadowboard){
            moveSet = this.shadowCaptures;
        } else {
            moveSet = this.captures;
        }


        if (moveTile = this.team.game.isViableMove(sx+2, sy+1)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(sx+2, sy-1)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(sx-2, sy+1)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(sx-2, sy-1)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(sx+1, sy+2)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(sx+1, sy-2)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(sx-1, sy+2)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(sx-1, sy-2)){
            this.addMove(moveSet, moveTile);
        }

    }


}

class Rook extends gamePiece {
    constructor(team){
        super(team);
        if (this.team.player === 1){   // white team
            this.img = new Image();
            this.img.src = './images/white_rook.png';
        }
        else {   // black team
            this.img = new Image();
            this.img.src = './images/black_rook.png';
        }
    }

    getMoves(shadowboard=false){
        this.getStraightMoves(shadowboard);
    }
}

class King extends gamePiece {
    constructor(team){
        super(team);
        if (this.team.player === 1){   // white team
            this.img = new Image();
            this.img.src = './images/white_king.png';
        }
        else {   // black team
            this.img = new Image();
            this.img.src = './images/black_king.png';
        }
        this.king = true;
    }

    getMoves(shadowboard=false){
        this.getDiagonalMoves(shadowboard);
        this.getStraightMoves(shadowboard);
    }
}

class Queen extends gamePiece {
    constructor(team){
        super(team);
        if (this.team.player === 1){   // white team
            this.img = new Image();
            this.img.src = './images/white_queen.png';
        }
        else {   // black team
            this.img = new Image();
            this.img.src = './images/black_queen.png';
        }
    }

    getMoves(shadowboard=false){
        this.getDiagonalMoves(shadowboard);
        this.getStraightMoves(shadowboard);
    }
}