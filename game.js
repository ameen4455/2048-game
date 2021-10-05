const game = {
  containerElement: document.getElementsByClassName("container")[0],
  cells: [],
  playable: false,
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
      if (hasMoved) {
        if (number.spawn()) {
          game.playable = true;
        } else {
          alert("GAME OVER!");
        }
      } else {
        game.playable = true;
      }
    }, 500);
  },
};

const number = {
  numbers: [],
  spawn: function () {
    const emptyCellIndex = game.randomEmptyCellIndex();

    if (emptyCellIndex === false) {
      return false;
    }

    const numberElement = document.createElement("div");

    const numberValue = Math.random() > 0.5 ? 2 : 4;

    numberElement.innerText = numberValue;
    numberElement.dataset.value = false;
    numberElement.classList.add("number");

    numberElement.style.top = `${game.cells[emptyCellIndex].top}px`;
    numberElement.style.left = `${game.cells[emptyCellIndex].left}px`;

    game.cells[emptyCellIndex].number = numberElement;

    game.containerElement.append(numberElement);

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

      setTimeout(() => {
        game.containerElement.removeChild(number);
      }, 500);

      const newNumberValue = parseInt(toCell.number.innerText) * 2;
      toCell.number.dataset.value = true;
      toCell.number.innerText = newNumberValue;

      fromCell.number = null;
    }
  },
};

export default game;
