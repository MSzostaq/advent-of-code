import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split("").map(Number));

function getMaxJoltage(bank: number[]): number {
  let maxJoltage = 0;

  for (let i = 0; i < bank.length; i++) {
    for (let j = i + 1; j < bank.length; j++) {
      const joltage = bank[i] * 10 + bank[j];
      maxJoltage = Math.max(maxJoltage, joltage);
    }
  }

  return maxJoltage;
}

function partOne(input: number[][]): number {
  let totalJoltage = 0;

  for (const bank of input) {
    totalJoltage += getMaxJoltage(bank);
  }

  return totalJoltage;
}

function getMaxJoltagePartTwo(bank: number[]): bigint {
  const targetDigits = 12;
  const selected: number[] = [];
  let remaining = [...bank];

  for (let pos = 0; pos < targetDigits; pos++) {
    const digitsLeft = targetDigits - pos;
    const minIndexNeeded = remaining.length - digitsLeft;

    let maxDigit = -1;
    let maxIdx = -1;

    for (let i = 0; i <= minIndexNeeded; i++) {
      if (remaining[i] > maxDigit) {
        maxDigit = remaining[i];
        maxIdx = i;
      }
    }

    selected.push(maxDigit);
    remaining = remaining.slice(maxIdx + 1);
  }

  return BigInt(selected.join(""));
}

function partTwo(input: number[][]): bigint {
  let totalJoltage = 0n;

  for (const bank of input) {
    totalJoltage += getMaxJoltagePartTwo(bank);
  }

  return totalJoltage;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
