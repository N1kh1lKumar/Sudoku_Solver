#include "../include/SudokuSolver.h"

#include <iostream>

using namespace std;

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


// Solve Sudoku using Backtracking
bool SudokuSolver::solveSudoku()
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

                        if(solveSudoku())
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



// Display total steps taken to solve the Sudoku
void SudokuSolver::displayStatistics()
{
    cout << "Total Attempts : "  << steps  << endl;
}