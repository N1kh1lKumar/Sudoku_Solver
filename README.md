#  Sudoku Solver

A C++ console-based application that solves Sudoku puzzles using the Backtracking Algorithm. The program validates Sudoku rules and automatically finds a valid solution while displaying solving statistics and execution time.

---

##  Features

* Input a 9×9 Sudoku Puzzle
* Represent Sudoku using a 2D Array
* Validate Row Constraints
* Validate Column Constraints
* Validate 3×3 Subgrid Constraints
* Solve Sudoku using Backtracking
* Display Original and Solved Puzzle
* Show Total Solving Attempts
* Measure Execution Time
* User-Friendly Grid Display

---

##  Technologies Used

* C++
* Object-Oriented Programming (OOP)
* Recursion
* Backtracking Algorithm
* 2D Arrays
* Chrono Library (Execution Time Measurement)

---

##  Project Structure

```text
CodeAlpha_Sudoku_Solver/
│
├── include/
│   └── SudokuSolver.h
│
├── src/
│   ├── main.cpp
│   └── SudokuSolver.cpp
│
├── screenshots/
│
└── README.md
```

---

##  Compilation

```bash
g++ src/*.cpp -Iinclude -o sudoku
```

---

##  Run

```bash
./sudoku
```

---

##  Sample Input

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

Use `0` to represent empty cells.

---

##  Sample Output

```text
Solved Sudoku Successfully!

Total Attempts : 24682
Execution Time : 347 us
Status         : Solved
```

---

##  Learning Outcomes

* Backtracking Algorithm
* Recursive Problem Solving
* Constraint Validation
* Grid-Based Data Structures
* Performance Measurement
* Object-Oriented Design

---


##  Author

**Nikhil Kumar**

C++ Programming Project | MIT LICENCE
