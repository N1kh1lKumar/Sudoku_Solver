# Sudoku Solver

Sudoku Solver is a dual-interface project that solves standard 9x9 Sudoku puzzles with recursive backtracking and constraint validation.

- **Browser app:** Enter a puzzle in an interactive grid, validate it, and solve it in your browser.
- **C++ console app:** Enter a puzzle in the terminal and view the original grid, solved grid, number of attempts, and execution time.

## Live Demo

Open the deployed browser version here:

**[https://n1kh1lkumar.github.io/Sudoku_Solver/](https://n1kh1lkumar.github.io/Sudoku_Solver/)**

The site is deployed automatically to GitHub Pages whenever changes are pushed to `main`.

## Features

- Accepts standard 9x9 Sudoku puzzles.
- Validates values, rows, columns, and 3x3 subgrids.
- Solves puzzles with recursive backtracking.
- Uses the most constrained empty cell first in the browser solver to reduce unnecessary search.
- Reports invalid puzzles separately from valid but unsolvable puzzles.
- Preserves the original browser entries when a puzzle has no solution.
- Displays C++ solving attempts and execution time.
- Provides a responsive, keyboard-friendly browser interface.
- Requires no frontend framework, build tool, or runtime dependency.

## Project Architecture

The project has a shared algorithmic goal but two independent implementations:

### C++ console application

`src/main.cpp` manages the command-line flow and measures execution time. `SudokuSolver` in `include/SudokuSolver.h` and `src/SudokuSolver.cpp` owns the grid and provides methods to:

1. Read a puzzle from standard input.
2. Check whether a candidate number is safe in a row, column, and 3x3 box.
3. Recursively fill empty cells and backtrack when a candidate fails.
4. Print the grid and solving statistics.

### Browser application

The browser version is split into:

- `index.html` - page structure, controls, and accessibility labels.
- `app.js` - grid rendering, input validation, candidate selection, solving, and status messages.
- `styles.css` - responsive layout, Sudoku grid styling, states, and controls.

The browser solver clones the input grid before solving, so failed attempts do not overwrite the user’s original entries.

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
│   └── SudokuSolver.cpp       # C++ validation and backtracking logic
├── screenshots/
│   └── test.png               # Project screenshot
├── app.js                     # Browser solver logic
├── index.html                 # Browser app markup
├── styles.css                 # Browser app styles
├── LICENSE
└── README.md
```

## Run the Browser App Locally

Because the browser app has no dependencies, open `index.html` directly in a browser:

```bash
xdg-open index.html
```

Alternatively, serve the repository with any static file server and open the displayed local URL.

### Browser usage

1. Enter numbers from `1` to `9`; leave empty cells blank.
2. Select **Validate and solve**.
3. Use **Load sample** to load the included example puzzle.
4. Use **Clear** to reset the board.

## Build and Run the C++ App

### Requirements

- A C++ compiler with C++11 or newer support.
- Standard C++ library.

### Compile

```bash
g++ -std=c++11 src/*.cpp -Iinclude -o sudoku
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

The workflow in `.github/workflows/pages.yml` uploads the repository root as a GitHub Pages artifact and deploys it whenever `main` changes. The workflow can also be started manually with GitHub Actions.

## Technologies

- C++11
- JavaScript
- HTML5
- CSS3
- Recursive backtracking
- Constraint validation
- GitHub Actions
- GitHub Pages

## Author

**Nikhil Kumar**

## License

This project is distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
