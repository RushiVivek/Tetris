import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDUDwzboY_C2K6hmcMP0dQm8UJ8WzR5Qys",
  authDomain: "tetris-25a11.firebaseapp.com",
  projectId: "tetris-25a11",
  storageBucket: "tetris-25a11.appspot.com",
  messagingSenderId: "415324876635",
  appId: "1:415324876635:web:2cb3dfd71365a35b9c347e"
};

const app = initializeApp(firebaseConfig);

class piece {
    constructor(label, color) {
        this.label = label;
        this.color = color;
        this.getShape();
        this.center = [0, 0];
    }

    getShape() {
        switch (this.label) {
            case 'I':
                this.shape = [[1, 1, 1, 1]];
                break;
            case 'O':
                this.shape = [[1, 1], [1, 1]];
                break;
            case 'T':
                this.shape = [[1, 1, 1], [0, 1, 0]];
                break;
            case 'S':
                this.shape = [[0, 1, 1], [1, 1, 0]];
                break;
            case 'Z':
                this.shape = [[1, 1, 0], [0, 1, 1]];
                break;
            case 'J':
                this.shape = [[1, 1, 1], [0, 0, 1]];
                break;
            case 'L':
                this.shape = [[1, 1, 1], [1, 0, 0]];
                break;
        }
    }

    rotatePiece(dir) {
        let newPiece = Array.from({length: this.shape[0].length}, () => Array(this.shape.length).fill(0));
        let relX, relY, newX, newY;

        if (dir == "cw") {
            for (let i = 0; i<this.shape[0].length; i++) {
                for (let j = 0; j < this.shape.length; j++) {
                    newPiece[i][j] = this.shape[j][i];
                    relX = this.x - this.center[0];
                    relY = this.y - this.center[1];

                    newX = this.center[0] - relY;
                    newY = this.center[1] - relX;
                }
            }
        } else {
            for (let i = this.shape[0].length; i>=0; i--) {
                for (let j = 0; j < this.shape.length; j++) {
                    newPiece[i][j] = this.shape[j][i];
                    relX = this.x - this.center[0];
                    relY = this.y - this.center[1];

                    newX = this.center[0] + relY;
                    newY = this.center[1] + relX;
                }
            }
        }
        this.shape = newPiece;
        this.x = newX;
        this.y = newY;
        return this;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
}

class board {
    constructor() {
        this.board = new Array(10, 20, 3);
    }

    addPiece(piece) {
        for (let i = 0; i<piece.shape.length; i++) {
            for (let j = 0; j<piece.shape[i].length; j++) {
                if (piece.shape[i][j] == 1) {
                    this.board[piece.x + i][piece.y + j] = [1, piece.color, 0];
                }
            }
        }
    }

    removePiece(piece) {
        for (let i = 0; i<piece.shape.length; i++) {
            for (let j = 0; j<piece.shape[i].length; j++) {
                if (piece.shape[i][j] == 1) {
                    this.board[piece.x + i][piece.y + j] = [0, 0, 0];
                }
            }
        }
    }

    movePiece(piece, x, y) {
        if (this.checkOverLap(piece, [x, y])) {
            return false;
        }
        this.removePiece(piece);
        piece.setPos(x, y);
        this.addPiece(piece);
        return true;
    }

    rotatePiece(piece, dir) {
        let newPiece = piece.rotatePiece(dir);
        if (this.checkOverLap(newPiece)) {
            return false;
        }
        this.removePiece(piece);
        piece = newPiece;
        this.addPiece(piece);
        return true;
    }

    checkOverLap(piece, pos=null) {
        if (!pos) {
            pos = [piece.x, piece.y];
        }
        for (let i = 0; i<piece.shape.length; i++) {
            for (let j = 0; j<piece.shape[i].length; j++) {
                if (piece.shape[i][j] == 1 && this.board[pos[0] + i][pos[1] + j][0] == 1) {
                    return true;
                }
            }
        }
    }
}


// git add .
// git commit -m "message"
// git push -u origin main

// npm run build
// firebase deploy --only hosting:tetris-rushi