import fs from "fs";
import path from "path";

type Rule = {
  before: number;
  after: number;
};

type Update = number[];

const filePath = path.resolve(__dirname, "input.txt");
const [rulesSection, updatesSection] = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split("\n\n");

const rules: Rule[] = rulesSection.split("\n").map((rule) => {
  const [before, after] = rule.split("|").map(Number);
  return { before, after };
});

const updates: Update[] = updatesSection
  .split("\n")
  .map((update) => update.split(",").map(Number));

function isUpdateValid(update: Update, rules: Rule[]): boolean {
  const pageIndexMap: Map<number, number> = new Map(
    update.map((page, index) => [page, index])
  );

  for (const { before, after } of rules) {
    if (
      pageIndexMap.has(before) &&
      pageIndexMap.has(after) &&
      pageIndexMap.get(before)! > pageIndexMap.get(after)!
    ) {
      return false;
    }
  }
  return true;
}

function findMiddlePage(update: Update): number {
  const midIndex = Math.floor(update.length / 2);
  return update[midIndex];
}

function fixUpdateOrder(update: Update, rules: Rule[]): Update {
  const ruleMap = new Map<number, Set<number>>();

  for (const { before, after } of rules) {
    if (!ruleMap.has(after)) {
      ruleMap.set(after, new Set());
    }
    ruleMap.get(after)!.add(before);
  }

  return update.slice().sort((a, b) => {
    if (ruleMap.get(a)?.has(b)) {
      return 1;
    }
    if (ruleMap.get(b)?.has(a)) {
      return -1;
    }
    return 0;
  });
}

function partOne(rules: Rule[], updates: Update[]): number {
  let totalMiddleSum = 0;

  for (const update of updates) {
    if (isUpdateValid(update, rules)) {
      totalMiddleSum += findMiddlePage(update);
    }
  }

  return totalMiddleSum;
}

function partTwo(rules: Rule[], updates: Update[]): number {
  let totalMiddleSum = 0;

  for (const update of updates) {
    if (!isUpdateValid(update, rules)) {
      const fixedUpdate = fixUpdateOrder(update, rules);
      totalMiddleSum += findMiddlePage(fixedUpdate);
    }
  }

  return totalMiddleSum;
}

console.log("Part 1:", partOne(rules, updates));
console.log("Part 2:", partTwo(rules, updates));
