// A single box in a gameboard
const Cell = function () {
  const innerValue = "";
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
    chosenCell === "" ? chosenCell.setValue(playerValue) : "";
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
  const activePlayer = player1;

  const board = Gameboard();

  const switchPlayer = function () {
    activePlayer = player1 === activePlayer ? player2 : player1;
    return;
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
    const hasWon = false;
    winPatterns.forEach((pattern) => {
      if (hasWon === true) {
        return;
      }

      pattern.forEach((cell) => {
        let i = 0;
        if (board[cell[0]][cell[1]] === value) {
          i++;
        }
        if (i === 3) {
          hasWon = true;
        }
      });
    });
    if (hasWon === true) {
      return activePlayer;
    }
    switchPlayer();
  };

  const playRound = function (rowNo, columnNo) {
    board.markCell(activePlayer.getValue(), rowNo, columnNo);
    findWinner(activePlayer.getValue());
  };

  return { switchPlayer, playRound };
};

const screenController = function() {
  const startButton = document.querySelector(".start-btn");
  startButton.addEventListener("click", () => {
    GameController();
  })
}
