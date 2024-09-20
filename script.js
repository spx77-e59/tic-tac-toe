// A single cell in a gameboard
const Cell = function () {
  let innerValue = "";
  let cellNumber = 0;
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
    if(chosenCell.getValue() === ""){
      chosenCell.setValue(playerValue);
      return true;
    }
    return false;
  };

  return { getGameBoard, markCell };
};

// A single player
const Player = function (value) {
  const playerName = "";
  const playerValue = value;
  let playerScore = 0;

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

  const gameBoard = Gameboard();

  const getBoard = function () {
    return gameBoard.getGameBoard();
  };

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
    const board = getBoard();

    const hasWon = winPatterns.some((pattern) =>
      pattern.every(([row, col]) => board[row][col].getValue() === value)
    );

    if (hasWon) {
      getActivePlayer().increaseScore();
      return 1;
    }

    const cellFilled = board
      .flat()
      .filter((cell) => cell.getValue() !== "").length;

    if (cellFilled === 9) {
      return 0;
    }
    return -1;
  };

  const isGameOver = function () {
    const activePlayer = getActivePlayer();
    const playerValue = activePlayer.getValue();
    const result = findWinner(playerValue);

    if (result === 1) {
      console.log(playerValue, "has won!");
      return true;
    }
    if (result === 0) {
      console.log("It's a draw!");
      return true;
    }
    return false;
  };

  const playRound = function (rowNo, columnNo) {
    if (isGameOver()) {
      return;
    }

    const activePlayer = getActivePlayer();
    const playerValue = activePlayer.getValue();

    isMarked = gameBoard.markCell(playerValue, rowNo, columnNo);

    const result = findWinner(playerValue);

    if (result === 1) {
      console.log(playerValue, "has won!");
      return;
    } else if (result === 0) {
      console.log("It's a draw!");
      return;
    } else {
      if(isMarked){
        switchPlayer();
      }
    }
  };

  return { getActivePlayer, playRound, getBoard, isGameOver};
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
        rowElement.appendChild(cellElement);
      }
      gameBoardDiv.appendChild(rowElement);
    }
  };

  updateScreen();

  const clickGameBoardDivHandler = function (e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  };

  gameBoardDiv.addEventListener("click", (e) => {
    clickGameBoardDivHandler(e);
  });
};

ScreenController();
