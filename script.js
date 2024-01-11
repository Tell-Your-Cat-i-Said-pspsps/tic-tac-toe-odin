const Player = (name, marker) => {
  const playerName = () => {
    return name;
  };
  const playerMarker = () => {
    return marker;
  };
  return { playerName, playerMarker };
};
const game = (() => {
  const container = document.querySelector(".container");
  const namesArea = document.querySelector(".namesArea");
  const namesInputArea = document.querySelector(".namesInputArea");
  const playerXNameInput = document.querySelector("#playerXName");
  const playerYNameInput = document.querySelector("#playerYName");
  let gameArray = new Array(9);
  const startBtn = document.querySelector(".startBtn");
  const dia = document.querySelector(".dia");
  const gameOverMsg = document.querySelector(".gameOverMsg");
  const restartGameBtn = document.querySelector(".restartGameBtn");
  const closeDiaBtn = document.querySelector(".closeBtn");
  closeDiaBtn.addEventListener("click", () => {
    dia.close();
  });
  restartGameBtn.addEventListener("click", () => {
    startBtn.click();
    dia.close();
  });
  startBtn.addEventListener("click", () => {
    startBtn.textContent = "Reset Game";
    gameArray.fill(null);
    const playerXName = playerXNameInput.value ? playerXNameInput.value : "X";
    const playerYName = playerYNameInput.value ? playerYNameInput.value : "O";
    const playerX = Player(playerXName, "X");
    const playerY = Player(playerYName, "O");
    let displayPlayerXName = document.querySelector(".displayPlayerXName");
    let displayPlayerYName = document.querySelector(".displayPlayerYName");
    if (displayPlayerXName == null && displayPlayerYName == null) {
      displayPlayerXName = document.createElement("p");
      displayPlayerXName.classList.add("displayPlayerXName");
      displayPlayerYName = document.createElement("p");
      displayPlayerYName.classList.add("displayPlayerYName");
    } else {
      displayPlayerXName.classList.remove("turn");
      displayPlayerYName.classList.remove("turn");
    }
    displayPlayerXName.textContent = playerX.playerName();
    displayPlayerYName.textContent = playerY.playerName();
    namesArea.appendChild(displayPlayerXName);
    namesArea.appendChild(displayPlayerYName);
    namesInputArea.style.display = "none";
    let gameGrid = document.querySelector(".game-grid");
    if (gameGrid == null) {
      gameGrid = document.createElement("div");
      gameGrid.classList.add("game-grid");
      container.append(gameGrid);
    } else {
      gameGrid.innerHTML = "";
    }

    function check(start, step, end, currentValue) {
      if (currentValue == start && gameArray[currentValue] !== null) {
        if (check(start, step, end, currentValue + step)) {
          return true;
        }
      } else if (currentValue < end && currentValue > start) {
        if (
          gameArray[currentValue] !== null &&
          gameArray[currentValue] === gameArray[currentValue - step]
        ) {
          if (check(start, step, end, currentValue + step)) {
            return true;
          }
        }
      } else if (
        currentValue == end &&
        gameArray[currentValue] == gameArray[currentValue - step]
      ) {
        return true;
      }
      return false;
    }

    let someoneWon = false;
    let winner;
    const checkForWinner = function () {
      //check rows
      for (let i = 0; i <= 6; i += 3) {
        if (check(i, 1, i + 2, i)) {
          someoneWon = true;
          winner = currentPlayer;
        }
      }
      //check columns
      for (let j = 0; j < 3; j++) {
        if (check(j, 3, j + 6, j)) {
          someoneWon = true;
          winner = currentPlayer;
        }
      }
      if (check(0, 4, 8, 0) || check(2, 2, 6, 2)) {
        someoneWon = true;
        winner = currentPlayer;
      }
    };
    function isDraw() {
      if (
        gameArray.some((value) => {
          if (value === null) {
            return true;
          }
        })
      ) {
        return false;
      } else {
        return true;
      }
    }
    let currentPlayer = playerX;
    displayPlayerXName.classList.add("turn");
    function cellClickFunction(i, cell) {
      if (gameArray[i] == null) {
        if (!someoneWon) {
          gameArray[i] = currentPlayer.playerMarker();
          cell.textContent = currentPlayer.playerMarker();
          checkForWinner();
          if (!someoneWon) {
            if (currentPlayer == playerX) {
              currentPlayer = playerY;
            } else {
              currentPlayer = playerX;
            }
            displayPlayerXName.classList.toggle("turn");
            displayPlayerYName.classList.toggle("turn");
          }
          if (someoneWon || isDraw()) {
            gameOver();
          }
        }
      }
    }

    function gameOver() {
      if (someoneWon) {
        gameOverMsg.textContent = `Congratz ${currentPlayer.playerName()} You Won!`;
        dia.showModal();
      } else if (isDraw()) {
        gameOverMsg.textContent = "It's a Draw";
        dia.showModal();
      }
    }
    for (let i = 0; i < 9; i++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => {
        cellClickFunction(i, cell);
      });
      gameGrid.appendChild(cell);
    }
  });
})();
