import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .split(/\r?\n/)
  .map((row) => row.split(""));

const directions = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
];

const rows = inputData.length;
const cols = inputData[0].length;

const checkWord = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  grid: { [x: number]: { [x: number]: string } },
  word: string
) => {
  for (let i = 0; i < word.length; i++) {
    const nx = x + i * dx;
    const ny = y + i * dy;

    if (
      nx < 0 ||
      ny < 0 ||
      nx >= rows ||
      ny >= cols ||
      grid[ny][nx] !== word[i]
    ) {
      return false;
    }
  }
  return true;
};

function partOne(grid: string[][]) {
  let count = 0;
  const word = "XMAS";

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      for (const [dx, dy] of directions) {
        if (checkWord(x, y, dx, dy, grid, word)) count++;
      }
    }
  }
  return count;
}

function partTwo(grid: string[][]) {
  let count = 0;

  for (let x = 1; x < rows - 1; x++) {
    for (let y = 1; y < cols - 1; y++) {
      if (grid[x][y] === "A") {
        const tlbr =
          (grid[x - 1][y - 1] === "M" && grid[x + 1][y + 1] === "S") ||
          (grid[x - 1][y - 1] === "S" && grid[x + 1][y + 1] === "M");
        const trbl =
          (grid[x - 1][y + 1] === "M" && grid[x + 1][y - 1] === "S") ||
          (grid[x - 1][y + 1] === "S" && grid[x + 1][y - 1] === "M");
        if (tlbr && trbl) count++;
      }
    }
  }
  return count;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
