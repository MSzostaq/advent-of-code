import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(""));

function partOne(input: string[][]): number {
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  let y = input.findIndex((row) => row.includes("^"));
  let x = input[y].indexOf("^");
  let directionIndex = 0;
  input[y][x] = ".";

  const visited = input.map((row) => row.map(() => false));
  const rows = input.length;
  const cols = input[0].length;

  function markVisited(x: number, y: number) {
    if (!visited[y][x]) {
      visited[y][x] = true;
    }
  }

  markVisited(x, y);

  while (x >= 0 && x < cols && y >= 0 && y < rows) {
    const nextX = x + directions[directionIndex].x;
    const nextY = y + directions[directionIndex].y;

    if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= rows) {
      break;
    }

    if (input[nextY][nextX] === "#") {
      directionIndex = (directionIndex + 1) % 4;
    } else {
      x = nextX;
      y = nextY;
      markVisited(x, y);
    }
  }

  return visited.flat().filter((cell) => cell).length;
}

console.log("Part 1:", partOne(inputData));
