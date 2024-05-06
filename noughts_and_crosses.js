
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
    let winningCells = [];

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

    const setPlayerName = (index,name) => {
        players[index].name = name;
    }
    const swapTokens = () => {
        const token1 = players[0].token;
        const token2 = players[1].token;
        players[0].token = token2;
        players[1].token = token1;
    }
    const printRound = () => {
        board.printBoard();
    }
    const getWinningCells = () => winningCells;
    const getGameState = () => gameActive;

    const getWinMsg = () => winMsg;

    const checkWinner = (row,column) => {
        //check column
        //console.log(`Row: ${row}, Column: ${column}`)
        for (let i = 0; i < size; i++) {
            if (board.getCell(row,i).getValue() !== currentPlayer.token) {
                winningCells = [];
                break;
            } else {
                winningCells.push(`${row}${i}`);
            }
            if (i==size-1){
                return true;
            }
        }
        for (let i = 0; i < size; i++) {
            if (board.getCell(i,column).getValue() !== currentPlayer.token) {
                winningCells = [];
                break;
            } else {
                winningCells.push(`${i}${column}`);
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
                    winningCells = [];
                    break;
                } else {
                    winningCells.push(`${i}${i}`);
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
                    winningCells = [];
                    break;
                } else {
                    winningCells.push(`${i}${(size-1)-i}`);
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
                console.log(getWinningCells());
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
            //console.log(`${player.name} wins`);
        } else {
            winMsg = "Game is a draw";
            //console.log("draw");
        }
    }
    //printRound();
    const nextGame = () => {
        round = 1;
        winMsg = "";
        winningCells = [];
        //token swap
        swapTokens();
        if (currentPlayer.token !== 'X') switchPlayer();
        board.clearBoard();
        gameActive = true;
    }
    return {
        playRound,
        getCurrentPlayer,
        getPlayer,
        setPlayerName,
        getBoard: board.getBoard,
        getGameState,
        getWinMsg,
        getWinningCells,
        nextGame
    };
}

function ScreenController() {
    const boardDiv = document.querySelector('.board');
    //const turnDiv = document.querySelector('.turn');
    const gameOverModal = document.querySelector('#game-over');
    const preGameModal = document.querySelector('#pre-game')
    const winnerDiv = document.querySelector('.winner');
    const scoreDiv = document.querySelector('.score');

    const player1Div = document.getElementById("p1");
    const player2Div = document.getElementById("p2");

    const newGameBtn = document.querySelector('#restart');
    const clearBtn = document.querySelector('#clear');
    const startBtn = document.querySelector('#start-game');


    let game = GameController();

    const preGame = () => {
        preGameModal.style.display = "block";
    }
    const startGame = () => {
        console.log("starting game")
        const p1Name = document.getElementById('player1-name').value;
        const p2Name = document.getElementById('player2-name').value;

        if(p1Name !== "") {
            console.log("reaching");
            game.setPlayerName(0,p1Name);
        }
        if(p2Name != "") {
            game.setPlayerName(1,p2Name);
        }
        preGameModal.style.display = "none";
        updateScreen();
    }
    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();
        const gameActive = game.getGameState();

        const p1 = game.getPlayer(0);
        const p2 = game.getPlayer(1);
        //turnDiv.textContent = `${currentPlayer.name}'s turn`;
        //scoreDiv.textContent = `${game.getPlayer(0).score} - ${game.getPlayer(1).score}`;
        player1Div.children[0].textContent = `${p1.name}`
        player2Div.children[0].textContent = `${p2.name}`;
        
        player1Div.children[1].textContent = `Token: ${p1.token}`
        player2Div.children[1].textContent = `Token: ${p2.token}`

        player1Div.children[2].textContent = `Score: ${p1.score}`
        player2Div.children[2].textContent = `Score: ${p2.score}`

        if (currentPlayer === p1) {
            player1Div.style.backgroundColor = "green"
            player2Div.style.backgroundColor = "white"
        } else {
            player2Div.style.backgroundColor = "green";
            player1Div.style.backgroundColor = "white"
        }
        //inefficient? recreates entire gameboard every turn
        board.forEach((row,rowIndex) => {
            row.forEach((cell,colIndex) => {
                    //console.log(`row ${rowIndex}`,`column ${colIndex}`);
                    const cellBtn = document.createElement("button");
                    cellBtn.classList.add("cell");
                    cellBtn.dataset.row = rowIndex;
                    cellBtn.dataset.column = colIndex;
                    if(game.getWinningCells().includes(`${rowIndex}${colIndex}`)){
                        cellBtn.style.backgroundColor = "green";
                    } else {
                        cellBtn.style.backgroundColor = "white";
                    }
                    cellBtn.textContent = cell.getValue();
                    
                    boardDiv.appendChild(cellBtn);
            })
        });
        if (!gameActive) {
            //console.log("game is over chump");
            gameOverModal.style.display = "block";
            winnerDiv.textContent = game.getWinMsg();
        }
    }
    const newGame = () => {
        //console.log("game restarting");
        game.nextGame();
        updateScreen();
        gameOverModal.style.display = "none";
    }

    const clearGame = () => {
        game = GameController();
        preGame();
    }

    function clickHandler(e) {
        game.playRound(e.target.dataset.row,e.target.dataset.column);
        updateScreen();
    }
    startBtn.addEventListener("click", startGame);
    newGameBtn.addEventListener("click",newGame);
    clearBtn.addEventListener("click",clearGame);
    //handle end game
    boardDiv.addEventListener("click",clickHandler);
    preGame();
}
ScreenController();
