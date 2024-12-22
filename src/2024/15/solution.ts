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

function partTwo(input: string) {
  const parts = input
    .trim()
    .split("\n\n")
    .map((lines) => lines.split("\n"));
  const grid = parts[0].map((line) => line.split(""));
  const instructions = parts[1].join("");
  const width = grid[0].length,
    height = grid.length;

  const walls = new Set<string>();
  const boxes: Point[] = [];
  let robot = { x: 0, y: 0 };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === "@") robot = { x: x * 2, y };
      if (grid[y][x] === "#") {
        walls.add(`${x * 2},${y}`);
        walls.add(`${x * 2 + 1},${y}`);
      }
      if (grid[y][x] === "O") boxes.push({ x: x * 2, y });
    }
  }

  const moveBox = (
    collidedBox: Point,
    direction: Point,
    movements: { box: Point; direction: Point }[]
  ): boolean => {
    const next = [
      { x: collidedBox.x + direction.x, y: collidedBox.y + direction.y },
      { x: collidedBox.x + 1 + direction.x, y: collidedBox.y + direction.y },
    ];

    for (let i = 0; i < next.length; i++) {
      if (walls.has(`${next[i].x},${next[i].y}`)) {
        return false;
      }
    }

    const collidedBoxes = boxes.filter((box) => {
      for (let i = 0; i < next.length; i++) {
        if (box.x === collidedBox.x && box.y === collidedBox.y) return false;
        if (
          (box.x === next[i].x || box.x + 1 === next[i].x) &&
          box.y === next[i].y
        )
          return true;
      }
      return false;
    });

    if (collidedBoxes.length === 0) return true;

    let conflicts = false;
    for (const box of collidedBoxes) {
      if (moveBox(box, direction, movements)) {
        if (
          movements
            .map((movement) => movement.box)
            .find((b) => b.x === box.x && b.y === box.y) === undefined
        ) {
          movements.push({
            box,
            direction,
          });
        }
      } else {
        conflicts = true;
        break;
      }
    }

    return !conflicts;
  };

  for (let i = 0; i < instructions.length; i++) {
    const direction = DIRECTIONS[instructions[i]];
    const position = { x: robot.x + direction.x, y: robot.y + direction.y };

    if (!walls.has(`${position.x},${position.y}`)) {
      const collidedBox = boxes.find(
        (box) =>
          (box.x === position.x || box.x + 1 === position.x) &&
          box.y === position.y
      );

      if (collidedBox !== undefined) {
        let movements: { box: Point; direction: Point }[] = [];
        if (moveBox(collidedBox, direction, movements)) {
          for (const movement of movements) {
            movement.box.x += movement.direction.x;
            movement.box.y += movement.direction.y;
          }
          collidedBox.x += direction.x;
          collidedBox.y += direction.y;
          robot = position;
        }
      } else robot = position;
    }
  }

  let score = 0;

  for (const box of boxes) {
    score += box.y * 100 + box.x;
  }

  return score;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
