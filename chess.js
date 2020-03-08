

class ChessGame {
    constructor(){
        this.whiteTeam = new Team(this, 1);
        this.blackTeam = new Team(this, 2);
        this.gameBoard = new chessBoard(this);
        this.whitesTurn = true;
        this.turnOver = false;
        this.setBoard();
    }

    setBoard(chessBoard){
        // place pawns
        for (let i = 0; i < 8; i++){
            this.whiteTeam.pawns[i].moveTo(this.gameBoard, i, 6);
        }
        for (let i = 0; i < 8; i++){
            this.blackTeam.pawns[i].moveTo(this.gameBoard, i, 1);
        }
        // place rooks
        this.whiteTeam.rooks[0].moveTo(this.gameBoard, 0, 7);
        this.whiteTeam.rooks[1].moveTo(this.gameBoard, 7, 7);
        this.blackTeam.rooks[0].moveTo(this.gameBoard, 0, 0);
        this.blackTeam.rooks[1].moveTo(this.gameBoard, 7, 0);

        // place knights
        this.whiteTeam.knights[0].moveTo(this.gameBoard, 1, 7);
        this.whiteTeam.knights[1].moveTo(this.gameBoard, 6, 7);
        this.blackTeam.knights[0].moveTo(this.gameBoard, 1, 0);
        this.blackTeam.knights[1].moveTo(this.gameBoard, 6, 0);

        // place bishops
        this.whiteTeam.bishops[0].moveTo(this.gameBoard, 2, 7);
        this.whiteTeam.bishops[1].moveTo(this.gameBoard, 5, 7);
        this.blackTeam.bishops[0].moveTo(this.gameBoard, 2, 0);
        this.blackTeam.bishops[1].moveTo(this.gameBoard, 5, 0);

        // place queen
        this.whiteTeam.queen.moveTo(this.gameBoard, 3, 7);
        this.blackTeam.queen.moveTo(this.gameBoard, 3, 0);

        // place king
        this.whiteTeam.king.moveTo(this.gameBoard, 4, 7);
        this.blackTeam.king.moveTo(this.gameBoard, 4, 0);

        
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
    }

    shadowMoveCheck(gamePiece,x,y){

        let shadowBoard = new chessBoard;
        shadowBoard.shadowWhite = new ShadowTeam(shadowBoard);
        shadowBoard.shadowBlack = new ShadowTeam(shadowBoard);

        shadowBoard.copyBoard(this.gameBoard);

        if (gamePiece.type == 'queen'){
            console.log('farts');
        }

        // get the shadow piece on the shadowboard
        let shadow_startTile = shadowBoard.getTile(gamePiece.x, gamePiece.y);
        let shadowPiece = shadow_startTile.getOccupant();

        // move the shadow piece to the considered position
        shadowPiece.moveTo(shadowBoard, x, y);

        let moveIsSafe = true;
        if (this.whitesTurn){
            moveIsSafe = shadowBoard.shadowBlack.getAllShadowMoves(shadowBoard);
        } else {
            moveIsSafe = shadowBoard.shadowWhite.getAllShadowMoves(shadowBoard);
        }

        return moveIsSafe;
    }

    // send move to shadowboard. shadowboard will make the move, then calculate the movesets of the opposing team.
    // if the king is not present in any of those movesets, then the move is viable, return true.
    // else, if the king is ever added to a moveset of the opposing team, return false, we can't make the move
    // should also return false if a move falls outside the chessboard
    isViableMove(shadowboard, gamePiece, x, y){
        
        if ((0 <= x && x < 8) && (0 <= y && y < 8)){
            
            let moveIsSafe = this.shadowMoveCheck(gamePiece,x,y);
            if (!moveIsSafe){
                return false;
            }else{
                let gotTile = this.gameBoard.getTile(x,y);
                return gotTile;
            }
        }
    }
    
}

class ShadowTeam {
    constructor(board){
        this.king = null;
        this.queen = null;
        this.rooks = Array(2);
        this.bishops = Array(2);
        this.knights = Array(2);
        this.pawns = Array(8);
        this.shadowBoard = board;
    }

