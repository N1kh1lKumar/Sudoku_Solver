#ifndef SUDOKUSOLVER_H
#define SUDOKUSOLVER_H

class SudokuSolver
{
private:
    int grid[9][9];
    int steps = 0;
    bool solveRecursive();

public:
    SudokuSolver();

    // Input Sudoku Grid
    void inputGrid();

    // Display Sudoku Grid
    void printGrid();

    // Replace the current puzzle with a 9x9 grid
    void setGrid(const int values[9][9]);

    // Copy the current grid into a 9x9 output array
    void getGrid(int values[9][9]) const;

    // Check whether the current puzzle obeys Sudoku constraints
    bool isValidGrid() const;

    // Check if a number can be placed safely
    bool isSafe(int row, int col, int num);

    // Solve Sudoku using Backtracking
    bool solveSudoku();

    // Return the number of visited cells during solving
    int getSteps() const;

    // calculate and display total steps taken to solve the Sudoku
    void displayStatistics();
};

#endif