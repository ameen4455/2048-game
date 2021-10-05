import number from "./number.js";

// An object containing the functionalities of the game
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

  // Start the game and initialize spawn 2 tiles
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

  // after each action, reset the merged flag to false
  resetMerged: function () {
    game.cells.forEach(function (cell) {
      if (cell.number) {
        cell.number.dataset.value = false;
      }
    });
  },

  // returns an empty index
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

  // check for possible moves in a given direction
  checkMovesInDirection: function (direction) {
    const roots = this.directionRoots[direction];

    let increment = direction === "RIGHT" || direction === "DOWN" ? -1 : 1;

    increment *= direction === "UP" || direction === "DOWN" ? 4 : 1;

    // start checking from further most end for each row/column
    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      let adjCellIndex = roots[i];

      // checks if the farthest and the adjacent tile are same
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
          // zero exists so movement possible
          return true;
        }
      }
    }
    return false;
  },

  // check if a new tile could be spawned or if movement exist any direction
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

  // check if the game should be further continued
  checkGameStatus: function (hasMoved) {
    if (game.won) {
      alert("Game won!");
      return;
    }

    if (game.checkIfGameLost(hasMoved)) {
      alert("Game lost");
      return;
    } else {
      game.playable = true;
    }
  },

  // slide tile in the given direction
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
            const toCellIndex = root + k * increment;
            const toCell = this.cells[toCellIndex];

            if (toCell.number === null) {
              moveToCell = toCell;
            } else if (toCell.number.dataset.value === true) {
              break;
            } else if (cell.number.innerText === toCell.number.innerText) {
              moveToCell = toCell;
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

  // resets the game
  reset: function () {
    document.querySelectorAll(".number").forEach((e) => e.remove());
    game.cells = [];
    game.playable = false;
    game.won = false;
    game.init();
  },
};

export default game;
