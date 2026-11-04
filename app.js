(function () {
  "use strict";

  const SAMPLE_GRID = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  function cloneGrid(grid) {
    return grid.map(function (row) { return row.slice(); });
  }

  function isValidGrid(grid) {
    if (!Array.isArray(grid) || grid.length !== 9) {
      return false;
    }

    for (let row = 0; row < 9; row += 1) {
      if (!Array.isArray(grid[row]) || grid[row].length !== 9) {
        return false;
      }

      for (let col = 0; col < 9; col += 1) {
        const value = grid[row][col];
        if (!Number.isInteger(value) || value < 0 || value > 9) {
          return false;
        }
      }
    }

    for (let index = 0; index < 9; index += 1) {
      if (hasDuplicate(grid[index])) {
        return false;
      }

      const column = grid.map(function (row) { return row[index]; });
      if (hasDuplicate(column)) {
        return false;
      }
    }

    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const box = [];
        for (let row = boxRow; row < boxRow + 3; row += 1) {
          for (let col = boxCol; col < boxCol + 3; col += 1) {
            box.push(grid[row][col]);
          }
        }
        if (hasDuplicate(box)) {
          return false;
        }
      }
    }

    return true;
  }

  function hasDuplicate(values) {
    const seen = new Set();
    for (const value of values) {
      if (value !== 0) {
        if (seen.has(value)) {
          return true;
        }
        seen.add(value);
      }
    }
    return false;
  }

  function solveGrid(grid) {
    const solved = cloneGrid(grid);

    if (!isValidGrid(solved)) {
      return null;
    }

    function solve() {
      let emptyCell = null;
      let candidates = null;

      for (let row = 0; row < 9; row += 1) {
        for (let col = 0; col < 9; col += 1) {
          if (solved[row][col] === 0) {
            const cellCandidates = getCandidates(solved, row, col);
            if (cellCandidates.length === 0) {
              return false;
            }
            if (candidates === null || cellCandidates.length < candidates.length) {
              emptyCell = [row, col];
              candidates = cellCandidates;
            }
          }
        }
      }

      if (emptyCell === null) {
        return true;
      }

      const row = emptyCell[0];
      const col = emptyCell[1];
      for (const candidate of candidates) {
        solved[row][col] = candidate;
        if (solve()) {
          return true;
        }
      }
      solved[row][col] = 0;
      return false;
    }

    return solve() ? solved : null;
  }

  function getCandidates(grid, row, col) {
    const used = new Set();
    for (let index = 0; index < 9; index += 1) {
      used.add(grid[row][index]);
      used.add(grid[index][col]);
    }

    const boxRow = row - (row % 3);
    const boxCol = col - (col % 3);
    for (let boxRowIndex = boxRow; boxRowIndex < boxRow + 3; boxRowIndex += 1) {
      for (let boxColIndex = boxCol; boxColIndex < boxCol + 3; boxColIndex += 1) {
        used.add(grid[boxRowIndex][boxColIndex]);
      }
    }

    const candidates = [];
    for (let value = 1; value <= 9; value += 1) {
      if (!used.has(value)) {
        candidates.push(value);
      }
    }
    return candidates;
  }

  function gridFromInputs(inputs) {
    return Array.from({ length: 9 }, function (_, row) {
      return Array.from({ length: 9 }, function (_, col) {
        const value = inputs[row * 9 + col].value.trim();
        return value === "" || value === "0" ? 0 : Number(value);
      });
    });
  }

  function renderGrid(container, grid) {
    container.innerHTML = "";
    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        const input = document.createElement("input");
        input.className = "cell";
        if (col === 2 || col === 5) {
          input.classList.add("box-right");
        }
        if (row === 2 || row === 5) {
          input.classList.add("box-bottom");
        }
        input.type = "text";
        input.inputMode = "numeric";
        input.maxLength = 1;
        input.value = grid[row][col] === 0 ? "" : grid[row][col];
        input.dataset.row = row;
        input.dataset.col = col;
        input.setAttribute("aria-label", "Row " + (row + 1) + ", column " + (col + 1));
        input.setAttribute("role", "gridcell");
        input.setAttribute("aria-keyshortcuts", "ArrowUp ArrowDown ArrowLeft ArrowRight");
        input.addEventListener("input", function () {
          input.value = input.value.replace(/[^1-9]/g, "").slice(0, 1);
          input.classList.remove("is-invalid");
        });
        input.addEventListener("keydown", function (event) {
          const directions = {
            ArrowUp: [-1, 0],
            ArrowDown: [1, 0],
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1]
          };
          const direction = directions[event.key];
          if (!direction) {
            return;
          }

          event.preventDefault();
          const nextRow = Math.max(0, Math.min(8, row + direction[0]));
          const nextCol = Math.max(0, Math.min(8, col + direction[1]));
          const nextCell = container.querySelector(
            '[data-row="' + nextRow + '"][data-col="' + nextCol + '"]'
          );
          if (nextCell) {
            nextCell.focus();
          }
        });
        container.appendChild(input);
      }
    }
  }

  function setup() {
    const container = document.getElementById("sudoku-grid");
    const status = document.getElementById("status");
    const solveButton = document.getElementById("solve-button");
    const clearButton = document.getElementById("clear-button");
    const sampleButton = document.getElementById("sample-button");

    function setStatus(message, type) {
      status.textContent = message;
      status.className = "status " + type;
      status.hidden = false;
    }

    function inputs() {
      return Array.from(container.querySelectorAll(".cell"));
    }

    function clearInvalidState() {
      inputs().forEach(function (input) { input.classList.remove("is-invalid"); });
    }

    renderGrid(container, Array.from({ length: 9 }, function () { return Array(9).fill(0); }));

    solveButton.addEventListener("click", function () {
      clearInvalidState();
      const cells = inputs();
      const grid = gridFromInputs(cells);

      if (!isValidGrid(grid)) {
        setStatus("Invalid Sudoku: remove duplicate or out-of-range entries.", "error");
        return;
      }

      const solved = solveGrid(grid);
      if (solved === null) {
        setStatus("This Sudoku is valid so far, but it cannot be solved.", "error");
        return;
      }

      renderGrid(container, solved);
      setStatus("Solved successfully.", "success");
    });

    clearButton.addEventListener("click", function () {
      renderGrid(container, Array.from({ length: 9 }, function () { return Array(9).fill(0); }));
      status.hidden = true;
      clearInvalidState();
    });

    sampleButton.addEventListener("click", function () {
      renderGrid(container, SAMPLE_GRID);
      setStatus("Sample puzzle loaded.", "success");
    });
  }

  const api = {
    SAMPLE_GRID: SAMPLE_GRID,
    isValidGrid: isValidGrid,
    solveGrid: solveGrid
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    window.SudokuSolver = api;
    document.addEventListener("DOMContentLoaded", setup);
  }
}());
