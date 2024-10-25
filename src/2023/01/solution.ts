import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim().split("\n");

function partOne(input: string[]): number {
  const values = input.map((line) => {
    let firstValue = line
      .split("")
      .find((value) => !Number.isNaN(Number(value)));
    let lastValue = line
      .split("")
      .reverse()
      .find((value) => !Number.isNaN(Number(value)));

    if (firstValue === undefined || lastValue === undefined) {
      throw new Error("Invalid input: No numeric values found.");
    }

    return Number(firstValue + lastValue);
  });

  return values.reduce((sum, value) => sum + value);
}

export function partTwo(input: string[]): number {
  return input
    .map((line) => {
      const digits = line
        .split("")
        .map((char, index) => {
          const wordDigitMap: Record<string, number> = {
            one: 1,
            two: 2,
            three: 3,
            four: 4,
            five: 5,
            six: 6,
            seven: 7,
            eight: 8,
            nine: 9,
          };

          for (const word in wordDigitMap) {
            if (line.slice(index).startsWith(word)) {
              return wordDigitMap[word];
            }
          }

          return parseInt(char) || 0;
        })
        .filter((number) => number !== 0);

      return parseInt("" + digits[0] + digits[digits.length - 1]) || 0;
    })
    .reduce((a, b) => a + b, 0);
}

console.log(partOne(inputData));
console.log(partTwo(inputData));
