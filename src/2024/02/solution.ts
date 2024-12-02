import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(" ").map(Number));

function isReportSafe(report: number[]): boolean {
  const diffs = report.slice(1).map((level, i) => level - report[i]);
  const isIncreasing = diffs[0] > 0;

  return diffs.every(
    (diff) =>
      Math.abs(diff) >= 1 && Math.abs(diff) <= 3 && diff > 0 === isIncreasing
  );
}

function partOne(data: number[][]): number {
  return data.filter(isReportSafe).length;
}

console.log("Part 1:", partOne(inputData));
