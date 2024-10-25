import fs from "fs";
import path from "path";

type Beam = { x: number; y: number; dir: string };

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const rules: Record<string, Record<string, string[] | null>> = {
  ".": { u: null, d: null, l: null, r: null },
  "|": { u: null, d: null, l: ["u", "d"], r: ["u", "d"] },
  "-": { u: ["l", "r"], d: ["l", "r"], l: null, r: null },
  "\\": { u: ["l"], d: ["r"], l: ["u"], r: ["d"] },
  "/": { u: ["r"], d: ["l"], l: ["d"], r: ["u"] },
};

const move = ({ x, y, dir }: Beam): Beam => {
  if (dir === "u") {
    return { dir, x, y: y - 1 };
  }

  if (dir === "d") {
    return { dir, x, y: y + 1 };
  }

  if (dir === "l") {
    return { dir, x: x - 1, y };
  }

  if (dir === "r") {
    return { dir, x: x + 1, y };
  }

  throw Error(`Bad direction "${dir}"`);
};

const nextBeam = (grid: string[], b: Beam): Beam[] => {
  const dirs = rules[grid[b.y][b.x]][b.dir];

  if (dirs) {
    return dirs.map((dir) => move({ ...b, dir }));
  }

  return [move(b)];
};

const energize = (grid: string[], initial: Beam) => {
  let beams: Beam[] = [initial];
  const history = new Set<string>();
  const energized = new Set<string>();
  const validBeam = ({ x, y }: Beam) => grid[y]?.[x] !== undefined;
  const newBeam = (b: Beam) => !history.has(`${b.x},${b.y},${b.dir}`);

  while (beams.length > 0) {
    beams.forEach((b) => history.add(`${b.x},${b.y},${b.dir}`));
    beams.forEach(({ x, y }) => energized.add(`${x},${y}`));
    beams = beams
      .flatMap((b) => nextBeam(grid, b))
      .filter(validBeam)
      .filter(newBeam);
  }

  return energized.size;
};

const partOne = (input: string) => {
  return energize(input.split("\n"), { x: 0, y: 0, dir: "r" });
};

const partTwo = (input: string) => {
  const grid = input.split("\n");
  const l = [];

  for (let i = 0; i < grid.length; i++) {
    l.push(energize(grid, { x: 0, y: i, dir: "r" }));
    l.push(energize(grid, { x: grid[i].length - 1, y: i, dir: "l" }));
  }

  for (let i = 0; i < grid[0].length; i++) {
    l.push(energize(grid, { x: i, y: 0, dir: "d" }));
    l.push(energize(grid, { x: i, y: grid.length - 1, dir: "u" }));
  }

  return Math.max(...l);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
