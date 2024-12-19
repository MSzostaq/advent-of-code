import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

function isPossible(
  design: string,
  memo: { [key: string]: number },
  possible: string[]
): number {
  if (memo[design] !== undefined) return memo[design];
  if (design.length === 0) return 0;

  let count = 0;
  for (let i = 0; i < possible.length; i++) {
    if (design.startsWith(possible[i])) {
      const newDesign = design.slice(possible[i].length);
      count += isPossible(newDesign, memo, possible);
    }
  }

  memo[design] = count;
  return count;
}

function partOne(input: string) {
  const parts = input.trim().split("\n\n");
  const possible = parts[0].replace(/\s/g, "").split(",");
  const designs = parts[1].split("\n");

  const memo: { [key: string]: number } = {};

  const maxLength = possible.sort((a, b) => b.length - a.length)[0].length;
  for (let len = 1; len < maxLength; len++) {
    const current = possible.filter((design) => design.length === len);
    if (len === 1) current.forEach((design) => (memo[design] = 1));
    else
      current.forEach(
        (design) => (memo[design] = isPossible(design, memo, possible) + 1)
      );
  }

  return designs.reduce(
    (sum, design) => sum + (isPossible(design, memo, possible) > 0 ? 1 : 0),
    0
  );
}

console.log("Part 1:", partOne(inputData));
