#include "../include/SudokuSolver.h"
#include <iostream>
#include <chrono>

using namespace std;

int main()
{
    SudokuSolver sudoku;

    sudoku.inputGrid();

    cout << "\nOriginal Sudoku:\n";
    sudoku.printGrid();

    auto start = chrono::high_resolution_clock::now();

    bool solved = sudoku.solveSudoku();

    auto end = chrono::high_resolution_clock::now();

    auto duration =  chrono::duration_cast< chrono::microseconds  >(end - start);

    if(solved)
    {
        cout << "\nSolved Sudoku:\n";

        sudoku.printGrid();

        sudoku.displayStatistics();

        cout << "Execution Time : "<< duration.count()  << " us\n";

        cout << "Status : Solved\n";
    }
    else
    {
        cout << "\nNo Solution Exists!\n";
        cout << "Status : Unsolved\n";
    }

    return 0;
}