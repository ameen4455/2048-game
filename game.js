const WINNING_SCORE = 16;

const game = {
  containerElement: document.getElementsByClassName("container")[0],
  cells: [],
  playable: false,
  won: false,
  directionRoots: {
    UP: [1, 2, 3, 4],
    RIGHT: [4, 8, 12, 16],
    DOWN: [13, 14, 15, 16],
    LEFT: [1, 5, 9, 13],
  },

  init: function () {
    const cellElements = document.getElementsByClassName("cell");
    let cellIndex = 1;

    for (let cellElement of cellElements) {
      game.cells[cellIndex] = {
        element: cellElement,
        top: cellElement.offsetTop,
        left: cellElement.offsetLeft,
        number: null,
      };

      cellIndex++;
    }

    this.playable = true;

    number.spawn();
    number.spawn();
  },

  resetMerged: function () {
    game.cells.forEach(function (cell) {
      if (cell.number) {
        cell.number.dataset.value = false;
      }
    });
  },

  randomEmptyCellIndex: function () {
    let emptyCells = [];

    for (let i = 1; i < this.cells.length; i++) {
      if (this.cells[i].number === null) {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  },

  checkMovesInDirection: function (direction) {
    const roots = this.directionRoots[direction];

    let increment = direction === "RIGHT" || direction === "DOWN" ? -1 : 1;

    increment *= direction === "UP" || direction === "DOWN" ? 4 : 1;

    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      let adjCellIndex = roots[i];
      for (let j = 1; j < 4; j++) {
        const cellIndex = root + j * increment;
        const cell = this.cells[cellIndex];
        const adjCell = this.cells[adjCellIndex];
        if (cell.number && adjCell.number) {
          if (cell.number.innerText === adjCell.number.innerText) {
            return true;
          }
          adjCellIndex = cellIndex;
        } else {
          // Zero exists so possible move in direction
          return true;
        }
      }
    }
    return false;
  },

  checkIfGameLost: function (hasMoved) {
    if (number.spawn(hasMoved) === false) {
      let movesInUp = this.checkMovesInDirection("UP");
      let movesInDown = this.checkMovesInDirection("DOWN");
      let movesInLeft = this.checkMovesInDirection("LEFT");
      let movesInRight = this.checkMovesInDirection("RIGHT");

      return !(movesInUp || movesInDown || movesInRight || movesInLeft);
    }

    return false;
  },

  checkGameStatus: function (hasMoved) {
    if (this.won) {
      alert("Game won!");
      return;
    }

    if (this.checkIfGameLost(hasMoved)) {
      alert("Game lost");
      return;
    } else {
      this.playable = true;
    }
  },

  slide: function (direction) {
    if (!this.playable) {
      return false;
    }
    this.playable = false;

    const roots = this.directionRoots[direction];

    let increment = direction === "RIGHT" || direction === "DOWN" ? -1 : 1;

    increment *= direction === "UP" || direction === "DOWN" ? 4 : 1;

    let hasMoved = false;

    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      for (let j = 1; j < 4; j++) {
        const cellIndex = root + j * increment;
        const cell = this.cells[cellIndex];

        if (cell.number !== null) {
          let moveToCell = null;
          for (let k = j - 1; k >= 0; k--) {
            const foreCellIndex = root + k * increment;
            const foreCell = this.cells[foreCellIndex];

            if (foreCell.number === null) {
              moveToCell = foreCell;
            } else if (foreCell.number.dataset.value === true) {
              break;
            } else if (cell.number.innerText === foreCell.number.innerText) {
              moveToCell = foreCell;
              break;
            } else {
              break;
            }
          }

          if (moveToCell !== null) {
            number.moveTo(cell, moveToCell);
            hasMoved = true;
          }
        }
      }
    }

    this.resetMerged();

    setTimeout(function () {
      game.checkGameStatus(hasMoved);
    }, 500);
  },

  reset: function () {
    document.querySelectorAll(".number").forEach((e) => e.remove());
    number.numbers = [];
    game.cells = [];
    game.playable = false;
    game.won = false;
    game.init()
  },
};

const number = {
  numbers: [],
  spawn: function (shouldSpawn = true) {
    const emptyCellIndex = game.randomEmptyCellIndex();

    if (emptyCellIndex === false) {
      return false;
    }

    if (shouldSpawn) {
      const numberElement = document.createElement("div");

      const numberValue = Math.random() > 0.5 ? 2 : 4;

      numberElement.innerText = numberValue;
      numberElement.dataset.value = false;
      numberElement.classList.add("number");

      numberElement.style.top = `${game.cells[emptyCellIndex].top}px`;
      numberElement.style.left = `${game.cells[emptyCellIndex].left}px`;

      game.cells[emptyCellIndex].number = numberElement;

      game.containerElement.append(numberElement);
    }

    return true;
  },

  moveTo: function (fromCell, toCell) {
    const number = fromCell.number;

    if (toCell.number === null) {
      number.style.top = `${toCell.top}px`;
      number.style.left = `${toCell.left}px`;

      toCell.number = number;
      fromCell.number = null;
    } else if (number.innerText === toCell.number.innerText) {
      number.style.top = `${toCell.top}px`;
      number.style.left = `${toCell.left}px`;

      setTimeout(function () {
        game.containerElement.removeChild(number);
      }, 500);

      const newNumberValue = parseInt(toCell.number.innerText) * 2;
      toCell.number.dataset.value = true;
      toCell.number.innerText = newNumberValue;

      fromCell.number = null;

      if (newNumberValue === WINNING_SCORE) {
        game.won = true;
      }
    }
  },
};

export default game;
