import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");

const inputData = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    const match = line.match(/([LR])(\d+)/);
    return {
      direction: match![1] as "L" | "R",
      distance: Number(match![2]),
    };
  });

function partOne(
  input: Array<{ direction: string; distance: number }>
): number {
  let position = 50;
  let countZeros = 0;

  for (const { direction, distance } of input) {
    if (direction === "L") {
      position = (position - distance) % 100;
      if (position < 0) position += 100;
    } else {
      position = (position + distance) % 100;
    }

    if (position === 0) {
      countZeros++;
    }
  }

  return countZeros;
}

function partTwo(
  input: Array<{ direction: string; distance: number }>
): number {
  let position = 50;
  let countZeros = 0;

  for (const { direction, distance } of input) {
    const step = direction === "L" ? -1 : 1;

    for (let i = 0; i < distance; i++) {
      position = (position + step) % 100;
      if (position < 0) position += 100;

      if (position === 0) {
        countZeros++;
      }
    }
  }

  return countZeros;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
