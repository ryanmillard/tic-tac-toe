const restartButton = document.getElementById('restart-btn');

let gameEnded = false;
let currentPlayersTurn = 1;

const gameboard = (function() {

    // Grid Layout: 0 - Empty, 1 - Player One, 2 - Player Two
    let grid = [[0,0,0],[0,0,0],[0,0,0]];

    const cellIDToGrid = (cellID) => {return [cellID % 3, Math.floor(cellID/3)]}; //x,y
    const resetGridData = () => grid = [[0,0,0],[0,0,0],[0,0,0]];
    
    const takeTurn = (cellID, playerID) => {
        let [x, y] = cellIDToGrid(cellID);
        grid[y][x] = playerID;
    };
    
    const isCellTaken = (cellID) => {
        let [x, y] = cellIDToGrid(cellID);
        return grid[y][x] !== 0;
    };

    const hasPlayerWon = () => {
        for (let playerID = 1; playerID <= 2; playerID++) {
            for (let x = 0; x < 3; x++) { // Column check
                if (grid[0][x] === playerID && 
                    grid[0][x] === grid[1][x] &&
                    grid[1][x] === grid[2][x]
                ){
                    return playerID;
                }
            }

            for (let y = 0; y < 3; y++) { // Row check
                if (
                    grid[y][0] === playerID &&
                    grid[y][0] === grid[y][1] &&
                    grid[y][1] === grid[y][2]
                ){
                    return playerID;
                }
            }
            
            // Diagonal ( \ )
            if (
                grid[0][0] === playerID &&
                grid[0][0] === grid[1][1] &&
                grid[1][1] === grid[2][2]
            ){
                return playerID;
            }

            // Diagonal ( / )
            if (
                grid[2][0] === playerID &&
                grid[2][0] === grid[1][1] &&
                grid[1][1] === grid[0][2]
            ){
                return playerID;
            }
        }
        return false;
    };

    return {resetGridData, takeTurn, isCellTaken, hasPlayerWon};
})();

const displayController = (function() {
    let gameboardGrid = document.getElementById('gameboard-grid');

    const resetDisplay = () => {
        gameboardGrid.textContent = '';

        for (let i = 0; i < 9; i++) {
            let button = document.createElement('button');
            button.classList.add('gameboard-cell');
            gameboardGrid.appendChild(button);

            button.addEventListener('click', () => gameboardClicked(i));
        }
    };

    const addSymbolToCell = (cellID, playerID) => {
        let cell = gameboardGrid.childNodes[cellID];

        let img = document.createElement('img');
        img.src = `./images/${playerID === 1 ? 'cross' : 'circle'}.svg`;
        img.classList.add('cell-img');
        cell.appendChild(img);
        
        setTimeout(function() {
            img.style.transform = 'scale(1)';
            img.style.filter = 'opacity(100%)';
        }, 1);
    };

    return {resetDisplay, addSymbolToCell};
})();

function setGameStatus(text) {
    let gameStatus = document.getElementById('game-status');
    gameStatus.textContent = text;
}

function gameboardClicked(cellID) {
    if (gameEnded) return;
    if (gameboard.isCellTaken(cellID)) return;

    gameboard.takeTurn(cellID, currentPlayersTurn);
    displayController.addSymbolToCell(cellID, currentPlayersTurn);

    let winningPlayer = gameboard.hasPlayerWon();
    if (winningPlayer) {
        gameEnded = true;
        setGameStatus(`Player ${winningPlayer} has won!`);
    } else {
        currentPlayersTurn = currentPlayersTurn === 1 ? 2 : 1;
        setGameStatus(`Player ${currentPlayersTurn}'s Turn`);
    }
}

function restartGame() {
    gameboard.resetGridData();
    displayController.resetDisplay();
    currentPlayersTurn = 1;
    setGameStatus(`Player ${currentPlayersTurn}'s Turn`);
    gameEnded = false;
}

displayController.resetDisplay();
// displayController.resetDisplay();
// displayController.addSymbolToCell(0,1);

restartButton.addEventListener('click', () => {
    restartGame();
});