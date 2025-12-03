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

console.log("Part 1:", partOne(inputData));
