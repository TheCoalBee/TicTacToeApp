const player = (marker) => {
    return { marker };
}

const cell = (index, marker) => {
    return { index, marker };
}

const board = (() => {
    let array = [];
    
    let players = [player("O"), player("X")];
    let currentPlayer = 0;

    const togglePlayer = () => {
        currentPlayer = 1 - currentPlayer;
        currentPlayerDOM();
    }
    const resetBoard = () => {
        for (let i = 0; i < 9; i++) {
            setCell(i, cell(i, null));
        }
        resetBoardDOM();
        togglePlayer();
    }

    // setters
    const setCell = (index, cell) => { array[index] = cell };
    const setMarker = (e) => {
        const i = e.target.id;

        if (getCell(i).marker == null) {
            
            getCell(i).marker = players[currentPlayer].marker;
            setMarkerDOM(i);
            checkWin();
        }
    }

    // getters
    const getCurrentPlayer = () => { return currentPlayer };
    const getCell = (index) => { return array[index] };

    const playerWin = () => {
        // horizontal check
        for (let i = 0; i < 9; i+=3) {
            if ((getCell(i).marker != null) && (getCell(i).marker == getCell(i+1).marker) && getCell(i+1).marker == getCell(i+2).marker) {
                return true;
            }
        }

        // vertical check
        for (let i = 0; i < 3; i++) {
            if ((getCell(i).marker != null) && (getCell(i).marker == getCell(i+3).marker) && (getCell(i+3).marker == getCell(i+6).marker)) {
                return true;
            }
        }

        // diagonal check
        if ((getCell(0).marker != null) && (getCell(0).marker == getCell(4).marker) && (getCell(4).marker == getCell(8).marker)) {
            return true;
        } else if ((getCell(2).marker != null) && (getCell(2).  marker == getCell(4).marker) && (getCell(4).marker == getCell(6).marker)) {
            return true;
        }

        // tie check
        function markerNull(e) {
            return e.marker != null;
        }
        if (array.every(markerNull)) {
            return "tie";
        }

        return false;

    }
    const checkWin = () => {
        if (playerWin() == "tie") {
            gameTieDOM();
            return;
        } else if (playerWin()) {
            playerWinDOM();
            return;
        } else {
            togglePlayer();
            return;
        }
    }

    return { players, getCurrentPlayer, setMarker, getCell, resetBoard };
})();

// Create physical board dom
function createBoardDOM() {
    const boardDOM = document.createElement('div');
        boardDOM.id = "board";
        boardDOM.classList = "board";
        board.resetBoard();

    for (let i = 0; i < 9; i++) {
        const cellDOM = document.createElement('div');
            cellDOM.classList = "cell";
            cellDOM.id = i;
            cellDOM.addEventListener('click', board.setMarker);

            // remove double click highlight
            cellDOM.addEventListener('mousedown', function(e) {
                e.preventDefault();
            }, false);

        boardDOM.append(cellDOM);
    }
    resetBoardDOM();
    currentPlayerDOM();
    document.body.append(boardDOM);
}

// reset board DOM to blank
function resetBoardDOM() {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
        cells[i].addEventListener('click', board.setMarker);
    }
}

function setMarkerDOM(i) {
    const cellDOM = document.getElementById(i);

    if (cellDOM.innerHTML == "") {
        cellDOM.innerHTML = board.players[board.getCurrentPlayer()].marker;
    }
}

// update current player DOM
function currentPlayerDOM() {
    const currentPlayerDOM = document.getElementById('current-player');
    currentPlayerDOM.innerText = `Current player: ${board.players[board.getCurrentPlayer()].marker}`;
}

function gameTieDOM() {
    const currentPlayerDOM = document.getElementById('current-player');
    const playAgainBtn = document.createElement('button');

    playAgainBtn.id = "play-again-btn";

    currentPlayerDOM.innerText = `Game tied.`;
    playAgainBtn.innerText = "Play again?";
    playAgainBtn.addEventListener('click', board.resetBoard);

    currentPlayerDOM.append(playAgainBtn);
}

function playerWinDOM() {
    const cellsDOM = document.getElementsByClassName('cell');
    for (let i = 0; i < cellsDOM.length; i++) {
        cellsDOM[i].removeEventListener('click', board.setMarker);
    }

    const currentPlayerDOM = document.getElementById('current-player');
    const playAgainBtn = document.createElement('button');

    playAgainBtn.id = "play-again-btn";

    currentPlayerDOM.innerText = `Player ${board.players[board.getCurrentPlayer()].marker} wins!`;
    playAgainBtn.innerText = "Play again?";
    playAgainBtn.addEventListener('click', board.resetBoard);

    currentPlayerDOM.append(playAgainBtn);
}

createBoardDOM();