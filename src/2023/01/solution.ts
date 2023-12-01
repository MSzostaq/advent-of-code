import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim().split("\n");

function partOne(input: string[]) {
  const values = input.map((line) => {
    let firstValue = line
      .split("")
      .find((value) => !Number.isNaN(Number(value)));
    let lastValue = line
      .split("")
      .findLast((value) => !Number.isNaN(Number(value)));

    return Number(firstValue + lastValue);
  });

  return values.reduce((sum, value) => sum + value);
}

console.log(partOne(inputData));
