#ifndef SUDOKUSOLVER_H
#define SUDOKUSOLVER_H

class SudokuSolver
{
private:
    int grid[9][9];
    int steps = 0;

public:
    // Input Sudoku Grid
    void inputGrid();

    // Display Sudoku Grid
    void printGrid();

    // Check if a number can be placed safely
    bool isSafe(int row, int col, int num);

    // Solve Sudoku using Backtracking
    bool solveSudoku();

    // calculate and display total steps taken to solve the Sudoku
    void displayStatistics();
};

#endif