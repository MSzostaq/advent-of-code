import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .filter((line) => line.trim());

type Coord = [number, number, number];

class UnionFind {
  parent: number[];
  size: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.size[rootX] < this.size[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    }
  }

  getComponentSizes(): number[] {
    const sizeMap = new Map<number, number>();
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      sizeMap.set(root, this.size[root]);
    }
    return Array.from(sizeMap.values()).sort((a, b) => b - a);
  }
}

function parseCoordinates(lines: string[]): Coord[] {
  return lines.map((line) => {
    const [x, y, z] = line.split(",").map(Number);
    return [x, y, z];
  });
}

function distance(a: Coord, b: Coord): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
  );
}

function partOne(coords: Coord[]): number {
  const edges: Array<{ dist: number; a: number; b: number }> = [];

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      edges.push({
        dist: distance(coords[i], coords[j]),
        a: i,
        b: j,
      });
    }
  }

  edges.sort((a, b) => a.dist - b.dist);

  const uf = new UnionFind(coords.length);

  for (let i = 0; i < Math.min(1000, edges.length); i++) {
    uf.union(edges[i].a, edges[i].b);
  }

  const sizes = uf.getComponentSizes();
  return sizes[0] * sizes[1] * sizes[2];
}

function partTwo(coords: Coord[]): number {
  const edges: Array<{ dist: number; a: number; b: number }> = [];

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      edges.push({
        dist: distance(coords[i], coords[j]),
        a: i,
        b: j,
      });
    }
  }

  edges.sort((a, b) => a.dist - b.dist);

  const uf = new UnionFind(coords.length);
  let lastConnectedEdge: { a: number; b: number } | null = null;

  for (const edge of edges) {
    const rootA = uf.find(edge.a);
    const rootB = uf.find(edge.b);

    if (rootA !== rootB) {
      uf.union(edge.a, edge.b);
      lastConnectedEdge = edge;

      const componentSizes = uf.getComponentSizes();
      if (componentSizes.length === 1) {
        break;
      }
    }
  }

  if (!lastConnectedEdge) {
    throw new Error("No connections were made");
  }

  const xCoordA = coords[lastConnectedEdge.a][0];
  const xCoordB = coords[lastConnectedEdge.b][0];

  return xCoordA * xCoordB;
}

console.log("Part 1:", partOne(parseCoordinates(inputData)));
console.log("Part 2:", partTwo(parseCoordinates(inputData)));
