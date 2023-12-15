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

const partTwo = (input: string) => {
  const boxes = [...Array(256)].map(() => new Map<string, number>());

  input.split(",").forEach((str) => {
    if (str.at(-1) === "-") {
      const label = str.slice(0, -1);
      boxes[hash(label)].delete(label);
    } else {
      const [label, n] = str.split("=");
      boxes[hash(label)].set(label, Number(n));
    }
  });

  return boxes
    .flatMap((box, bi) =>
      [...box.values()].map((fl, fli) => (bi + 1) * (fli + 1) * fl)
    )
    .reduce((sum, v) => sum + v, 0);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
