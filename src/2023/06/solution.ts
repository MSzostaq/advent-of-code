import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").toString().trim();

const intsBetweenRoots = (time: number, distance: number) => {
  const sqrt = Math.sqrt(time ** 2 - 4 * distance);
  return Math.ceil((time + sqrt) / 2) - Math.floor((time - sqrt) / 2) - 1;
};

const partOne = (input: string) => {
  const [time, distance] = input
    .split("\n")
    .map((l) => l.split(/\s+/).slice(1).map(Number));
  return time.reduce(
    (acc, time, i) => acc * intsBetweenRoots(time, distance[i]),
    1
  );
};

const partTwo = (input: string) => {
  const [time, distance] = input
    .split("\n")
    .map((l) => Number(l.replaceAll(" ", "").split(":")[1]));
  return intsBetweenRoots(time, distance);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
