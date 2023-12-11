import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const parseInput = (lines: string[]): Map => {
  const map: Map = {};

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      const key = `${i},${j}`;
      map[key] = { val: lines[i][j] };
    }
  }

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      const key = `${i},${j}`;
      if (map[key].val === "|") {
        map[key].left = map[`${i - 1},${j}`];
        map[key].right = map[`${i + 1},${j}`];
      } else if (map[key].val === "-") {
        map[key].left = map[`${i},${j - 1}`];
        map[key].right = map[`${i},${j + 1}`];
      } else if (map[key].val === "L") {
        map[key].left = map[`${i - 1},${j}`];
        map[key].right = map[`${i},${j + 1}`];
      } else if (map[key].val === "J") {
        map[key].left = map[`${i},${j - 1}`];
        map[key].right = map[`${i - 1},${j}`];
      } else if (map[key].val === "7") {
        map[key].left = map[`${i},${j - 1}`];
        map[key].right = map[`${i + 1},${j}`];
      } else if (map[key].val === "F") {
        map[key].left = map[`${i + 1},${j}`];
        map[key].right = map[`${i},${j + 1}`];
      }
    }
  }

  return map;
};

const getPath = (map: Map) => {
  const start = Object.values(map).find((n) => n.left?.val === "S")!;
  let visited = new Set([start.left, start]);
  let curr = start;

  do {
    if (curr.left && !visited.has(curr.left)) curr = curr.left;
    else if (curr.right && !visited.has(curr.right)) curr = curr.right;
    visited.add(curr);
  } while (curr.left?.val !== "S" && curr.right?.val !== "S");

  return visited;
};

const partOne = (input: string) => {
  const map = parseInput(input.split("\n"));
  return getPath(map).size / 2;
};

console.log(partOne(inputData));

type Node = { val: string; left?: Node; right?: Node };
type Map = Record<string, Node>;
