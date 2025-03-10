import fs from "fs";
import path from "path";

type Instruction = "R" | "L";

type Node = { L: string; R: string };
interface Problem {
  instructions: Instruction[];
  nodes: Record<string, Node>;
}

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const parseInput = (input: string): Problem => {
  const [line1, _, ...lines] = input.split("\n");
  const nodes: Record<string, Node> = {};
  lines.forEach(
    (line) =>
      (nodes[line.slice(0, 3)] = {
        L: line.slice(7, 10),
        R: line.slice(12, 15),
      })
  );

  return {
    instructions: [...line1] as Instruction[],
    nodes,
  };
};

const loop = <T>(arr: T[], callback: (val: T) => boolean) => {
  for (let i = 0; callback(arr[i]); i = (i + 1) % arr.length);
};

const partOne = (input: string) => {
  const { instructions, nodes } = parseInput(input);
  let steps = 0;
  let curr = "AAA";
  loop(
    instructions,
    (instr) => (++steps, (curr = nodes[curr][instr]), curr !== "ZZZ")
  );
  return steps;
};

const partTwo = (input: string) => {
  const { instructions, nodes } = parseInput(input);
  const starts = Object.keys(nodes).filter((id) => id[2] === "A");
  const lengths = starts.map((curr) => {
    let steps = 0;
    loop(
      instructions,
      (instr) => (++steps, (curr = nodes[curr][instr]), curr[2] !== "Z")
    );
    return steps;
  });

  const gcd = (a: number, b: number) => {
    while (b > 0) [a, b] = [b, a % b];
    return a;
  };
  const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
  return lengths.reduce((n, x) => lcm(x, n), 1);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
