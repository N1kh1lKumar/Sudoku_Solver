import createSolverModule from "./solver.js";

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
      if (col === 2 || col === 5) input.classList.add("box-right");
      if (row === 2 || row === 5) input.classList.add("box-bottom");
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
        if (!direction) return;

        event.preventDefault();
        const nextRow = Math.max(0, Math.min(8, row + direction[0]));
        const nextCol = Math.max(0, Math.min(8, col + direction[1]));
        const nextCell = container.querySelector(
          '[data-row="' + nextRow + '"][data-col="' + nextCol + '"]'
        );
        if (nextCell) nextCell.focus();
      });
      container.appendChild(input);
    }
  }
}

function hasValidShape(grid) {
  return Array.isArray(grid) && grid.length === 9 &&
    grid.every((row) => Array.isArray(row) && row.length === 9 &&
      row.every((value) => Number.isInteger(value) && value >= 0 && value <= 9));
}

async function solveWithCpp(module, grid) {
  const input = module._malloc(81 * 4);
  const output = module._malloc(81 * 4);
  const steps = module._malloc(4);
  try {
    module.HEAP32.set(grid.flat(), input >> 2);
    const solved = module._solve_sudoku(input, output, steps);
    if (!solved) return null;

    return {
      grid: Array.from({ length: 9 }, (_, row) =>
        Array.from(module.HEAP32.subarray((output >> 2) + row * 9, (output >> 2) + row * 9 + 9))),
      steps: module.HEAP32[steps >> 2]
    };
  } finally {
    module._free(input);
    module._free(output);
    module._free(steps);
  }
}

function setup(module) {
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

  renderGrid(container, Array.from({ length: 9 }, () => Array(9).fill(0)));
  setStatus("C++ solver loaded.", "success");

  solveButton.addEventListener("click", async function () {
    const grid = gridFromInputs(inputs());
    if (!hasValidShape(grid)) {
      setStatus("Invalid Sudoku: enter values from 1 to 9.", "error");
      return;
    }

    solveButton.disabled = true;
    setStatus("Solving with the C++ engine...", "success");
    let result;
    try {
      result = await solveWithCpp(module, grid);
    } catch (error) {
      console.error(error);
      setStatus("The C++ solver failed to process this puzzle. Please refresh and try again.", "error");
      solveButton.disabled = false;
      return;
    }
    solveButton.disabled = false;

    if (result === null) {
      setStatus("Invalid or unsolvable Sudoku.", "error");
      return;
    }

    renderGrid(container, result.grid);
    setStatus("Solved successfully with C++ in " + result.steps + " attempts.", "success");
  });

  clearButton.addEventListener("click", function () {
    renderGrid(container, Array.from({ length: 9 }, () => Array(9).fill(0)));
    status.hidden = true;
  });

  sampleButton.addEventListener("click", function () {
    renderGrid(container, SAMPLE_GRID);
    setStatus("Sample puzzle loaded.", "success");
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const solveButton = document.getElementById("solve-button");
  solveButton.disabled = true;
  try {
    const module = await createSolverModule();
    setup(module);
    solveButton.disabled = false;
  } catch (error) {
    document.getElementById("status").textContent =
      "The C++ solver could not be loaded. Please refresh and try again.";
    document.getElementById("status").className = "status error";
    document.getElementById("status").hidden = false;
    console.error(error);
  }
});
