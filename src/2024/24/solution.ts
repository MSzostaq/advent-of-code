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

function partTwo(input: string) {
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

  const BIT_LENGTH = 45;

  const incorrect: string[] = [];
  for (let i = 0; i < BIT_LENGTH; i++) {
    const id = i.toString().padStart(2, "0");
    const xor1 = instructions.find(
      (instruction) =>
        ((instruction.a === `x${id}` && instruction.b === `y${id}`) ||
          (instruction.a === `y${id}` && instruction.b === `x${id}`)) &&
        instruction.operation === "XOR"
    );
    const and1 = instructions.find(
      (instruction) =>
        ((instruction.a === `x${id}` && instruction.b === `y${id}`) ||
          (instruction.a === `y${id}` && instruction.b === `x${id}`)) &&
        instruction.operation === "AND"
    );
    const z = instructions.find((instruction) => instruction.c === `z${id}`);

    if (xor1 === undefined || and1 === undefined || z === undefined) continue;

    if (z.operation !== "XOR") incorrect.push(z.c);

    const or = instructions.find(
      (instruction) => instruction.a === and1.c || instruction.b === and1.c
    );
    if (or !== undefined && or.operation !== "OR" && i > 0)
      incorrect.push(and1.c);

    const after = instructions.find(
      (instruction) => instruction.a === xor1.c || instruction.b === xor1.c
    );
    if (after !== undefined && after.operation === "OR") incorrect.push(xor1.c);
  }

  incorrect.push(
    ...instructions
      .filter(
        (instruction) =>
          !instruction.a[0].match(/[xy]/g) &&
          !instruction.b[0].match(/[xy]/g) &&
          !instruction.c[0].match(/[z]/g) &&
          instruction.operation === "XOR"
      )
      .map((instruction) => instruction.c)
  );

  return incorrect.sort().join(",");
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
