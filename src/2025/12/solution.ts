import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim();

type Shape = boolean[][];
type Region = { width: number; height: number; presents: number[] };

function parseInput(data: string): { shapes: Shape[]; regions: Region[] } {
  const lines = data.split("\n");
  const shapes: Shape[] = [];
  const regions: Region[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.match(/^\d+:$/)) {
      const shapeLines: string[] = [];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].match(/^\d+:$/) &&
        !lines[i].includes("x")
      ) {
        shapeLines.push(lines[i]);
        i++;
      }

      if (shapeLines.length > 0) {
        const shape = shapeLines.map((l) => l.split("").map((c) => c === "#"));
        shapes.push(shape);
      }
    } else if (line.includes("x") && line.includes(":")) {
      const match = line.match(/^(\d+)x(\d+):\s*(.+)$/);
      if (match) {
        const [, w, h, presentsStr] = match;
        const presents = presentsStr.trim().split(/\s+/).map(Number);
        regions.push({
          width: parseInt(w),
          height: parseInt(h),
          presents,
        });
      }
      i++;
    } else {
      i++;
    }
  }

  return { shapes, regions };
}

function getShapeVariations(shape: Shape): Shape[] {
  const variations = new Set<string>();

  const rotate = (s: Shape): Shape => {
    const h = s.length;
    const w = s[0].length;
    return Array.from({ length: w }, (_, i) =>
      Array.from({ length: h }, (_, j) => s[h - 1 - j][i])
    );
  };

  const flip = (s: Shape): Shape => s.map((row) => [...row].reverse());

  let current = shape;
  for (let i = 0; i < 4; i++) {
    variations.add(JSON.stringify(current));
    variations.add(JSON.stringify(flip(current)));
    current = rotate(current);
  }

  return Array.from(variations).map((s) => JSON.parse(s));
}

function canPlace(
  grid: boolean[][],
  shape: Shape,
  row: number,
  col: number
): boolean {
  if (row + shape.length > grid.length) return false;
  if (col + shape[0].length > grid[0].length) return false;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c] && grid[row + r][col + c]) {
        return false;
      }
    }
  }
  return true;
}

function place(
  grid: boolean[][],
  shape: Shape,
  row: number,
  col: number,
  value: boolean
): void {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c]) {
        grid[row + r][col + c] = value;
      }
    }
  }
}

function solve(
  grid: boolean[][],
  shapes: Shape[][],
  shapeIndex: number = 0
): boolean {
  if (shapeIndex >= shapes.length) return true;

  const shapeVariations = shapes[shapeIndex];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      for (const variation of shapeVariations) {
        if (canPlace(grid, variation, row, col)) {
          place(grid, variation, row, col, true);

          if (solve(grid, shapes, shapeIndex + 1)) {
            return true;
          }

          place(grid, variation, row, col, false);
        }
      }
    }
  }

  return false;
}

function canFitPresents(region: Region, allShapes: Shape[]): boolean {
  const grid = Array.from({ length: region.height }, () =>
    Array(region.width).fill(false)
  );

  const requiredShapes: Shape[][] = [];

  for (let shapeIdx = 0; shapeIdx < region.presents.length; shapeIdx++) {
    const count = region.presents[shapeIdx];
    for (let i = 0; i < count; i++) {
      if (shapeIdx < allShapes.length) {
        requiredShapes.push(getShapeVariations(allShapes[shapeIdx]));
      }
    }
  }

  if (requiredShapes.length === 0) return true;

  const totalShapeArea = requiredShapes.reduce((sum, variations) => {
    const cells = variations[0].flat().filter((v) => v).length;
    return sum + cells;
  }, 0);

  if (totalShapeArea > region.width * region.height) {
    return false;
  }

  return solve(grid, requiredShapes);
}

function partOne(data: string): number {
  const { shapes, regions } = parseInput(data);

  let count = 0;
  regions.forEach((region, idx) => {
    const fits = canFitPresents(region, shapes);
    if (fits) count++;

    if ((idx + 1) % 100 === 0) {
      console.log(`Processed ${idx + 1}/${regions.length} regions...`);
    }
  });

  return count;
}

console.log("Part 1:", partOne(inputData));
