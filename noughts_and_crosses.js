//gameboard object
//player object
function Gameboard() {
    const board = [];
    const size = 3;

    for (let i = 0; i < size; i++){
        board[i]=[];
        for(let j = 0; j < size; j++) {
            board[i].push(Cell());
        }
    };
    const getBoard = () => board;

    const getCell = (row,column) => board[row][column];

    const placePiece = (row,column,player) => {
        board[row][column].setPiece(player)
    };

    const printBoard = () => {
        const boardToPrint = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardToPrint);
    };
    return {printBoard, getBoard, placePiece, getCell};
}

function Cell() {
    let value = "";
    const setPiece = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        setPiece,
        getValue
    };
}

function GameController(
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
){
    const size = 3;
    let round = 1;
    const board = Gameboard();
    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];
    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1]:players[0];
    };
    const getCurrentPlayer = () => currentPlayer;

    const printRound = () => {
        board.printBoard();
    }
    const checkWinner = (row,column) => {
        //check column
        for (let i = 0; i < size; i++) {
            if (board.getCell(row,i).getValue() !== currentPlayer.token) {
                break;
            }
            if (i==size-1){
                return true;
            }
        }
        for (let i = 0; i < size; i++) {
            if (board.getCell(i,column).getValue() !== currentPlayer.token) {
                break;
            } 
            if (i==size-1){
                return true;
            }
        }
        if (row === column) {
            //diag check
            //(0,0),(1,1),(2,2)
            for(let i = 0; i < size; i++) {
                if(board.getCell(i,i).getValue()!==currentPlayer.token) {
                    break
                }
                if (i==size-1){
                    return true;
                }
            }

        }
        if (row+column == size-1) {
            //Check other diag
            //(2,0),(1,1),(0,2)
            for (let i = 0; i < size; i++) {
                if(board.getCell(i,(size-1)-1) !== currentPlayer.token) {
                    break;
                }
                if (i==size-1){
                    return true;
                }
            }
        }
        return false;
    }
    const playRound = (row,column) => {
        if (round > size*size) {
            console.log("The game is a tie");
        }
        //invalid move handling?
        if (board.getCell(row,column).getValue() === "") {
            board.placePiece(row,column,currentPlayer.token);
            round++;
            checkWinner(row,column) ? 
            console.log(`${currentPlayer.name} wins!`) :
            switchPlayer();
        } else {
            console.log("invalid move, try again")
        }
        printRound(); 
    }
    printRound();

    return {
        playRound,
        getCurrentPlayer
    };
}
const game = GameController();

//
game.playRound(0,1);
//
game.playRound(0,0);
//
game.playRound(1,1);
game.playRound(1,0);
//
game.playRound(2,0);
game.playRound(2,1);
//
game.playRound(2,2);
game.playRound(0,2);
//
game.playRound(1,2);
game.playRound(0,0);