#include "../include/SudokuSolver.h"

#include <emscripten/emscripten.h>

extern "C"
{
    EMSCRIPTEN_KEEPALIVE int solve_sudoku(
        const int* input,
        int* output,
        int* steps)
    {
        int grid[9][9];
        for(int row = 0; row < 9; row++)
        {
            for(int col = 0; col < 9; col++)
                grid[row][col] = input[row * 9 + col];
        }

        SudokuSolver solver;
        solver.setGrid(grid);
        if(!solver.solveSudoku())
            return 0;

        solver.getGrid(grid);
        for(int row = 0; row < 9; row++)
        {
            for(int col = 0; col < 9; col++)
                output[row * 9 + col] = grid[row][col];
        }
        *steps = solver.getSteps();
        return 1;
    }
}
