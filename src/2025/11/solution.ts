import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .filter((line) => line.trim().length > 0);

type Graph = Record<string, string[]>;

function parseInput(lines: string[]): Graph {
  const graph: Graph = {};

  for (const line of lines) {
    const [device, outputsStr] = line.split(":").map((part) => part.trim());
    const outputs = outputsStr
      ? outputsStr.split(" ").map((o) => o.trim())
      : [];
    graph[device] = outputs;
  }

  return graph;
}

function countPaths(
  graph: Graph,
  current: string,
  target: string,
  visited: string[] = []
): number {
  if (current === target) return 1;
  let totalPaths = 0;
  const nextDevices = graph[current] ?? [];

  for (const next of nextDevices) {
    if (visited.includes(next)) continue;
    totalPaths += countPaths(graph, next, target, [...visited, next]);
  }

  return totalPaths;
}

function partOne(lines: string[]): number {
  const graph = parseInput(lines);

  return countPaths(graph, "you", "out");
}

console.log("Part 1:", partOne(inputData));
