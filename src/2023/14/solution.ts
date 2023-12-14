import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const partOne = (input: string) => {
  let match;
  const cols: string[] = [];
  const rows = input.split("\n");

  for (let i = 0; i < rows[0].length; i++)
    cols.push(rows.map((r) => r[i]).join(""));

  return cols.reduce<number>((sum, col) => {
    const rockRx = /[O.]+/g;
    while ((match = rockRx.exec(col))) {
      if (!match[0].includes("O")) continue;
      for (let i = 0; i < match[0].split("O").length - 1; i++) {
        sum += cols.length - match.index - i;
      }
    }
    return sum;
  }, 0);
};

console.log(partOne(inputData));
