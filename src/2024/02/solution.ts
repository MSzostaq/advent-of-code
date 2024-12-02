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

function isSafeWithOneRemoval(report: number[]): boolean {
  return report.some((_, i) =>
    isReportSafe(report.slice(0, i).concat(report.slice(i + 1)))
  );
}

function partOne(data: number[][]): number {
  return data.filter(isReportSafe).length;
}

function partTwo(data: number[][]): number {
  return data.filter(
    (report) => isReportSafe(report) || isSafeWithOneRemoval(report)
  ).length;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
