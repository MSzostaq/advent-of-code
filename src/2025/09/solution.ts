import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .filter((line) => line.length > 0);

interface Point {
  x: number;
  y: number;
}

function parseInput(lines: string[]): Point[] {
  return lines.map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x, y };
  });
}

function findLargestRectangle(points: Point[]): number {
  let maxArea = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i];
      const p2 = points[j];

      const width = Math.abs(p2.x - p1.x) + 1;
      const height = Math.abs(p2.y - p1.y) + 1;
      const area = width * height;

      maxArea = Math.max(maxArea, area);
    }
  }

  return maxArea;
}

function partOne(lines: string[]): number {
  const points = parseInput(lines);
  return findLargestRectangle(points);
}

console.log("Part 1:", partOne(inputData));
