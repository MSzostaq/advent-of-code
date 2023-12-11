import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const expand = (lines: string[][]) => {
  const rows: number[] = [];
  const cols: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("#") === -1) rows.push(i);
    if (lines.map((l) => l[i]).every((x) => x !== "#")) cols.push(i);
  }

  return { rows, cols };
};

const shortestPathsSum = (lines: string[][], expandAmount: number) => {
  const expanded = expand(lines);
  const galaxies: [number, number][] = [];

  lines.forEach((line, x) => {
    line.forEach((val, y) => {
      if (val === "#") galaxies.push([x, y]);
    });
  });

  let sum = 0;

  galaxies.forEach(([x1, y1], i) => {
    galaxies.forEach(([x2, y2], j) => {
      if (x1 === x2 && y1 === y2) return;
      sum += Math.abs(x1 - x2) + Math.abs(y1 - y2);
      sum +=
        expandAmount *
        expanded.rows.filter((i) => (x1 < i && i < x2) || (x2 < i && i < x1))
          .length;
      sum +=
        expandAmount *
        expanded.cols.filter((j) => (y1 < j && j < y2) || (y2 < j && j < y1))
          .length;
    });
  });

  return sum / 2;
};

const partOne = (input: string) => {
  const lines = input.split("\n").map((l) => l.split(""));
  return shortestPathsSum(lines, 1);
};

const partTwo = (input: string, amount = 999999) => {
  const lines = input.split("\n").map((l) => l.split(""));
  return shortestPathsSum(lines, amount);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
