import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

function countWays(
  design: string,
  memo: Map<string, number>,
  possible: string[]
): number {
  if (memo.has(design)) return memo.get(design)!;

  if (design.length === 0) return 1;

  let totalWays = 0;

  for (const pattern of possible) {
    if (design.startsWith(pattern)) {
      const remaining = design.slice(pattern.length);
      totalWays += countWays(remaining, memo, possible);
    }
  }

  memo.set(design, totalWays);
  return totalWays;
}

function partOne(input: string): number {
  const [patternsRaw, designsRaw] = input.trim().split("\n\n");
  const patterns = patternsRaw.replace(/\s/g, "").split(",");
  const designs = designsRaw.split("\n");

  return designs.reduce((sum, design) => {
    const memo = new Map<string, number>();
    return sum + (countWays(design, memo, patterns) > 0 ? 1 : 0);
  }, 0);
}

function partTwo(input: string): number {
  const [patternsRaw, designsRaw] = input.trim().split("\n\n");
  const patterns = patternsRaw.replace(/\s/g, "").split(",");
  const designs = designsRaw.split("\n");

  return designs.reduce((sum, design) => {
    const memo = new Map<string, number>();
    return sum + countWays(design, memo, patterns);
  }, 0);
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
