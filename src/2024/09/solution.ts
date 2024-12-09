import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim();

function parseInput(input: string): number[] {
  return input.split("").map(Number);
}

function createMap(input: number[]): (number | null)[] {
  const map: (number | null)[] = [];
  let id = 0;

  input.forEach((value, index) => {
    for (let i = 0; i < value; i++) {
      map.push(index % 2 === 0 ? id : null);
    }
    if (index % 2 === 0) id++;
  });

  return map;
}

function redistributeMap(map: (number | null)[]): void {
  for (let i = map.length - 1; i >= 0; i--) {
    if (map[i] === null) continue;

    const firstNull = map.findIndex((x, j) => x === null && j < i);
    if (firstNull !== -1) {
      map[firstNull] = map[i];
      map[i] = null;
    }
  }
}

function calculateResult(map: (number | null)[]): number {
  return map.reduce((acc: number, value, index) => {
    return acc + (value === null ? 0 : index * value);
  }, 0);
}

function partOne(input: string): number {
  const parsedInput = parseInput(input);
  const map = createMap(parsedInput);
  redistributeMap(map);

  return calculateResult(map);
}

console.log("Part 1:", partOne(inputData));
