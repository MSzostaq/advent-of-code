import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const BFS_DIRECTIONS = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};

const KEYPAD: { [key: string]: { x: number; y: number } } = {
  7: { x: 0, y: 0 },
  8: { x: 1, y: 0 },
  9: { x: 2, y: 0 },
  4: { x: 0, y: 1 },
  5: { x: 1, y: 1 },
  6: { x: 2, y: 1 },
  1: { x: 0, y: 2 },
  2: { x: 1, y: 2 },
  3: { x: 2, y: 2 },
  X: { x: 0, y: 3 },
  0: { x: 1, y: 3 },
  A: { x: 2, y: 3 },
};

const DIRECTIONS: { [key: string]: { x: number; y: number } } = {
  X: { x: 0, y: 0 },
  "^": { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  "<": { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  ">": { x: 2, y: 1 },
};

function getCommand(
  input: { [key: string]: { x: number; y: number } },
  start: string,
  end: string
) {
  const queue = [{ ...input[start], path: "" }];
  const distances: { [key: string]: number } = {};

  if (start === end) return ["A"];

  let allPaths: string[] = [];
  while (queue.length) {
    const current = queue.shift();
    if (current === undefined) break;

    if (current.x === input[end].x && current.y === input[end].y)
      allPaths.push(current.path + "A");
    if (
      distances[`${current.x},${current.y}`] !== undefined &&
      distances[`${current.x},${current.y}`] < current.path.length
    )
      continue;

    Object.entries(BFS_DIRECTIONS).forEach(([direction, vector]) => {
      const position = { x: current.x + vector.x, y: current.y + vector.y };

      if (input.X.x === position.x && input.X.y === position.y) return;

      const button = Object.values(input).find(
        (button) => button.x === position.x && button.y === position.y
      );
      if (button !== undefined) {
        const newPath = current.path + direction;
        if (
          distances[`${position.x},${position.y}`] === undefined ||
          distances[`${position.x},${position.y}`] >= newPath.length
        ) {
          queue.push({ ...position, path: newPath });
          distances[`${position.x},${position.y}`] = newPath.length;
        }
      }
    });
  }

  return allPaths.sort((a, b) => a.length - b.length);
}

function getKeyPresses(
  input: { [key: string]: { x: number; y: number } },
  code: string,
  robot: number,
  memo: { [key: string]: number }
): number {
  const key = `${code},${robot}`;
  if (memo[key] !== undefined) return memo[key];

  let current = "A";
  let length = 0;
  for (let i = 0; i < code.length; i++) {
    const moves = getCommand(input, current, code[i]);
    if (robot === 0) length += moves[0].length;
    else
      length += Math.min(
        ...moves.map((move) => getKeyPresses(DIRECTIONS, move, robot - 1, memo))
      );
    current = code[i];
  }

  memo[key] = length;
  return length;
}

function partOne(input: string) {
  const keycodes = input.trim().split("\n");
  const memo: { [key: string]: number } = {};

  return keycodes.reduce((sum, code) => {
    const numerical = parseInt(
      code
        .split("")
        .filter((character) => character.match(/\d/))
        .join("")
    );
    return sum + numerical * getKeyPresses(KEYPAD, code, 2, memo);
  }, 0);
}

function partTwo(input: string) {
  const keycodes = input.trim().split("\n");
  const memo: { [key: string]: number } = {};

  return keycodes.reduce((sum, code) => {
    const numerical = parseInt(
      code
        .split("")
        .filter((character) => character.match(/\d/))
        .join("")
    );
    return sum + numerical * getKeyPresses(KEYPAD, code, 25, memo);
  }, 0);
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
