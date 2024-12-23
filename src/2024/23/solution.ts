import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim();

const findSet = (
  graph: { [key: string]: string[] },
  path: string[],
  size: number
): string[][] => {
  const current = path.at(-1) as string;
  if (path.length === size + 1) {
    if (current === path[0]) return [path.slice(0, size)];
    else return [];
  }

  if (new Set(path).size !== path.length) return [];

  const allSets: string[][] = [];
  for (let i = 0; i < graph[current].length; i++) {
    path.push(graph[current][i]);
    const sets = findSet(graph, path, size);
    path.pop();

    if (sets.length > 0) allSets.push(...sets);
  }
  return allSets;
};

function combination(array: string[], k: number) {
  let result: string[][] = [];

  const helper = (
    _array: string[],
    _k: number,
    _i: number,
    _current: string[]
  ) => {
    if (_current.length == k) result.push(_current);
    if (_current.length == k || _i == _array.length) return;

    helper(_array, _k, _i + 1, [_array[_i], ..._current]);
    helper(_array, _k, _i + 1, [..._current]);
  };

  helper(array, k, 0, []);
  return result;
}

function partOne(input: string) {
  const graph = input
    .trim()
    .split("\n")
    .reduce<{ [key: string]: string[] }>((obj, line) => {
      const [left, right] = line.split("-");
      if (obj[left] === undefined) obj[left] = [];
      if (obj[right] === undefined) obj[right] = [];

      obj[left].push(right);
      obj[right].push(left);
      return obj;
    }, {});

  let allSets = new Set<string>();
  Object.keys(graph).forEach((node) => {
    allSets = allSets.union(
      new Set(findSet(graph, [node], 3).map((set) => set.sort().join(",")))
    );
  });

  return Array.from(allSets).reduce((sum, set) => {
    if (set.split(",").find((node) => node.startsWith("t")) !== undefined)
      sum++;
    return sum;
  }, 0);
}

function partTwo(input: string) {
  const graph = input
    .trim()
    .split("\n")
    .reduce<{ [key: string]: string[] }>((obj, line) => {
      const [left, right] = line.split("-");
      if (obj[left] === undefined) obj[left] = [];
      if (obj[right] === undefined) obj[right] = [];

      obj[left].push(right);
      obj[right].push(left);
      return obj;
    }, {});

  const MAX_LENGTH = Math.max(
    ...Object.values(graph).map((array) => array.length)
  );

  let biggest: string[] = [];
  Object.keys(graph).forEach((node) => {
    const possible = combination(graph[node].sort(), MAX_LENGTH - 1);
    for (let i = 0; i < possible.length; i++) {
      let common = new Set([node, ...graph[node]].sort());
      for (let j = 0; j < possible[i].length; j++)
        common = common.intersection(
          new Set([possible[i][j], ...graph[possible[i][j]]].sort())
        );
      if (common.size === MAX_LENGTH) biggest = Array.from(common);
    }
  });

  return biggest;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
