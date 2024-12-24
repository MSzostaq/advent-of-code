import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

function partOne(input: string) {
  const parts = input
    .trim()
    .split("\n\n")
    .map((lines) => lines.split("\n"));
  const wires = parts[0].reduce<{ [key: string]: number }>((obj, line) => {
    const [left, right] = line.split(": ");
    obj[left] = parseInt(right);
    return obj;
  }, {});

  const instructions = parts[1].map((line) => {
    const tokens = line.split(" ");
    return {
      a: tokens[0],
      b: tokens[2],
      c: tokens[4],
      operation: tokens[1],
      executed: false,
    };
  });

  while (instructions.some((instruction) => !instruction.executed)) {
    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i].executed) continue;

      if (
        wires[instructions[i].a] !== undefined &&
        wires[instructions[i].b] !== undefined
      ) {
        if (instructions[i].operation === "AND")
          wires[instructions[i].c] =
            wires[instructions[i].a] & wires[instructions[i].b];
        if (instructions[i].operation === "OR")
          wires[instructions[i].c] =
            wires[instructions[i].a] | wires[instructions[i].b];
        if (instructions[i].operation === "XOR")
          wires[instructions[i].c] =
            wires[instructions[i].a] ^ wires[instructions[i].b];

        instructions[i].executed = true;
      }
    }
  }

  const zWires = Object.keys(wires)
    .filter((wire) => wire[0] === "z")
    .sort()
    .reverse()
    .map((wire) => wires[wire])
    .join("");
  return BigInt("0b" + zWires);
}

console.log("Part 1:", partOne(inputData));