    copyTeam(fromTeam){

        let moveTile;
        let i;
        this.king = new King(this);
        this.king.active = fromTeam.king.active;
        this.king.hasMoved = fromTeam.king.hasMoved;
        if (this.king.active){
            this.king.moveTo(this.shadowBoard, fromTeam.king.x, fromTeam.king.y);
        }

        this.queen = new Queen(this);
        this.queen.active = fromTeam.queen.active;
        this.queen.hasMoved = fromTeam.queen.hasMoved;
        if (this.queen.active){
            this.queen.moveTo(this.shadowBoard, fromTeam.queen.x, fromTeam.queen.y);
        }

        for (i = 0; i < fromTeam.rooks.length; i++){
            this.rooks[i] = new Rook(this);
            this.rooks[i].active = fromTeam.rooks[i].active;
            this.rooks[i].hasMoved = fromTeam.rooks[i].hasMoved;
            if (this.rooks[i].active) {
                this.rooks[i].moveTo(this.shadowBoard, fromTeam.rooks[i].x, fromTeam.rooks[i].y);
            }
        }
        for (i = 0; i < fromTeam.bishops.length; i++){
            this.bishops[i] = new Bishop(this);
            this.bishops[i].active = fromTeam.bishops[i].active;
            this.bishops[i].hasMoved = fromTeam.bishops[i].hasMoved;
            if (this.bishops[i].active){
                this.bishops[i].moveTo(this.shadowBoard, fromTeam.bishops[i].x, fromTeam.bishops[i].y);
            }
        }
        for (i = 0; i < fromTeam.knights.length; i++){
            this.knights[i] = new Knight(this);
            this.knights[i].active = fromTeam.knights[i].active;
            this.knights[i].hasMoved = fromTeam.knights[i].hasMoved;
            if (this.knights[i].active){
                this.knights[i].moveTo(this.shadowBoard, fromTeam.knights[i].x, fromTeam.knights[i].y);
            }
           
        }
        for (i = 0; i < fromTeam.pawns.length; i++){
            this.pawns[i] = new Pawn(this);
            this.pawns[i].active = fromTeam.pawns[i].active;
            this.pawns[i].hasMoved = fromTeam.pawns[i].hasMoved;
            if (this.pawns[i].active){
                this.pawns[i].moveTo(this.shadowBoard, fromTeam.pawns[i].x, fromTeam.pawns[i].y);
            }
        } 
        
    }

    
    getAllShadowMoves(shadowboard){
        let moveIsSafe = true;
        if (this.king.active){
            moveIsSafe = this.king.getShadowMoves(shadowboard);
            if (!moveIsSafe){
                return false;
            }
        }
        if (this.queen.active){
            moveIsSafe = this.queen.getShadowMoves(shadowboard);
            if (!moveIsSafe){
                return false;
            }
        }
        if (this.rooks[0].active){
            moveIsSafe = this.rooks[0].getShadowMoves(shadowboard);
            if (!moveIsSafe){
                return false;
            }
        }
        if (this.rooks[1].active){
            moveIsSafe = this.rooks[1].getShadowMoves(shadowboard)
            if (!moveIsSafe){
                return false;
            }
        }
        if (this.bishops[0].active){
            moveIsSafe = this.bishops[0].getShadowMoves(shadowboard);
            if (!moveIsSafe){
                return false;
            }
        }
        if (this.bishops[1].active){
            moveIsSafe = this.bishops[1].getShadowMoves(shadowboard);
            if (!moveIsSafe){
                return false;
            }
        }
        if (this.knights[0].active){    
            moveIsSafe = this.knights[0].getShadowMoves(shadowboard);
            if (!moveIsSafe){
                return false;
            }
        }
        if (this.knights[1].active){    
            moveIsSafe = this.knights[1].getShadowMoves(shadowboard);
            if (!moveIsSafe){
                return false;
            }
        }
        for (let i = 0; i < this.pawns.length; i++){
            if (this.pawns[i].active){
                moveIsSafe = this.pawns[i].getShadowMoves(shadowboard);
                if (!moveIsSafe){
                    return false;
                }
            }
        }

        return moveIsSafe;
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
        if (this.king.active){
            this.king.getMoves();
        }
        if (this.queen.active){
            this.queen.getMoves();
        }
        if (this.rooks[0].active){
            this.rooks[0].getMoves();
        }
        if (this.rooks[1].active){
            this.rooks[1].getMoves();
        }
        if (this.bishops[0].active){
            this.bishops[0].getMoves();
        }
        if (this.bishops[1].active){
            this.bishops[1].getMoves();
        }
        if (this.knights[0].active){
            this.knights[0].getMoves();
        }
        if (this.knights[1].active){
            this.knights[1].getMoves();
        }
        for (let i = 0; i < this.pawns.length; i++){
            if (this.pawns[i].active){
                this.pawns[i].getMoves();
            }
        }
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
        this.shadowWhite = null;
        this.shadowBlack = null;
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

    copyBoard(chessBoard){
        let tileOccupant;
        let shadowOccupant;
        
        let p = 0;
        let b = 0;
        let r = 0;
        let k = 0;

        let pp = 0;
        let bb = 0;
        let rr = 0;
        let kk = 0;
        
        for (let x=0; x < this.tiles.length; x++){
            for (let y=0; y < this.tiles[x].length; y++){
                this.tiles[x][y].x = chessBoard.x;
                this.tiles[x][y].y = chessBoard.y;
                this.tiles[x][y].selected = false;
                // let tile = chessBoard.getTile(x,y);
                // tileOccupant = tile.getOccupant();
                // if (tileOccupant){
                //     if (tileOccupant.type == 'pawn'){
                //         if (tileOccupant.player == 1){
                //             shadowOccupant = this.shadowWhite.pawns[p++];
                //         } else {
                //             shadowOccupant = this.shadowBlack.pawns[pp++];
                //         }
                //         shadowOccupant.moveTo(this, x, y);
                //     }
                //     else if (tileOccupant.type == 'bishop'){
                //         if (tileOccupant.player == 1) {  // white team
                //             shadowOccupant = this.shadowWhite.bishops[b++];
                //         } else {  // black team
                //             shadowOccupant = this.shadowBlack.bishops[bb++];
                //         }
                //         shadowOccupant.moveTo(this, x, y);
                //     }
                //     else if (tileOccupant.type == 'knight'){
                //         if (tileOccupant.player == 1) {  // white team
                //             shadowOccupant = this.shadowWhite.knights[k++];
                //         } else {  // black team
                //             shadowOccupant = this.shadowBlack.knights[kk++];
                //         }
                //         shadowOccupant.moveTo(this, x, y);
                //     }
                //     else if (tileOccupant.type == 'rook'){
                //         if (tileOccupant.player == 1) {  // white team
                //             shadowOccupant = this.shadowWhite.rooks[r++];
                //         } else {  // black team
                //             shadowOccupant = this.shadowBlack.rooks[rr++];
                //         }
                //         shadowOccupant.moveTo(this, x, y);
                //     }
                //     else if (tileOccupant.type == 'king'){
                //         shadowOccupant = new King(tileOccupant.team);
                //         shadowOccupant.moveTo(this, x, y);
                //     }
                //     else if (tileOccupant.type == 'queen'){
                //         shadowOccupant = new Queen(tileOccupant.team);
                //         shadowOccupant.moveTo(this, x, y);
                //     }
                // }
            }
            this.shadowWhite.copyTeam(chessBoard.game.whiteTeam);
            this.shadowBlack.copyTeam(chessBoard.game.blackTeam);
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
        if (occupant = tile.getOccupant()){
            occupant.active = false;
            occupant.clearMoves();
        }
        tile.setOccupant(this);
        
    }

    // moveSet: pass this.shadowCaptures to handle shadowBoard 
    addMove(moveSet, tile){
        let moveOccupant = tile.getOccupant();
        if (moveOccupant){
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
            if (moveTile = this.team.game.isViableMove(shadowboard, this, sx, sy)){
                this.addMove(moveSet, moveTile);
                if (moveTile.getOccupant()){
                    break;
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king);

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            sy += 1;
            if (moveTile = this.team.game.isViableMove(shadowboard, this, sx, sy)){
                this.addMove(moveSet, moveTile);
                if (moveTile.getOccupant()){
                    break;
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king);

        sx = this.x;
        sy = this.y;

        do {
            sx += 1;
            sy -= 1;
            if (moveTile = this.team.game.isViableMove(shadowboard, this, sx, sy)){
                this.addMove(moveSet, moveTile);
                if (moveTile.getOccupant()){
                    break;
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king);

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            sy -= 1;
            if (moveTile = this.team.game.isViableMove(shadowboard, this, sx, sy)){
                this.addMove(moveSet, moveTile);
                if (moveTile.getOccupant()){
                    break;
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king);
    }

    getShadowDiagonalMoves(shadowboard){
        let sx = this.x;
        let sy = this.y;
        let moveTile;
        let occupant;

        do {
            sx += 1;
            sy += 1;
            if (moveTile = shadowboard.getTile(sx, sy)){
                
                if (occupant = moveTile.getOccupant()){
                    if (occupant.king && occupant.team != this.team) {
                        return false;
                    }
                }
            } else continue;
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            sy += 1;
            if (moveTile = shadowboard.getTile(sx, sy)){
                
                if (occupant = moveTile.getOccupant()){
                    if (occupant.king && occupant.team != this.team) {
                        return false;
                    }
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sx += 1;
            sy -= 1;
            if (moveTile = shadowboard.getTile(sx, sy)){
                
                if (occupant = moveTile.getOccupant()){
                    if (occupant.king && occupant.team != this.team) {
                        return false;
                    }
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            sy -= 1;
            if (moveTile = shadowboard.getTile(sx, sy)){
            
                if (occupant = moveTile.getOccupant()){
                    if (occupant.king && occupant.team != this.team) {
                        return false;
                    }
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());
        
        // move is safe
        return true;
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
            if (moveTile = this.team.game.isViableMove(shadowboard, this, sx, sy)) {

                this.addMove(moveSet, moveTile);
                if (moveTile.getOccupant()){
                    break;
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king);

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            if (moveTile = this.team.game.isViableMove(shadowboard, this, sx, sy)) {
                
                this.addMove(moveSet, moveTile);
                if (moveTile.getOccupant()){
                    break;
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king);

        sx = this.x;
        sy = this.y;

        do {
            sy += 1;
            if (moveTile = this.team.game.isViableMove(shadowboard, this, sx, sy)) {
                
                this.addMove(moveSet, moveTile);
                if (moveTile.getOccupant()){
                    break;
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king);

        sx = this.x;
        sy = this.y;

        do {
            sy -= 1;
            if (moveTile = this.team.game.isViableMove(shadowboard, this, sx, sy)) {
                
                this.addMove(moveSet, moveTile);
                if (moveTile.getOccupant()){
                    break;
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king);
    }

    getShadowStraightMoves(shadowboard){
        let sx = this.x;
        let sy = this.y;
        let moveTile;
        let occupant;

        do {
            sx += 1;
            if (moveTile = shadowboard.getTile(sx, sy)) {

                if (occupant = moveTile.getOccupant()){
                    if (occupant.king && occupant.team != this.team) {
                        return false;
                    }
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sx -= 1;
            if (moveTile = shadowboard.getTile(sx, sy)) {
                
                if (occupant = moveTile.getOccupant()){
                    if (occupant.king && occupant.team != this.team) {
                        return false;
                    }
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sy += 1;
            if (moveTile = shadowboard.getTile(sx, sy)) {
                
                if (occupant = moveTile.getOccupant()){
                    if (occupant.king && occupant.team != this.team) {
                        return false;
                    }
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        sx = this.x;
        sy = this.y;

        do {
            sy -= 1;
            if (moveTile = shadowboard.getTile(sx, sy)) {
                
                if (occupant = moveTile.getOccupant()){
                    if (occupant.king && occupant.team != this.team) {
                        return false;
                    }
                }
            }
        } while ((0 <= sx && sx < 8) && (0 <= sy && sy < 8) && !this.king && !moveTile.getOccupant());

        // move is safe
        return true;
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
        this.type = 'pawn';
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
        let moveTile = this.team.game.isViableMove(shadowboard, this, x, y);
        if (moveTile && !shadowboard){
            this.addMove(moveTile);
            if (this.hasMoved == false && !moveTile.getOccupant()) {
                y = y + this.dy;
                if (moveTile = this.team.game.isViableMove(shadowboard, this, x, y)){
                    this.addMove(moveTile);
                }
            }
        }
        
        y = this.y + this.dy;
        x = this.x + dx;
        
        let captureTile = this.team.game.isViableMove(shadowboard, this, x, y);
        this.addCapture(moveSet, captureTile);

        dx = -1;
        x = this.x + dx;

        captureTile = this.team.game.isViableMove(shadowboard, this, x, y);
        this.addCapture(moveSet, captureTile);
    }

    getShadowMoves(shadowboard){
        let x = this.x;
        let y = this.y;
        let dx = 1;

        y = y + this.dy;
        x = x + dx;

        let capture;
        let captureTile = shadowboard.getTile(x,y);
        if (captureTile){
             capture = captureTile.getOccupant();
            if (capture){
                if (capture.king == true && capture.team != this.team) {
                    return false;
                }
            }
        }

        dx = -1;
        x = this.x + dx;
        captureTile = shadowboard.getTile(x,y);
        if (captureTile) {
        capture = captureTile.getOccupant();
            if (capture){
                if (capture.king == true && capture.team != this.team) {
                    return false;
                } 
            }
        }

        // move is safe
        return true;
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
        this.type = 'bishop';
    }

    getMoves(shadowboard=false){
        this.getDiagonalMoves(shadowboard);
    }

    getShadowMoves(shadowboard){
        let moveIsSafe = this.getShadowDiagonalMoves(shadowboard);
        if (!moveIsSafe){
            return false;
        }

        return moveIsSafe;
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
        this.type = 'knight';
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


        if (moveTile = this.team.game.isViableMove(shadowboard, this, sx+2, sy+1)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(shadowboard, this, sx+2, sy-1)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(shadowboard, this, sx-2, sy+1)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(shadowboard, this, sx-2, sy-1)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(shadowboard, this, sx+1, sy+2)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(shadowboard, this, sx+1, sy-2)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(shadowboard, this, sx-1, sy+2)){
            this.addMove(moveSet, moveTile);
        }
        if (moveTile = this.team.game.isViableMove(shadowboard, this, sx-1, sy-2)){
            this.addMove(moveSet, moveTile);
        }

    }

    getShadowMoves(shadowboard){
        let sx = this.x;
        let sy = this.y;
        let moveTile;
        let occupant;

        if (moveTile = shadowboard.getTile(sx+2, sy+1)){
            if (occupant = moveTile.getOccupant()){
                if (occupant.king && occupant.team != this.team) {
                    return false;
                }
            }
        }
        if (moveTile = shadowboard.getTile(sx+2, sy-1)){
            if (occupant = moveTile.getOccupant()){
                if (occupant.king && occupant.team != this.team) {
                    return false;
                }
            }
        }
        if (moveTile = shadowboard.getTile(sx-2, sy+1)){
            if (occupant = moveTile.getOccupant()){
                if (occupant.king && occupant.team != this.team) {
                    return false;
                }
            }
        }
        if (moveTile = shadowboard.getTile(sx-2, sy-1)){
            if (occupant = moveTile.getOccupant()){
                if (occupant.king && occupant.team != this.team) {
                    return false;
                }
            }
        }
        if (moveTile = shadowboard.getTile(sx+1, sy+2)){
            if (occupant = moveTile.getOccupant()){
                if (occupant.king && occupant.team != this.team) {
                    return false;
                }
            }
        }
        if (moveTile = shadowboard.getTile(sx+1, sy-2)){
            if (occupant = moveTile.getOccupant()){
                if (occupant.king && occupant.team != this.team) {
                    return false;
                }
            }
        }
        if (moveTile = shadowboard.getTile(sx-1, sy+2)){
            if (occupant = moveTile.getOccupant()){
                if (occupant.king && occupant.team != this.team) {
                    return false;
                }
            }
        }
        if (moveTile = shadowboard.getTile(sx-1, sy-2)){
            if (occupant = moveTile.getOccupant()){
                if (occupant.king && occupant.team != this.team) {
                    return false;
                }
            }
        }

        // move is safe
        return true;
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
        this.type = 'rook';
    }

    getMoves(shadowboard=false){
        this.getStraightMoves(shadowboard);
    }

    getShadowMoves(shadowboard){
        let moveIsSafe = this.getShadowStraightMoves(shadowboard)
        if (!moveIsSafe){
            return false;
        }

        return moveIsSafe;
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
        this.type = 'king';
    }

    getMoves(shadowboard=false){
        this.getDiagonalMoves(shadowboard);
        this.getStraightMoves(shadowboard);
    }

    getShadowMoves(shadowboard){
        let moveIsSafe = this.getShadowStraightMoves(shadowboard)
        if (!moveIsSafe){
            return false;
        }
        moveIsSafe = this.getShadowDiagonalMoves(shadowboard)
        if (!moveIsSafe){
            return false;
        }

        return moveIsSafe;
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
        this.type = 'queen';
    }

    getMoves(shadowboard=false){
        this.getDiagonalMoves(shadowboard);
        this.getStraightMoves(shadowboard);
    }

    getShadowMoves(shadowboard){
        let moveIsSafe = this.getShadowStraightMoves(shadowboard)
        if (!moveIsSafe){
            return false;
        }
        moveIsSafe = this.getShadowDiagonalMoves(shadowboard)
        if (!moveIsSafe){
            return false;
        }

        return moveIsSafe;
    }
}