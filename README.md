# Sudoku Solver

Sudoku Solver is a dual-interface project that solves standard 9x9 Sudoku puzzles with recursive backtracking and constraint validation. The browser app calls the same C++ solver compiled to WebAssembly; it does not contain a separate JavaScript solving algorithm.

- **Browser app:** Enter a puzzle in an interactive grid, validate it, and solve it in your browser using the C++ WebAssembly engine.
- **C++ console app:** Enter a puzzle in the terminal and view the original grid, solved grid, number of attempts, and execution time.

## Live Demo

Open the deployed browser version here:

**[https://n1kh1lkumar.github.io/Sudoku_Solver/](https://n1kh1lkumar.github.io/Sudoku_Solver/)**

The site is deployed automatically to GitHub Pages whenever changes are pushed to `main`.

## Features

- Accepts standard 9x9 Sudoku puzzles.
- Validates values, rows, columns, and 3x3 subgrids.
- Solves puzzles with recursive backtracking.
- Uses the C++ backtracking engine for both the browser and console experiences.
- Reports invalid puzzles separately from valid but unsolvable puzzles.
- Preserves the original browser entries when a puzzle has no solution.
- Displays C++ solving attempts and execution time.
- Provides a responsive, keyboard-friendly browser interface.
- Requires no frontend framework or runtime dependency in the application; Emscripten is used only during deployment to produce the browser WebAssembly build.

## Project Architecture

The project uses one C++ solving engine for both interfaces. The console app links to it natively, while the browser app uses the same code compiled to WebAssembly.

### C++ console application

`src/main.cpp` manages the command-line flow and measures execution time. `SudokuSolver` in `include/SudokuSolver.h` and `src/SudokuSolver.cpp` owns the grid and provides methods to:

1. Read a puzzle from standard input.
2. Check whether a candidate number is safe in a row, column, and 3x3 box.
3. Recursively fill empty cells and backtrack when a candidate fails.
4. Print the grid and solving statistics.

### Browser application

The browser version is split into:

- `index.html` - page structure, controls, and accessibility labels.
- `app.js` - grid rendering, input handling, and the WebAssembly bridge.
- `styles.css` - responsive layout, Sudoku grid styling, states, and controls.
- `src/web_bindings.cpp` - exposes the C++ solver through the `solve_sudoku` WebAssembly function.

During deployment, Emscripten generates `solver.js` and `solver.wasm`. The browser sends the 81-cell grid to that module and renders the result returned by `solve_sudoku`; all solving and validation rules come from `src/SudokuSolver.cpp`.

## Repository Structure

```text
Sudoku_Solver/
├── .github/
│   └── workflows/
│       └── pages.yml          # GitHub Pages deployment workflow
├── include/
│   └── SudokuSolver.h         # C++ solver interface
├── src/
│   ├── main.cpp               # C++ console entry point
│   ├── SudokuSolver.cpp       # C++ validation and backtracking logic
│   └── web_bindings.cpp       # WebAssembly bridge for the browser
├── screenshots/
│   └── test.png               # Project screenshot
├── app.js                     # Browser solver logic
├── index.html                 # Browser app markup
├── styles.css                 # Browser app styles
├── LICENSE
└── README.md
```

## Run the Browser App Locally

The browser app loads generated WebAssembly artifacts, so build them first with Emscripten:

```bash
em++ src/SudokuSolver.cpp src/web_bindings.cpp \
  -Iinclude -O3 \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s ENVIRONMENT=web \
  -s EXPORTED_FUNCTIONS='["_solve_sudoku","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall"]' \
  -o solver.js
```

Then serve the repository with a local static server:

```bash
python3 -m http.server
```

Open the displayed local URL. Opening `index.html` directly with `file://` is not supported because browsers restrict ES modules and WebAssembly loading from local files.

### Browser usage

1. Enter numbers from `1` to `9`; leave empty cells blank.
2. Select **Validate and solve** to send the puzzle to the C++ WebAssembly solver.
3. Use **Load sample** to load the included example puzzle.
4. Use **Clear** to reset the board.

## Build and Run the C++ App

### Requirements

- A C++ compiler with C++11 or newer support.
- Standard C++ library.

### Compile

```bash
g++ -std=c++11 src/main.cpp src/SudokuSolver.cpp -Iinclude -o sudoku
```

### Run

```bash
./sudoku
```

Enter 81 values as nine rows of nine numbers. Use `0` for empty cells.

## Sample Input

```text
5 3 0 0 7 0 0 0 0
6 0 0 1 9 5 0 0 0
0 9 8 0 0 0 0 6 0
8 0 0 0 6 0 0 0 3
4 0 0 8 0 3 0 0 1
7 0 0 0 2 0 0 0 6
0 6 0 0 0 0 2 8 0
0 0 0 4 1 9 0 0 5
0 0 0 0 8 0 0 7 9
```

## Sample Output

```text
Solved Sudoku Successfully!

Total Attempts : 24682
Execution Time : 347 us
Status         : Solved
```

The exact attempt count and execution time depend on the input puzzle and machine.

## Algorithm and Complexity

For each empty cell, the solver tries candidate values from `1` to `9`, checks the Sudoku constraints, and recursively continues. If a candidate leads to a dead end, the solver resets that cell and backtracks.

- **Worst-case time:** exponential in the number of empty cells.
- **Auxiliary space:** `O(E)` recursion depth, where `E` is the number of empty cells, in addition to the 9x9 grid.

## Deployment

The workflow in `.github/workflows/pages.yml` installs Emscripten, compiles `src/SudokuSolver.cpp` and `src/web_bindings.cpp` into `solver.js` and `solver.wasm`, then uploads the repository root as a GitHub Pages artifact. It deploys whenever `main` changes and can also be started manually with GitHub Actions.

## Technologies

- C++11
- JavaScript
- HTML5
- CSS3
- Recursive backtracking
- Constraint validation
- GitHub Actions
- GitHub Pages
- WebAssembly via Emscripten

## Author

**Nikhil Kumar**

## License

This project is distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
