import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

function partOne(input: string) {
  const keys: number[][] = [];
  const locks: number[][] = [];

  input
    .trim()
    .split("\n\n")
    .forEach((lines) => {
      const grid = lines.split("\n");
      const heights: number[] = [];
      const isKey = grid[0].split("").every((char) => char === ".");

      for (let x = 0; x < grid[0].length; x++) {
        for (let y = 0; y < grid.length; y++) {
          if (isKey && grid[y][x] === "#") {
            heights.push(grid.length - y - 1);
            break;
          }

          if (!isKey && grid[y][x] === ".") {
            heights.push(y - 1);
            break;
          }
        }
      }

      if (isKey) keys.push(heights);
      else locks.push(heights);
    });

  let count = 0;
  for (let i = 0; i < locks.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      let valid = true;
      for (let k = 0; k < locks[i].length; k++) {
        if (locks[i][k] + keys[j][k] >= 6) valid = false;
      }
      if (valid) count++;
    }
  }
  return count;
}

console.log("Part 1:", partOne(inputData));
