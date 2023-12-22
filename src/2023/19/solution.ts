import fs from "fs";
import path from "path";
import { cloneDeep } from "lodash";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").replace(/\r/g, "");

const parseAll = (input: string) => {
  const [rulesInput, partsInput] = input.split("\n\n");

  const parts: Part[] = partsInput.split("\n").map((line) => {
    const match = line.match(/^{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}$/);
    if (!match) {
      throw new Error(`Invalid part format: ${line}`);
    }
    const [_, x, m, a, s] = match;
    return {
      x: Number(x),
      m: Number(m),
      a: Number(a),
      s: Number(s),
    };
  });

  const workflows = new Map<string, RuleSet>();

  for (let line of rulesInput.split("\n")) {
    const match = line.match(/^(\S+){(\S+)}$/);

    if (!match) {
      throw new Error(`Invalid workflow format: ${line}`);
    }

    const [_, name, ruleList] = match;

    const ruleSet = ruleList.split(",").reduce((acc, rule) => {
      if (!rule.includes(":")) {
        acc.set("goto", rule);
      } else {
        const [cond, goto] = rule.split(":");
        acc.set(cond, goto);
      }

      return acc;
    }, new Map<string, string>());

    workflows.set(name, ruleSet);
  }
  return { parts, workflows };
};

const process = (part: Part, workflow: RuleSet): string => {
  for (let [cond, dest] of workflow) {
    if (cond === "goto") return dest;

    const [cat, numStr] = cond.split(/[<>]/);
    const num = Number(numStr);

    if (!part.hasOwnProperty(cat)) {
      throw new Error(`Invalid category in condition: ${cat}`);
    }

    const category = cat as keyof Part; // Type assertion
    const partValue = part[category];

    if (cond.includes("<")) {
      if (partValue < num) return dest;
    } else if (cond.includes(">")) {
      if (partValue > num) return dest;
    } else {
      throw new Error("Invalid condition");
    }
  }
  throw new Error("No valid transition found in workflow");
};

const isAccepting = (part: Part, workflows: Map<string, RuleSet>): boolean => {
  let node = "in";
  while (node !== "A" && node !== "R") {
    const currentWorkflow = workflows.get(node);
    if (!currentWorkflow) {
      throw new Error(`Workflow not found: ${node}`);
    }
    node = process(part, currentWorkflow);
  }
  return node === "A";
};

const filterParts = (input: string): Part[] => {
  const { parts, workflows } = parseAll(input);

  return parts.filter((part) => isAccepting(part, workflows));
};

const processRange = (
  range: Range,
  workflows: Map<string, RuleSet>
): Range[] => {
  const rules = workflows.get(range.next);
  if (!rules) throw new Error(`Workflow not found: ${range.next}`);
  const nextRanges: Range[] = [];

  for (let [cond, dest] of rules) {
    if (cond === "goto") {
      range.next = dest;
      nextRanges.push(range);
      break;
    }
    const [cat, n] = cond.split(/[<>]/);
    const num = Number(n);

    if (!("x" in range && "m" in range && "a" in range && "s" in range)) {
      throw new Error("Invalid range keys");
    }

    const category = cat as keyof Omit<Range, "next">;
    const isLessThan = cond.includes("<");
    const isGreaterThan = cond.includes(">");

    if (isLessThan) {
      if (range[category][1] <= num) {
        range.next = dest;
        nextRanges.push(range);
        break;
      } else if (range[category][0] < num) {
        const split = cloneDeep(range);
        split[category][1] = num;
        split.next = dest;
        nextRanges.push(split);

        range[category][0] = num;
      }
    } else if (isGreaterThan) {
      if (range[category][0] > num) {
        range.next = dest;
        nextRanges.push(range);
        break;
      } else if (range[category][1] > num + 1) {
        const split = cloneDeep(range);
        split[category][0] = num + 1;
        split.next = dest;
        nextRanges.push(split);

        range[category][1] = num + 1;
      }
    }
  }
  return nextRanges;
};

const partOne = (input: string): number => {
  const filteredParts = filterParts(input);

  return filteredParts
    .map(({ x, m, a, s }) => x + m + a + s)
    .reduce((a, b) => a + b, 0);
};

const partTwo = (input: string): number => {
  const { workflows } = parseAll(input);

  const ranges: Range[] = [
    {
      x: [1, 4001],
      m: [1, 4001],
      a: [1, 4001],
      s: [1, 4001],
      next: "in",
    },
  ];
  const accepted: Range[] = [];

  while (ranges.length) {
    const range = ranges.pop();
    if (!range) {
      break;
    }

    const next = processRange(range, workflows).filter((r) => {
      if (r.next === "R") return false;
      if (r.next === "A") {
        accepted.push(r);
        return false;
      }
      return true;
    });
    ranges.push(...next);
  }

  return accepted
    .map(
      ({ x, m, a, s }) =>
        (x[1] - x[0]) * (m[1] - m[0]) * (a[1] - a[0]) * (s[1] - s[0])
    )
    .reduce((a, b) => a + b, 0);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type RuleSet = Map<string, string>;

type Range = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
  next: string;
};
