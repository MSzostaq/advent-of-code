import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const WIDTH = 70,
  HEIGHT = 70;
type Point = { x: number; y: number };

const bfs = (walls: Set<string>, start: Point, end: Point) => {
  const queue: { x: number; y: number; steps: number }[] = [];
  const visited = new Set<string>();

  queue.push({ ...start, steps: 0 });
  visited.add(`${start.x},${start.y}`);

  while (queue.length !== 0) {
    const current = queue.shift();
    if (current === undefined) break;

    if (current.x === end.x && current.y === end.y) return current.steps;

    [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: 0 },
    ].forEach((direction) => {
      const position = {
        x: current.x + direction.x,
        y: current.y + direction.y,
      };
      if (
        position.x < 0 ||
        position.x > WIDTH ||
        position.y < 0 ||
        position.y > HEIGHT ||
        walls.has(`${position.x},${position.y}`) ||
        visited.has(`${position.x},${position.y}`)
      )
        return;

      queue.push({ ...position, steps: current.steps + 1 });
      visited.add(`${position.x},${position.y}`);
    });
  }

  return -1;
};

function partOne(input: string) {
  const walls = new Set(input.split("\n").slice(0, 1024));

  return bfs(walls, { x: 0, y: 0 }, { x: WIDTH, y: HEIGHT });
}

function partTwo(input: string) {
  const walls = input.split("\n");
  const currentWalls = new Set<string>();

  for (let i = 0; i < walls.length; i++) {
    currentWalls.add(walls[i]);

    if (bfs(currentWalls, { x: 0, y: 0 }, { x: WIDTH, y: HEIGHT }) === -1)
      return walls[i];
  }
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
