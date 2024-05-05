
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
    const clearBoard = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                board[i][j].setPiece("");
            }
        }
    }
    const printBoard = () => {
        const boardToPrint = board.map((row) => row.map((cell) => cell.getValue()));
        //console.log(boardToPrint);
    };
    return {
        printBoard, 
        getBoard, 
        placePiece, 
        getCell,
        clearBoard
    };
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
    let gameActive = true;

    const size = 3;
    let round = 1;
    const board = Gameboard();
    let winMsg = "";

    const players = [
        {
            name: playerOneName,
            token: "X",
            score: 0
        },
        {
            name: playerTwoName,
            token: "O",
            score: 0
        }
    ];
    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1]:players[0];
    };
    const getCurrentPlayer = () => currentPlayer;
    const getPlayer = (index) => players[index];
    const printRound = () => {
        board.printBoard();
    }
    const getGameState = () => gameActive;

    const getWinMsg = () => winMsg;

    const checkWinner = (row,column) => {
        //check column
        //console.log(`Row: ${row}, Column: ${column}`)
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
                    break;
                }
                if (i==size-1){
                    //console.log("diag win")
                    return true;
                }
            }

        }
        
        if (parseInt(row) + parseInt(column) === (size-1)) {
            //console.log(row,column);
            //Check other diag
            //(2,0),(1,1),(0,2)
            for (let i = 0; i < size; i++) {
                if(board.getCell(i,(size-1)-i).getValue() !== currentPlayer.token) {
                    break;
                }
                if (i==size-1){
                    //console.log("reached");
                    return true;
                }
            }
        }
        return false;
    }

    const playRound = (row,column) => {
        
        //invalid move handling?
        if (board.getCell(row,column).getValue() === "") {
            board.placePiece(row,column,currentPlayer.token);
            round++;
            //handle wins
            if (checkWinner(row,column)) {
                endGame(currentPlayer);
                //console.log(`${currentPlayer.name} wins!`)
            } else {
                //continue game
                switchPlayer();
            }
        }
        //handle draws
        if (round > size*size && gameActive) {
            endGame();
        }
    }

    const endGame =  (player) => {
        //console.log(player);
        gameActive = false;
        if (player) {
            player.score++;
            winMsg = `${player.name} Wins`;
            console.log(`${player.name} wins`);
        } else {
            winMsg = "Game is a draw";
            //console.log("draw");
        }
    }
    //printRound();
    const nextGame = () => {
        round = 1;
        winMsg = "";
        currentPlayer = players[0];
        board.clearBoard();
        gameActive = true;
    }
    return {
        playRound,
        getCurrentPlayer,
        getPlayer,
        getBoard: board.getBoard,
        getGameState,
        getWinMsg,
        nextGame
    };
}

function ScreenController() {
    let game = GameController("Jerry","Terry");

    const boardDiv = document.querySelector('.board');
    const turnDiv = document.querySelector('.turn');
    const modal = document.querySelector('.modal');
    const winnerDiv = document.querySelector('.winner');
    const scoreDiv = document.querySelector('.score');

    const newGameBtn = document.querySelector('#restart');
    const clearBtn = document.querySelector('#clear');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();
        const gameActive = game.getGameState();

        turnDiv.textContent = `${currentPlayer.name}'s turn`;
        scoreDiv.textContent = `${game.getPlayer(0).score} - ${game.getPlayer(1).score}`;
        //inefficient, recreates entire gameboard every turn
        board.forEach((row,rowIndex) => {
            row.forEach((cell,colIndex) => {
                    //console.log(`row ${rowIndex}`,`column ${colIndex}`);
                    const cellBtn = document.createElement("button");
                    cellBtn.classList.add("cell");
                    cellBtn.dataset.row = rowIndex;
                    cellBtn.dataset.column = colIndex;
                    cellBtn.textContent = cell.getValue();
                    boardDiv.appendChild(cellBtn);
            })
        });
        if (!gameActive) {
            //console.log("game is over chump");
            modal.style.display = "block";
            winnerDiv.textContent = game.getWinMsg();
        }
    }
    const newGame = () => {
        //console.log("game restarting");
        game.nextGame();
        updateScreen();
        modal.style.display = "none";
    }

    const clearGame = () => {
        game = GameController();
        updateScreen();
    }

    function clickHandler(e) {
        game.playRound(e.target.dataset.row,e.target.dataset.column);
        updateScreen();
    }

    newGameBtn.addEventListener("click",newGame);
    clearBtn.addEventListener("click",clearGame);
    //handle end game
    boardDiv.addEventListener("click",clickHandler);
    updateScreen();
}
ScreenController();
