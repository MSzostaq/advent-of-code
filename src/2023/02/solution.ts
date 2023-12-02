import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").toString().trim();

const max: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const partOne = inputData
  .trim()
  .split("\n")
  .reduce((acc, line) => {
    const [gameid, draws] = line.split(": ");
    const id = parseInt(gameid.split(" ")[1]);

    return draws.split(/; /g).some((subsets) =>
      subsets.split(/, /g).some((subset) => {
        const [nmbr, color] = subset.trim().split(" ");
        return parseInt(nmbr) > max[color];
      })
    )
      ? acc
      : acc + id;
  }, 0);

const partTwo = inputData
  .trim()
  .split("\n")
  .reduce((totalSum, line) => {
    const draws = line.split(": ")[1];
    const map = new Map<string, number>();

    for (const subsets of draws.split(/; /g)) {
      for (const subset of subsets.split(/, /g)) {
        const [nmbr, color] = subset.trim().split(" ");
        map.set(color, Math.max(map.get(color) ?? 0, Number(nmbr)));
      }
    }

    return totalSum + [...map.values()].reduce((acc, value) => acc * value, 1);
  }, 0);

console.log(partOne);
console.log(partTwo);
