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

function partTwo(lines: string[]): number {
  const blankLineIndex = lines.findIndex((line) => line === "");
  const ranges: [number, number][] = [];

  for (let i = 0; i < blankLineIndex; i++) {
    const [start, end] = lines[i].split("-").map(Number);
    ranges.push([start, end]);
  }

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];

  for (const [start, end] of ranges) {
    if (merged.length === 0) {
      merged.push([start, end]);
    } else {
      const [lastStart, lastEnd] = merged[merged.length - 1];

      if (start <= lastEnd + 1) {
        merged[merged.length - 1] = [lastStart, Math.max(lastEnd, end)];
      } else {
        merged.push([start, end]);
      }
    }
  }

  let totalFresh = 0;
  for (const [start, end] of merged) {
    totalFresh += end - start + 1;
  }

  return totalFresh;
}

console.log("Part 1:", partOne(input));
console.log("Part 2:", partTwo(input));
