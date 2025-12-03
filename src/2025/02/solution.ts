import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split(",")
  .map((range) => {
    const [start, end] = range.split("-").map(Number);
    return { start, end };
  });

function isInvalidId(id: number): boolean {
  const idStr = id.toString();
  const length = idStr.length;

  for (let patternLen = 1; patternLen <= length / 2; patternLen++) {
    if (length % patternLen !== 0) continue;

    const pattern = idStr.substring(0, patternLen);
    const repetitions = length / patternLen;

    let isValid = true;
    for (let i = 0; i < repetitions; i++) {
      if (idStr.substring(i * patternLen, (i + 1) * patternLen) !== pattern) {
        isValid = false;
        break;
      }
    }

    if (isValid && repetitions >= 2) {
      return true;
    }
  }

  return false;
}

function partOne(input: Array<{ start: number; end: number }>): number {
  let sum = 0;

  for (const { start, end } of input) {
    for (let id = start; id <= end; id++) {
      const idStr = id.toString();
      const length = idStr.length;

      if (length % 2 === 0) {
        const half = length / 2;
        const firstHalf = idStr.substring(0, half);
        const secondHalf = idStr.substring(half);

        if (firstHalf === secondHalf) {
          sum += id;
        }
      }
    }
  }

  return sum;
}

function partTwo(input: Array<{ start: number; end: number }>): number {
  let sum = 0;

  for (const { start, end } of input) {
    for (let id = start; id <= end; id++) {
      if (isInvalidId(id)) {
        sum += id;
      }
    }
  }

  return sum;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
