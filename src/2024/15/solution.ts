import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

type Point = { x: number; y: number };

const DIRECTIONS: { [key: string]: Point } = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};

function partOne(input: string) {
  const parts = input
    .trim()
    .split("\n\n")
    .map((lines) => lines.split("\n"));
  const grid = parts[0].map((line) => line.split(""));
  const instructions = parts[1].join("");
  const width = grid[0].length,
    height = grid.length;

  const moveBox = (position: Point, direction: Point): boolean => {
    const next = { x: position.x + direction.x, y: position.y + direction.y };

    if (grid[next.y][next.x] === ".") {
      let temp = grid[position.y][position.x];
      grid[position.y][position.x] = grid[next.y][next.x];
      grid[next.y][next.x] = temp;
      return true;
    } else if (grid[next.y][next.x] === "#") {
      return false;
    } else {
      if (moveBox(next, direction)) {
        let temp = grid[position.y][position.x];
        grid[position.y][position.x] = grid[next.y][next.x];
        grid[next.y][next.x] = temp;
        return true;
      }
    }

    return false;
  };

  let robot = { x: 0, y: 0 };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === "@") {
        robot = { x, y };
        grid[y][x] = ".";
      }
    }
  }

  for (let i = 0; i < instructions.length; i++) {
    const direction = DIRECTIONS[instructions[i]];
    const position = { x: robot.x + direction.x, y: robot.y + direction.y };

    if (grid[position.y][position.x] !== "#") {
      if (grid[position.y][position.x] === ".") robot = position;

      if (grid[position.y][position.x] === "O" && moveBox(position, direction))
        robot = position;
    }
  }

  let score = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === "O") score += y * 100 + x;
    }
  }

  return score;
}

console.log("Part 1:", partOne(inputData));
