import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const hash = (str: string) => {
  return str
    .split("")
    .reduce((val, ch) => ((val + ch.charCodeAt(0)) * 17) % 256, 0);
};

const partOne = (input: string) => {
  const sequence = input.split(",");
  return sequence.map(hash).reduce((sum, v) => sum + v, 0);
};

console.log(partOne(inputData));
