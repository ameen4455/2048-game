import game from "./game.js";

const WINNING_SCORE = 2048;

const number = {
  // spawn a new tile
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

  // move a tile from one index to another
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

export default number;
