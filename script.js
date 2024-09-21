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
    if (chosenCell.getValue() === "") {
      chosenCell.setValue(playerValue);
      return true;
    }
    return false;
  };

  return { getGameBoard, markCell };
};

const Player = function (value) {
  let playerName = "";
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

  const resetScore = function () {
    playerScore = 0;
  };

  return { setName, getName, getValue, getScore, increaseScore, resetScore };
};

const GameController = function () {
  const player1 = Player("X");
  const player2 = Player("O");
  let activePlayer = player1;
  let winningPlayer = null;

  const gameBoard = Gameboard();

  const getBoard = function () {
    return gameBoard.getGameBoard();
  };

  const resetBoard = function () {
    getBoard().forEach((row) => {
      row.forEach((cell) => {
        cell.setValue("");
      });
    });
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
      winningPlayer = activePlayer;
      return true;
    }
    if (result === 0) {
      winningPlayer = null;
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
      winningPlayer = activePlayer;
      return;
    } else if (result === 0) {
      winningPlayer = null;
      return;
    } else {
      if (isMarked) {
        switchPlayer();
      }
    }
  };

  const getPlayers = function () {
    return { player1, player2 };
  };

  const getWinningPlayer = function () {
    return winningPlayer;
  };

  return {
    getActivePlayer,
    playRound,
    getBoard,
    isGameOver,
    getPlayers,
    getWinningPlayer,
    resetBoard,
  };
};

const ScreenController = function () {
  const startButton = document.querySelector(".start-btn");
  const formElement = document.querySelector(".form");
  const warnText = document.querySelector(".warn-text");
  const gameBoardDiv = document.querySelector(".game-board-div");
  const activePlayerText = document.querySelector(".active-player-info-text");
  const scoreDiv = document.querySelector(".score-board-div");
  const p1scoreBoardText = document.querySelector(".p1-score-board-text");
  const p2scoreBoardText = document.querySelector(".p2-score-board-text");
  const winnerText = document.querySelector(".winner-info-text");

  let game = GameController();
  let board = game.getBoard();
  let player1 = game.getPlayers().player1;
  let player2 = game.getPlayers().player2;

  const updateScreen = function () {
    if (game.isGameOver()) {
      const winningPlayer = game.getWinningPlayer();
      if (winningPlayer === null) {
        winnerText.textContent = "Draw";
        setTimeout(() => {
          winnerText.textContent = "";
        }, 2000);
      } else {
        winningPlayer.increaseScore();
        winnerText.textContent = `${winningPlayer.getName()} won!`;
        setTimeout(() => {
          winnerText.textContent = "";
        }, 1000);
      }
      game.resetBoard();
    }
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
    const activePlayerName = game.getActivePlayer().getName();
    activePlayerText.textContent = `${activePlayerName}'s turn`;
    p1scoreBoardText.textContent = `${player1.getName()}:${player1.getScore()}`;
    p2scoreBoardText.textContent = `${player2.getName()}:${player2.getScore()}`;
  };

  const clickGameBoardDivHandler = function (e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  };

  const startGame = function () {
    const p1name = formElement.elements["player1"].value;
    const p2name = formElement.elements["player2"].value;
    if (p1name.length === 0 || p2name.length === 0) {
      warnText.textContent = "Name(s) cannot be blank";
      setTimeout(() => {
        warnText.textContent = "";
      }, 2000);
      return;
    }
    if (p1name === p2name) {
      warnText.textContent = "Names cannot be same";
      setTimeout(() => {
        warnText.textContent = "";
      }, 2000);
      return;
    }

    player1.setName(p1name);
    player2.setName(p2name);

    updateScreen();

    startButton.style.display = "none";
    formElement.style.display = "none";
    gameBoardDiv.style.display = "";
    activePlayerText.style.display = "";
    winnerText.style.display = "";
    scoreDiv.style.display = "";

    gameBoardDiv.addEventListener("click", (e) => {
      clickGameBoardDivHandler(e);
    });
  };

  startButton.addEventListener("click", startGame);
};

ScreenController();
