import fs from "fs";
import path from "path";

type QueueItem = {
  x: number;
  y: number;
  dir: number;
  dirDist: number;
  prev: [number, number, number, number] | null;
};

const filePath = path.resolve(__dirname, "input.txt");
const inputData: number[][] = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .map((l: string) => l.split("").map(Number));

class Grid {
  data: {
    [key: number]: {
      [key: number]: {
        [key: number]: {
          [key: number]: [number, number, number, number] | null;
        };
      };
    };
  };
  lastPos: [number, number, number, number];

  constructor() {
    this.data = {};
    this.lastPos = [0, 0, 0, 0];
  }

  set(
    val: [number, number, number, number] | null,
    x: number,
    y: number = 0,
    z: number = 0,
    zz: number = 0
  ): void {
    if (!this.data[zz]) this.data[zz] = {};
    if (!this.data[zz][z]) this.data[zz][z] = {};
    if (!this.data[zz][z][y]) this.data[zz][z][y] = {};
    this.data[zz][z][y][x] = val;
    this.lastPos = [x, y, z, zz];
  }

  get(
    x: number,
    y: number = 0,
    z: number = 0,
    zz: number = 0
  ): [number, number, number, number] | null {
    return this.data[zz]?.[z]?.[y]?.[x] ?? null;
  }
}

const getPath = (
  visited: Grid,
  x: number,
  y: number,
  z: number,
  zz: number
): [number, number, number, number][] => {
  const path: [number, number, number, number][] = [[x, y, z, zz]];
  let node = visited.get(x, y, z, zz);

  while (node !== null) {
    path.push(node);
    [x, y, z, zz] = node;
    node = visited.get(x, y, z, zz);
  }

  return path.reverse();
};

const process = (grid: number[][], part: number, draw: number): number => {
  const timeSlots: QueueItem[][] = [[]];

  const enqueue = (
    time: number,
    x: number,
    y: number,
    dir: number,
    dirDist: number,
    prev: [number, number, number, number] | null
  ): void => {
    if (!timeSlots[time]) timeSlots[time] = [];
    timeSlots[time].push({ x, y, dir, dirDist, prev });
  };

  let curTime: number = 0;
  enqueue(curTime, 0, 0, -1, part ? 4 : 0, null);

  const visited = new Grid();
  const d: [number, number][] = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];

  main: while (true) {
    while (timeSlots[curTime] && timeSlots[curTime].length) {
      const cur = timeSlots[curTime].pop();

      if (
        !cur ||
        visited.get(cur.x, cur.y, cur.dir, cur.dirDist) !== undefined
      ) {
        continue;
      }

      visited.set(cur.prev, cur.x, cur.y, cur.dir, cur.dirDist);

      for (let i = 0; i < 4; i++) {
        const [dx, dy] = d[i];
        if (cur.dir === (i + 2) % 4) continue;
        const turn = i !== cur.dir;
        if (!turn && cur.dirDist >= (part ? 10 : 3)) continue;
        if (part && turn && cur.dirDist < 4) continue;
        if (cur.x === grid[0].length - 1 && cur.y === grid.length - 1)
          break main;

        const x = cur.x + dx,
          y = cur.y + dy;
        if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) continue;
        const time = curTime + grid[y][x];
        enqueue(time, x, y, i, turn ? 1 : cur.dirDist + 1, [
          cur.x,
          cur.y,
          cur.dir,
          cur.dirDist,
        ]);
      }
    }
    curTime++;
  }

  const path = getPath(visited, ...visited.lastPos);
  if (draw) console.info("\n" + drawCanvas(getCanvas(path)));
  return curTime;
};

const getCanvas = (path: [number, number, number, number][]): string[][] => {
  const dMap = ["<", "^", ">", "v"];
  let maxX = -Infinity,
    maxY = -Infinity;

  for (const [x, y] of path) {
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  const canvas = new Array(maxY + 1)
    .fill(null)
    .map(() => new Array(maxX + 1).fill("."));

  for (let i = 0; i < path.length; i++) {
    const [x, y, z] = path[i];

    if (x < 0 || y < 0 || x > maxX || y > maxY) continue;

    const nextZ = path[i + 1]?.[2];
    const displayChar =
      nextZ !== undefined && nextZ >= 0 && nextZ < dMap.length
        ? dMap[nextZ]
        : "#";

    canvas[y][x] = displayChar;
  }

  return canvas;
};

const drawCanvas = (canvas: string[][]): string => {
  return canvas.map((r) => r.join("")).join("\n");
};

const partOneAndTwo = (input: number[][]): string => {
  return `partOne: ${process(input, 0, 1)}, partTwo: ${process(input, 1, 1)}`;
};

console.log(partOneAndTwo(inputData));
