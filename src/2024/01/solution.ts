import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split("   ").map(Number));

function partOne(input: number[][]): number {
  const [left, right] = [
    input.map((line) => line[0]).sort((a, b) => a - b),
    input.map((line) => line[1]).sort((a, b) => a - b),
  ];

  return left.reduce(
    (sum, value, index) => sum + Math.abs(value - right[index]),
    0
  );
}

function partTwo(input: number[][]): number {
  const left = input.map((line) => line[0]);
  const rightOccurrences = input.reduce(
    (map, val) => map.set(val[1], (map.get(val[1]) || 0) + 1),
    new Map()
  );

  return left.reduce(
    (sum, value) => sum + Number(value) * (rightOccurrences.get(value) || 0),
    0
  );
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
