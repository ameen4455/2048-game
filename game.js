const number = {
  numbers: [],
  spawn: function () {
    const emptyCellIndex = game.randomEmptyCellIndex();

    if (emptyCellIndex === false) {
      return false;
    }

    const numberElement = document.createElement("div");
    const numberValue = 2;

    numberElement.innerText = numberValue;
    numberElement.dataset.value = numberValue;
    numberElement.classList.add("number");

    numberElement.style.top = `${game.cells[emptyCellIndex].top}px`;
    numberElement.style.left = `${game.cells[emptyCellIndex].left}px`;

    game.cells[emptyCellIndex].number = numberElement;

    game.containerElement.append(numberElement);

    return true;
  },
};

const game = {
  containerElement: document.getElementsByClassName("container")[0],
  cells: [],
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

    number.spawn()
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
};

export default game;
