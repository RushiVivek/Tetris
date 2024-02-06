class Piece {
    constructor(label, color) {
        this.label = label;
        this.color = color;
        this.centers = [[1, 1], [0, 1], [1, 0], [1, 1]];
        this.getShape();
        this.center = 0;
        this.setPos(4, 0);
    }

    getShape() {
        switch (this.label) {
            case 'I':
                this.shape = [[1, 1, 1, 1]];
                this.centers = [[1.5, 0.5], [-0.5, 1.5], [1.5, -0.5], [0.5, 1.5]];
                break;
            case 'O':
                this.shape = [[1, 1], [1, 1]];
                this.centers = [[0.5, 0.5]];
                break;
            case 'T':
                this.shape = [[0, 1, 0], [1, 1, 1]];
                break;
            case 'S':
                this.shape = [[0, 1, 1], [1, 1, 0]];
                break;
            case 'Z':
                this.shape = [[1, 1, 0], [0, 1, 1]];
                break;
            case 'J':
                this.shape = [[1, 0, 0], [1, 1, 1]];
                break;
            case 'L':
                this.shape = [[0, 0, 1], [1, 1, 1]];
                break;
        }
    }

    rotatePiece(dir, board, opp=false) {
        let newPiece = Array(this.shape[0].length).fill().map(() => new Array(this.shape.length).fill(0));
        const oldCenter = this.getCenter();
        const oc = this.center;
        let x, y;

        if (dir == "cw" ? !opp : opp) {
            for (let i = 0; i<this.shape[0].length; i++) {
                for (let j = 0; j < this.shape.length; j++) {
                    newPiece[i][j] = this.shape[this.shape.length - 1 - j][i];
                }
            }
                    
            this.center += 1;

            this.center %= this.centers.length;
            
            x = this.x + oldCenter[0] - this.getCenter()[0];
            y = this.y + oldCenter[1] - this.getCenter()[1];
        
        } else {
            for (let i = this.shape[0].length - 1; i>=0; i--) {
                for (let j = 0; j < this.shape.length; j++) {
                    newPiece[i][j] = this.shape[j][this.shape[0].length - 1 - i];

                }
            }
            this.center -= 1;

            if (this.center < 0) {
                this.center = this.centers.length - 1;
            }
            
            x = this.x + oldCenter[0] - this.getCenter()[0];
            y = this.y + oldCenter[1] - this.getCenter()[1];
        }
        
        const newpiece = new Piece(this.label, this.color);
        newpiece.shape = newPiece;
        newpiece.center = this.center;
        newpiece.setPos(x, y);
        
        if (board.checkOverLap(newpiece)) {
            this.center = oc;
            return false;
        }
        
        this.x = x;
        this.y = y;
        this.shape = newPiece;
        return true;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    getCenter() {
        return this.centers[this.center]
    }
}

class Board {
    constructor() {
        // board size = 20, 10, 2 + 4, 2, 0
        this.board = new Array(24).fill().map(() => new Array(12).fill([0, "Black"]));
        this.board[23] = new Array(12).fill([1, "Grey"]);
        this.board.forEach(column => {
            column[0] = [1, "Grey"];
            column[11] = [1, "Grey"];
        });
        this.score = 0;
    }

    addPiece(piece) {
        for (let i = 0; i<piece.shape.length; i++) {
            for (let j = 0; j<piece.shape[i].length; j++) {
                if (piece.shape[i][j] == 1) {
                    this.board[piece.y + i][piece.x + j] = [1, piece.color];
                }
            }
        }
    }

    removePiece(piece) {
        for (let i = 0; i<piece.shape.length; i++) {
            for (let j = 0; j<piece.shape[i].length; j++) {
                if (piece.shape[i][j] == 1) {
                    this.board[piece.y + i][piece.x + j] = [0, "Black"];
                }
            }
        }
    }

    movePiece(piece, x, y) {
        this.removePiece(piece);
        if (this.checkOverLap(piece, [x, y])) {
            this.addPiece(piece);
            return false;
        }
        piece.setPos(x, y);
        this.addPiece(piece);
        return true;
    }

    movePieceDown(piece) {
        return this.movePiece(piece, piece.x, piece.y + 1);
    }

    movePieceLeft(piece) {
        return this.movePiece(piece, piece.x - 1, piece.y);
    }

    movePieceRight(piece) {
        return this.movePiece(piece, piece.x + 1, piece.y);
    }

    rotatePiece(piece, dir) {
        const n = this;
        const oldp = piece;
        n.removePiece(piece);
        if (piece.rotatePiece(dir, n)) {
            this.removePiece(oldp);
            this.addPiece(piece);
        }
        // this.removePiece(piece);
        // piece.rotatePiece(dir, this);
        // this.addPiece(piece);
    }

    checkOverLap(piece, pos=null) {
        const newBoard = this;
        newBoard.removePiece(piece);
        if (!pos) {
            pos = [piece.x, piece.y];
        }
        for (let i = 0; i<piece.shape.length; i++) {
            for (let j = 0; j<piece.shape[i].length; j++) {
                if ((piece.shape[i][j] == 1) && (newBoard.board[pos[1] + i][pos[0] + j][0] == 1)) {
                    return true;
                }
            }
        }
        return false;
    }

    checkOutOfBounds(piece) {
        for (let i = 0; i<piece.shape.length; i++) {
            for (let j = 0; j<piece.shape[i].length; j++) {
                if (piece.shape[i][j] == 1) {
                    if (this.board[piece.y + i][piece.x + j][0] == 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    updateScore() {
        let num = 0, addscore = 0, prev = -2;
        for (let i = 0; i<this.board.length - 4; i++) {
            if (this.board[i + 3].every((value) => value[0] == 1)) {
                this.board.splice(i + 3, 1);
                let newrow = new Array(12).fill([0, "Black"]);
                newrow[0] = [1, "Grey"];
                newrow[11] = [1, "Grey"];
                this.board.unshift(newrow);
                if (prev == i - 1) {
                    num += 1;
                } else {
                    switch (num) {
                        case 1:
                            addscore += 100;
                            break;
                        case 2:
                            addscore += 300;
                            break;
                        case 3:
                            addscore += 500;
                            break;
                        case 4:
                            addscore += 800;
                            break;
                        default:
                            break;
                    }
                    num = 1;
                }
                prev = i;
            }
        }
        switch (num) {
            case 1:
                addscore += 100;
                break;
            case 2:
                addscore += 300;
                break;
            case 3:
                addscore += 500;
                break;
            case 4:
                addscore += 800;
                break;
            default:
                break;
        }
    }
}


// git add .
// git commit -m "message"
// git push -u origin main

// npm run build
// firebase deploy --only hosting:tetris-rushi

function displayBoard(board, element) {
    size = [element.width / 12, element.height / 21];
    let ctx = element.getContext("2d");
    ctx.clearRect(0, 0, game.width, game.height);
    for (let i = 0; i<board[0].length; i++) {
        for (let j = 0; j<board.length - 3; j++) {
            drawRect([0 + i*size[0], 0 + j*size[1]], size, ctx, board[j + 3][i][1]);
        }
    }
}

function drawRect(initPos, size, ctx, color = "Black") {
    ctx.fillStyle = color;
    ctx.fillRect(initPos[0], initPos[1], size[0], size[1]);
    ctx.strokeStyle = "Black";
    ctx.shadowColor = "White";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shodowBlur = 3;
    for (let i = 0; i < 10; i++) {
        ctx.shodowBlur += 0.25
        ctx.strokeRect(initPos[0], initPos[1], size[0], size[1]);
    }
}

function newPiece() {
    let pieces = ["I", "O", "T", "S", "Z", "J", "L"];
    let colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Cyan"];
    return new Piece(pieces[Math.floor(Math.random() * pieces.length)], colors[Math.floor(Math.random() * colors.length)]);
}


let b = new Board();
let game = document.getElementById('game');
game.width = 396;
game.height = 693;
const fps = 60;
let gameover = false;
let softdrop = false;
let harddrop = false;
let sonicdrop = false;
let left = false;
let right = false;
let rotate = false;
let lockdelay = false;
let p;
let frame = 0;
let lastFrame, prevFrame;


function gameLoop() {
    // perform some animation task here
    frame++;
    console.log(frame);
    if (!p) {
        p = newPiece();
        console.log(p);
        b.addPiece(p);
    } else if (b.checkOverLap(p, [p.x, p.y + 1])) {
        if (p.y == 0) {
            gameover = true;
        }else {
            console.log("overlap");
            prevFrame = null;
            softdrop = false;
            if (!lockdelay) {
                lastFrame = frame;
                lockdelay = true;
            } else if (frame - lastFrame >= fps / 2) {
                b.addPiece(p);
                b.updateScore();
                p = null;
                lastFrame = null;
                lockdelay = false;
            }
        }
    } else {
        if (!prevFrame) {
            prevFrame = frame;
        } else if (frame - prevFrame >= 64) {
            b.movePieceDown(p);
            console.log("movedown");
            prevFrame = null;
        }
    }

    if (softdrop) {
        b.movePieceDown(p);
    }
    if (harddrop) {
        while (b.movePieceDown(p)) {
            displayBoard(b.board, game);
        }
        b.updateScore();
        harddrop = false;
        p = null;
    }
    if (sonicdrop) {
        while (b.movePieceDown(p)) {
            displayBoard(b.board, game);
        }
        sonicdrop = false;
    }
    if (gameover) {
        console.log("gameover");
        b = new Board();
        gameover = false;
        softdrop = false;
        harddrop = false;
        sonicdrop = false;
        left = false;
        right = false;
        rotate = false;
        lockdelay = false;
        p = null;
        frame = 0;
        lastFrame = null, prevFrame = null;
        gameover = false;
    }
    (p) ? b.addPiece(p): () => {};
    displayBoard(b.board, game);

    setTimeout(() => {
      requestAnimationFrame(gameLoop);
    }, 1000 / fps);
}
gameLoop();

document.addEventListener('keydown', event => {

    if (!event.repeat) {
        switch (event.key) {
            case "ArrowDown":
                p ? b.movePieceDown(p) : () => {};
                console.log("down");
                break;

            case "ArrowLeft":
                p ? b.movePieceLeft(p) : () => {};
                console.log("left");
                break;

            case "ArrowRight":
                p ? b.movePieceRight(p) : () => {};
                console.log("right");
                break;
            
            case "d":
                console.log("cw");
                p ? b.rotatePiece(p, "cw") : () => {};
                lockdelay ? lockdelay = false : () => {};
                break;
            
            case "a":
                console.log("acw");
                p ? b.rotatePiece(p, "acw") : () => {};
                lockdelay ? lockdelay = false : () => {};
                break;
            
            case " ":
                console.log("harddrop");
                harddrop = true;
                break;
            
            case "ArrowUp":
                console.log("softdrop");
                softdrop = true;
                break;

            case "Shift":
                console.log("sonicdrop");
                sonicdrop = true;
                break;

            default:
                break;
        }
    }
    event.preventDefault();
}, true);