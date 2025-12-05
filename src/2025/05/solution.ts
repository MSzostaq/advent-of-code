import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(filePath, "utf-8").trim().split("\n");

function partOne(lines: string[]): number {
  const blankLineIndex = lines.findIndex((line) => line === "");
  const ranges: [number, number][] = [];
  const ingredientIds: number[] = [];

  for (let i = 0; i < blankLineIndex; i++) {
    const [start, end] = lines[i].split("-").map(Number);
    ranges.push([start, end]);
  }

  for (let i = blankLineIndex + 1; i < lines.length; i++) {
    ingredientIds.push(Number(lines[i]));
  }

  let freshCount = 0;

  for (const id of ingredientIds) {
    const isFresh = ranges.some(([start, end]) => id >= start && id <= end);
    if (isFresh) {
      freshCount++;
    }
  }

  return freshCount;
}

console.log("Part 1:", partOne(input));
