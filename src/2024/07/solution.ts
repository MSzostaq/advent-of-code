import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim().split("\n");

function partOne(input: string[]): number {
  const targetSums = input.reduce((sums, line) => {
    const [target, nums] = line.split(": ");
    const targetSum = parseInt(target, 10);
    const numbers = nums.split(" ").map(Number);

    for (let j = 0; j < 2 ** (numbers.length - 1); j++) {
      const operations = j
        .toString(2)
        .padStart(numbers.length - 1, "0")
        .replace(/0/g, "+")
        .replace(/1/g, "*");
      const result = numbers.reduce((acc, num, index) => {
        if (index === 0) return num;
        const op = operations[index - 1];
        return op === "+" ? acc + num : acc * num;
      });

      if (result === targetSum) {
        sums.push(targetSum);
        break;
      }
    }
    return sums;
  }, [] as number[]);

  return targetSums.reduce((sum, val) => sum + val, 0);
}

console.log("Part 1:", partOne(inputData));
