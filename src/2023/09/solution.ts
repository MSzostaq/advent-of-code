import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .map((line) => line.split(" ").map(Number));

const extrapolate = (sequence: number[]) => {
  const table: number[][] = [sequence];

  for (let i = 1; table[i - 1].some((v) => v !== 0); i++) {
    table.push(Array(sequence.length));

    for (let j = i; j < sequence.length; j++) {
      table[i][j] = table[i - 1][j] - table[i - 1][j - 1];
    }
  }

  return table.reduce((acc, row) => acc + row.at(-1)!, 0);
};

const partOne = (input: number[][]) => {
  return input.map(extrapolate).reduce((acc, x) => acc + x, 0);
};

const partTwo = (input: number[][]) => {
  return input
    .map((arr) => extrapolate(arr.reverse()))
    .reduce((acc, x) => acc + x, 0);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
