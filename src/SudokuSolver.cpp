#include "../include/SudokuSolver.h"

#include <iostream>

using namespace std;

SudokuSolver::SudokuSolver()
{
    for(int row = 0; row < 9; row++)
    {
        for(int col = 0; col < 9; col++)
            grid[row][col] = 0;
    }
}

// Input Sudoku Grid
void SudokuSolver::inputGrid()
{
    cout << "\nEnter Sudoku Grid (use 0 for empty cells)\n\n";

    for(int i = 0; i < 9; i++)
    {
        for(int j = 0; j < 9; j++)
        {
            cin >> grid[i][j];
        }
    }
}

void SudokuSolver::setGrid(const int values[9][9])
{
    for(int row = 0; row < 9; row++)
    {
        for(int col = 0; col < 9; col++)
            grid[row][col] = values[row][col];
    }
    steps = 0;
}

void SudokuSolver::getGrid(int values[9][9]) const
{
    for(int row = 0; row < 9; row++)
    {
        for(int col = 0; col < 9; col++)
            values[row][col] = grid[row][col];
    }
}

bool SudokuSolver::isValidGrid() const
{
    for(int row = 0; row < 9; row++)
    {
        for(int col = 0; col < 9; col++)
        {
            int value = grid[row][col];
            if(value < 0 || value > 9)
                return false;

            if(value == 0)
                continue;

            for(int index = 0; index < 9; index++)
            {
                if(index != col && grid[row][index] == value)
                    return false;
                if(index != row && grid[index][col] == value)
                    return false;
            }

            int startRow = row - row % 3;
            int startCol = col - col % 3;
            for(int boxRow = startRow; boxRow < startRow + 3; boxRow++)
            {
                for(int boxCol = startCol; boxCol < startCol + 3; boxCol++)
                {
                    if((boxRow != row || boxCol != col) &&
                       grid[boxRow][boxCol] == value)
                        return false;
                }
            }
        }
    }
    return true;
}

// Display Sudoku Grid
void SudokuSolver::printGrid()
{
    cout << "\n+-------+-------+-------+\n";

    for(int i = 0; i < 9; i++)
    {
        cout << "| ";

        for(int j = 0; j < 9; j++)
        {
            if(grid[i][j] == 0)
                cout << ". ";
            else
                cout << grid[i][j] << " ";

            if((j + 1) % 3 == 0)
                cout << "| ";
        }

        cout << endl;

        if((i + 1) % 3 == 0)
            cout << "+-------+-------+-------+\n";
    }
}



// Check if number can be placed safely
bool SudokuSolver::isSafe(int row, int col, int num)
{
    // Check Row
    for(int x = 0; x < 9; x++)
    {
        if(grid[row][x] == num)
            return false;
    }

    // Check Column
    for(int x = 0; x < 9; x++)
    {
        if(grid[x][col] == num)
            return false;
    }

    // Check 3x3 Box
    int startRow = row - row % 3;
    int startCol = col - col % 3;

    for(int i = 0; i < 3; i++)
    {
        for(int j = 0; j < 3; j++)
        {
            if(grid[startRow + i][startCol + j] == num)
                return false;
        }
    }

    return true;
}


bool SudokuSolver::solveRecursive()
{
    for(int row = 0; row < 9; row++)
    {
        for(int col = 0; col < 9; col++)
        {
            steps++;
            if(grid[row][col] == 0)
            {
                for(int num = 1; num <= 9; num++)
                {
                    if(isSafe(row, col, num))
                    {
                        grid[row][col] = num;

                        if(solveRecursive())
                            return true;

                        // Backtrack
                        grid[row][col] = 0;
                    }
                }

                return false;
            }
        }
    }

    return true;
}

// Solve Sudoku using Backtracking
bool SudokuSolver::solveSudoku()
{
    steps = 0;
    if(!isValidGrid())
        return false;
    return solveRecursive();
}

int SudokuSolver::getSteps() const
{
    return steps;
}


// Display total steps taken to solve the Sudoku
void SudokuSolver::displayStatistics()
{
    cout << "Total Attempts : "  << steps  << endl;
}