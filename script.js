// A single box in a gameboard
const Cell = function () {
  let innerValue = "";
  const setValue = function (value) {
    innerValue = value;
  };
  const getValue = function () {
    return innerValue;
  };
  return { setValue, getValue };
};

//The gameboard
const Gameboard = function () {
  const row = 3;
  const column = 3;
  const gameboard = [];

  for (let i = 0; i < row; i++) {
    gameboard[i] = [];
    for (let j = 0; j < column; j++) {
      gameboard[i].push(Cell());
    }
  }

  const getGameBoard = function () {
    return gameboard;
  };

  const markCell = function (playerValue, rowNo, columnNo) {
    chosenCell = gameboard[rowNo][columnNo];
    chosenCell.getValue() === "" ? chosenCell.setValue(playerValue) : "";
  };

  return { getGameBoard, markCell };
};

// A single player
const Player = function (value) {
  const playerName = "";
  const playerValue = value;
  const playerScore = 0;

  const setName = function (name) {
    playerName = name;
  };

  const getName = function () {
    return playerName;
  };

  const getValue = function () {
    return playerValue;
  };

  const getScore = function () {
    return playerScore;
  };

  const increaseScore = function () {
    playerScore++;
  };

  return { setName, getName, getValue, getScore, increaseScore };
};

// Game controller
const GameController = function () {
  const player1 = Player("X");
  const player2 = Player("O");
  let activePlayer = player1;

  const board = Gameboard();

  const switchPlayer = function () {
    activePlayer = player1 === activePlayer ? player2 : player1;
  };

  const getActivePlayer = function () {
    return activePlayer;
  };

  const findWinner = function (activePlayerValue) {
    const winPatterns = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
    const value = activePlayerValue;
    let hasWon = false;
    winPatterns.forEach((pattern) => {
      if (hasWon) {
        return;
      }
      let i = 0;
      pattern.forEach((cell) => {
        if (board[cell[0]][cell[1]] === value) {
          i++;
        }
        if (i === 3) {
          hasWon = true;
        }
      });
    });
    if (hasWon) {
      return getActivePlayer().increaseScore();
    }
    switchPlayer();
  };

  const playRound = function (rowNo, columnNo) {
    //
    console.log(getActivePlayer(), getActivePlayer().getValue());
    //
    board.markCell(getActivePlayer().getValue(), rowNo, columnNo);
    switchPlayer();
    // findWinner(getActivePlayer().getValue());
  };

  const getBoard = function () {
    return board.getGameBoard();
  };

  return { getActivePlayer, playRound, getBoard };
};

const ScreenController = function () {
  const startButton = document.querySelector(".start-btn");
  const gameBoardDiv = document.querySelector(".game-board-div");
  const activePlayerText = document.querySelector(".active-player-info-text");
  const winnerText = document.querySelector(".winner-info-text");

  const game = GameController();
  const board = game.getBoard();
  const updateScreen = function () {
    gameBoardDiv.textContent = "";
    for (let i = 0; i < 3; i++) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");
      for (let j = 0; j < 3; j++) {
        const cellElement = document.createElement("button");
        cellElement.classList.add("cell");
        cellElement.dataset.row = i;
        cellElement.dataset.column = j;
        cellElement.textContent = board[i][j].getValue();
        console.log(i, j, board[i][j].getValue());
        rowElement.appendChild(cellElement);
      }
      gameBoardDiv.appendChild(rowElement);
    }
  };

  updateScreen();

  const clickGameBoardDivHandler = function (e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    // const selectedCell = board[selectedRow][selectedColumn];
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  };

  gameBoardDiv.addEventListener("click", (e) => {
    clickGameBoardDivHandler(e);
  });
};

ScreenController();
