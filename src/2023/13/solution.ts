import fs from "fs";
import path from "path";

type Grid = string[][];

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

function parseInput(input: string): Grid[] {
  const data = input
    .trim()
    .split("\n\n")
    .map((grid) => grid.split("\n").map((l) => l.split("")));

  return data;
}

const process = (data: Grid[], part: number) => {
  let d, j, I, J;

  return data
    .map((grid) => [grid, transpose(grid)])
    .map((grids) => {
      return grids.map((grid) => {
        (d = 0), (I = 0), (J = 0);
        for (let i = 0.5; i < grid.length; i++) {
          (j = 0.5), (d = 0);
          while (true) {
            if (i - j < 0 || i + j >= grid.length) break;
            d += diff(grid[i - j], grid[i + j]);
            if (d > part) break;
            j++;
          }
          if (j > 0.5 && (i - j === -1 || i + j === grid.length) && d === part)
            (I = i + 0.5), (J = j);
        }
        return I;
      });
    })
    .reduce((acc, cur) => acc + cur[0] * 100 + cur[1], 0);
};

const transpose = (matrix: Grid) =>
  matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));

const diff = (a: string[], b: string[]) =>
  a.filter((c, i) => c !== b[i]).length;

const partOne = (input: string): number => process(parseInput(input), 0);

const partTwo = (input: string): number => process(parseInput(input), 1);

console.log(partOne(inputData));
console.log(partTwo(inputData));
