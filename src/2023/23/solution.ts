import fs from "fs";
import path from "path";

type Position = [number, number];

type Node = {
  p: Position;
  connections: { id: number; distance: number }[];
};

type StackItem = {
  p: Position;
  steps: number;
  lastJuncId: number;
  stepsToLastJunc: number;
  seen?: { [key: string]: number };
};

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const DS: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const D: { [key: string]: number } = { ">": 0, v: 1, "<": 2, "^": 3 };

let map = inputData.split("\n").map((line, y) => line.split("")),
  startPos: Position = [1, 0],
  endPos: Position = [map[0].length - 2, map.length - 1];

const key = (p: Position): string => p[0] + "_" + p[1];
const addVect = (a: Position, b: Position): Position =>
  a.map((v, c) => v + b[c]) as Position;
const validPos = (p: Position) =>
  map[p[1]] !== undefined &&
  map[p[1]][p[0]] !== undefined &&
  map[p[1]][p[0]] !== "#";

const getGraph = (): Node[] => {
  const addConnectNode = (cur: StackItem): number => {
    let newJuncId = nodes.findIndex(
      (n) => n.p[0] === cur.p[0] && n.p[1] === cur.p[1]
    );

    if (newJuncId === cur.lastJuncId) return newJuncId;

    if (newJuncId === -1) {
      newJuncId =
        nodes.push({ p: cur.p.slice() as Position, connections: [] }) - 1;
    }

    let connectionExists = (nodeId: number, targetId: number): boolean =>
      nodes[nodeId].connections.some((conn) => conn.id === targetId);

    if (!connectionExists(cur.lastJuncId, newJuncId)) {
      nodes[cur.lastJuncId].connections.push({
        id: newJuncId,
        distance: cur.steps - cur.stepsToLastJunc,
      });
    }

    if (!connectionExists(newJuncId, cur.lastJuncId)) {
      nodes[newJuncId].connections.push({
        id: cur.lastJuncId,
        distance: cur.steps - cur.stepsToLastJunc,
      });
    }

    return newJuncId;
  };

  let stack: StackItem[] = [
      { p: startPos, steps: 0, lastJuncId: 0, stepsToLastJunc: 0 },
    ],
    nodes: Node[] = [{ p: startPos, connections: [] }],
    seen: { [key: string]: number } = {};

  while (stack.length) {
    let cur = stack.pop();
    if (!cur) continue;

    let k: string = key(cur.p),
      moves = DS.map((d) => addVect(cur.p, d)).filter(validPos);

    if (moves.length > 2) {
      cur.lastJuncId = addConnectNode(cur);
      cur.stepsToLastJunc = cur.steps;
    }

    if (seen[k] !== undefined) continue;
    seen[k] = 1;

    if (cur.p[0] === endPos[0] && cur.p[1] === endPos[1]) {
      addConnectNode(cur);
      continue;
    }

    moves.forEach((np) => {
      stack.push({
        p: [...np],
        steps: cur.steps + 1,
        lastJuncId: cur.lastJuncId,
        stepsToLastJunc: cur.stepsToLastJunc,
      });
    });
  }

  return nodes;
};

const partOne = () => {
  const getMoves = (
    cur: { p: number[]; steps: number; seen: {} } | undefined
  ) => {
    if (!cur) return [];

    type Position = [number, number];
    let moves: Position[] = [],
      v = map[cur.p[1]][cur.p[0]];

    if (D[v] !== undefined) moves.push(addVect(cur.p as Position, DS[D[v]]));
    else DS.forEach((d) => moves.push(addVect(cur.p as Position, d)));

    return moves.filter(
      (p) =>
        validPos(p) && (cur.seen as Record<string, any>)[key(p)] === undefined
    );
  };

  let stack = [
      { p: startPos.slice(), steps: 0, seen: {} as Record<string, any> },
    ],
    maxSteps = 0;

  while (stack.length) {
    let cur = stack.pop();
    if (!cur) continue;

    let k = key(cur.p as [number, number]);
    cur.seen[k] = 1;

    let moves = getMoves(cur);
    while (moves.length == 1) {
      cur.seen[key(moves[0])] = 1;
      cur.steps++;
      cur.p = moves[0];
      moves = getMoves(cur);
    }

    if (cur.p[0] == endPos[0] && cur.p[1] == endPos[1]) {
      maxSteps = Math.max(maxSteps, cur.steps);
      continue;
    }

    moves.forEach((np) =>
      stack.push({
        p: np,
        steps: cur.steps + 1,
        seen: { ...cur.seen },
      })
    );
  }

  return maxSteps;
};

const partTwo = () => {
  let nodes = getGraph();

  let stack = [{ p: 0, steps: 0, seen: {} }],
    endNodeId = nodes.length - 1,
    maxSteps = 0;

  while (stack.length) {
    let cur = stack.pop();
    if (!cur) continue;

    let k = cur.p;
    (cur.seen as Record<number, number>)[k] = 1;

    if (cur.p == endNodeId) {
      maxSteps = Math.max(cur.steps, maxSteps);
      continue;
    }

    nodes[k].connections
      .filter((n) => (cur.seen as Record<number, any>)[n.id] === undefined)
      .forEach((n) =>
        stack.push({
          p: n.id,
          steps: cur.steps + n.distance,
          seen: { ...cur.seen },
        })
      );
  }

  return maxSteps;
};

console.log(partOne());
console.log(partTwo());
