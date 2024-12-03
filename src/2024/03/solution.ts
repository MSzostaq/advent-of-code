import fs from "fs";
import path from "path";

const filePath = path.resolve(
  __dirname,
  process.argv.includes("--test") ? "test.txt" : "input.txt"
);
const inputData = fs.readFileSync(filePath, "utf-8").trim();

function partOne(input: string | string[]) {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

  let sum = 0;
  let match;

  const inputString = Array.isArray(input) ? input.join("\n") : input;

  while ((match = regex.exec(inputString)) !== null) {
    sum += parseInt(match[1]) * parseInt(match[2]);
  }

  return sum;
}

console.log("Part 1:", partOne(inputData));
