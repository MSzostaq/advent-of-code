import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim().split("\n");

function parseMap(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

function findLocations(map: string[][]): Record<string, [number, number][]> {
  return map.reduce((locations, row, y) => {
    row.forEach((char, x) => {
      if (char === ".") return;
      if (!locations[char]) locations[char] = [];
      locations[char].push([x, y]);
    });
    return locations;
  }, {} as Record<string, [number, number][]>);
}

function calculateAntinodes(
  map: string[][],
  locations: Record<string, [number, number][]>
): number {
  const width = map[0].length;
  const height = map.length;
  const antinodes: [number, number][] = [];

  Object.values(locations).forEach((locs) => {
    if (locs.length <= 1) return;

    for (let i = 0; i < locs.length; i++) {
      for (let j = 0; j < locs.length; j++) {
        if (i === j) continue;

        const [xi, yi] = locs[i];
        const [xj, yj] = locs[j];

        const potentialAntinodes = [
          [xi * 2 - xj, yi * 2 - yj],
          [xj * 2 - xi, yj * 2 - yi],
        ];

        potentialAntinodes.forEach(([x, y]) => {
          if (
            x >= 0 &&
            y >= 0 &&
            x < width &&
            y < height &&
            !antinodes.some(([ax, ay]) => ax === x && ay === y)
          ) {
            antinodes.push([x, y]);
          }
        });
      }
    }
  });

  return antinodes.length;
}

function partOne(input: string[]): number {
  const map = parseMap(input);
  const locations = findLocations(map);
  const antinodeCount = calculateAntinodes(map, locations);

  return antinodeCount;
}

console.log("Part 1:", partOne(inputData));
