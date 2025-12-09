import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").split("\n");

interface Beam {
  row: number;
  col: number;
}

function findStartPosition(lines: string[]): number {
  const startCol = lines[0].indexOf("S");
  return startCol;
}

function simulateBeams(lines: string[]): number {
  const startCol = findStartPosition(lines);
  const rows = lines.length;
  const cols = lines[0].length;
  const beams: Beam[] = [{ row: 1, col: startCol }];
  const visited = new Set<string>();
  let splitCount = 0;

  while (beams.length > 0) {
    const newBeams: Beam[] = [];

    for (const beam of beams) {
      if (
        beam.row < 0 ||
        beam.row >= rows ||
        beam.col < 0 ||
        beam.col >= cols
      ) {
        continue;
      }

      const key = `${beam.row},${beam.col}`;
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);

      const cell = lines[beam.row][beam.col];

      if (cell === "^") {
        splitCount++;
        newBeams.push({ row: beam.row + 1, col: beam.col - 1 });
        newBeams.push({ row: beam.row + 1, col: beam.col + 1 });
      } else {
        newBeams.push({ row: beam.row + 1, col: beam.col });
      }
    }

    beams.length = 0;
    beams.push(...newBeams);
  }

  return splitCount;
}

function simulateQuantumBeams(lines: string[]): number {
  const startCol = findStartPosition(lines);
  const rows = lines.length;
  const cols = lines[0].length;

  const memo = new Map<string, number>();

  function countExitPoints(
    row: number,
    col: number,
    visited: Set<string>
  ): number {
    if (row >= rows || col < 0 || col >= cols) {
      return 1;
    }

    const key = `${row},${col}`;

    if (visited.has(key)) {
      return 0;
    }

    if (memo.has(key)) {
      return memo.get(key)!;
    }

    const newVisited = new Set(visited);
    newVisited.add(key);

    const cell = lines[row][col];
    let result = 0;

    if (cell === "^") {
      result =
        countExitPoints(row + 1, col - 1, newVisited) +
        countExitPoints(row + 1, col + 1, newVisited);
    } else {
      result = countExitPoints(row + 1, col, newVisited);
    }

    memo.set(key, result);
    return result;
  }

  return countExitPoints(1, startCol, new Set());
}

function partOne(lines: string[]): number {
  return simulateBeams(lines.filter((line) => line.length > 0));
}

function partTwo(lines: string[]): number {
  return simulateQuantumBeams(lines.filter((line) => line.length > 0));
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
