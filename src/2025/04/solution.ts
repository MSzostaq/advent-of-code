import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim().split("\n");

function partOne(grid: string[]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let accessibleCount = 0;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === "@") {
        let adjacentRolls = 0;

        for (const [dRow, dCol] of directions) {
          const newRow = row + dRow;
          const newCol = col + dCol;

          if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols &&
            grid[newRow][newCol] === "@"
          ) {
            adjacentRolls++;
          }
        }

        if (adjacentRolls < 4) {
          accessibleCount++;
        }
      }
    }
  }

  return accessibleCount;
}

function partTwo(grid: string[]): number {
  let currentGrid = grid.map((row) => row.split(""));
  let totalRemoved = 0;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  while (true) {
    const accessiblePositions: [number, number][] = [];

    for (let row = 0; row < currentGrid.length; row++) {
      for (let col = 0; col < currentGrid[0].length; col++) {
        if (currentGrid[row][col] === "@") {
          let adjacentRolls = 0;

          for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (
              newRow >= 0 &&
              newRow < currentGrid.length &&
              newCol >= 0 &&
              newCol < currentGrid[0].length &&
              currentGrid[newRow][newCol] === "@"
            ) {
              adjacentRolls++;
            }
          }

          if (adjacentRolls < 4) {
            accessiblePositions.push([row, col]);
          }
        }
      }
    }

    if (accessiblePositions.length === 0) {
      break;
    }

    for (const [row, col] of accessiblePositions) {
      currentGrid[row][col] = ".";
    }

    totalRemoved += accessiblePositions.length;
  }

  return totalRemoved;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
