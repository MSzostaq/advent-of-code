import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim();

function evolveSecretNumber(secret: bigint) {
  secret = (secret ^ (secret * 64n)) % 16777216n;
  secret = (secret ^ (secret / 32n)) % 16777216n;
  secret = (secret ^ (secret * 2048n)) % 16777216n;

  return secret;
}

function partOne(input: string) {
  return input
    .split("\n")
    .map((num) => BigInt(num))
    .reduce((sum, num) => {
      let seed = num;
      for (let i = 0; i < 2000; i++) {
        seed = evolveSecretNumber(seed);
      }
      return sum + seed;
    }, 0n);
}

function partTwo(input: string) {
  const ranges: { [key: string]: number[] } = {};
  input
    .split("\n")
    .map((num) => BigInt(num))
    .forEach((num) => {
      let seed = num;
      const visited = new Set<string>();
      const changes: number[] = [];
      for (let i = 0; i < 2000; i++) {
        const nextSeed = evolveSecretNumber(seed);
        changes.push(Number((nextSeed % 10n) - (seed % 10n)));
        seed = nextSeed;

        if (changes.length === 4) {
          const key = changes.join(",");
          if (!visited.has(key)) {
            if (ranges[key] === undefined) ranges[key] = [];
            ranges[key].push(Number(nextSeed % 10n));
            visited.add(key);
          }
          changes.shift();
        }
      }
    });

  return Math.max(
    ...Object.values(ranges).map((range) =>
      range.reduce((sum, num) => sum + num, 0)
    )
  );
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
