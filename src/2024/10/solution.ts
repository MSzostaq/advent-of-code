import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim();

function findTrails(
  grid: number[][],
  starting: { x: number; y: number },
  part1: boolean
): number {
  const width = grid[0].length,
    height = grid.length;
  const queue: { x: number; y: number }[] = [{ ...starting }];
  const visited = new Set<string>();

  let paths = 0;
  while (queue.length != 0) {
    const current = queue.shift();
    if (current === undefined) break;

    if (grid[current.y][current.x] === 9) {
      paths++;
      continue;
    }

    [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ].forEach((direction) => {
      const position = {
        x: current.x + direction.x,
        y: current.y + direction.y,
      };
      if (
        position.x < 0 ||
        position.x >= width ||
        position.y < 0 ||
        position.y >= height ||
        (visited.has(`${position.x},${position.y}`) && part1) ||
        grid[position.y][position.x] - grid[current.y][current.x] !== 1
      )
        return;

      queue.push(position);
      if (part1) visited.add(`${position.x},${position.y}`);
    });
  }

  return paths;
}

function partOne(input: string) {
  const grid = input
    .split("\n")
    .map((line) => line.split("").map((num) => parseInt(num)));
  const width = grid[0].length,
    height = grid.length;

  let sum = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 0) sum += findTrails(grid, { x, y }, true);
    }
  }
  return sum;
}

function partTwo(input: string) {
  const grid = input
    .split("\n")
    .map((line) => line.split("").map((num) => parseInt(num)));
  const width = grid[0].length,
    height = grid.length;

  let sum = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 0) sum += findTrails(grid, { x, y }, false);
    }
  }
  return sum;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
