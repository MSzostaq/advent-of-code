import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const partOne = (input: string) => {
  const rawMap = input.toString().trim().split(/\r?\n/gm);
  const map = new Map<string, { x: number; y: number }>();
  let start: string | undefined;

  for (let y = 0; y < rawMap.length; y++) {
    for (let x = 0; x < rawMap[0].length; x++) {
      const char = rawMap[y][x];
      if (char === "." || char === "S") {
        map.set(`${x}, ${y}`, { x, y });
        if (char === "S") {
          start = `${x}, ${y}`;
        }
      }
    }
  }

  const toVisit = new Map<string, number>(start ? [[start, 0]] : []);
  const visited = new Map<string, number>();
  const totalSteps = 64;

  for (const [point, step] of toVisit) {
    if (step > totalSteps) continue;
    if (visited.has(point)) {
      continue;
    }

    visited.set(point, step);

    if (typeof point === "string") {
      const parts = point.split(", ");
      if (parts.length === 2) {
        const [curX, curY] = parts.map(Number);

        for (const [xChange, yChange] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nextX = curX + xChange;
          const nextY = curY + yChange;
          const nextPoint = `${nextX}, ${nextY}`;

          if (
            map.has(nextPoint) &&
            !visited.has(nextPoint) &&
            !toVisit.has(nextPoint)
          ) {
            toVisit.set(nextPoint, step + 1);
          }
        }
      }
    }
  }

  return [...visited.values()].filter((x) => x % 2 === 0).length;
};

console.log(partOne(inputData));
