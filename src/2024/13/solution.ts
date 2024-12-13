import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

function partOne(input: string) {
  const machines = input
    .trim()
    .split("\n\n")
    .map((lines) => {
      const [buttonA, buttonB, prize] = lines.split("\n");
      const [c1, c4] = buttonA
        .split(": ")[1]
        .split(", ")
        .map((num) => parseInt(num.split("+")[1]));
      const [c2, c5] = buttonB
        .split(": ")[1]
        .split(", ")
        .map((num) => parseInt(num.split("+")[1]));
      const [c3, c6] = prize
        .split(": ")[1]
        .split(", ")
        .map((num) => parseInt(num.split("=")[1]));
      return { c1, c2, c3, c4, c5, c6 };
    });

  return machines.reduce((sum, machine, i) => {
    const b =
      (machine.c1 * machine.c6 - machine.c4 * machine.c3) /
      (machine.c1 * machine.c5 - machine.c4 * machine.c2);
    const a = (machine.c3 - machine.c2 * b) / machine.c1;

    return sum + (a % 1 === 0 && b % 1 === 0 ? a * 3 + b : 0);
  }, 0);
}

function partTwo(input: string) {
  const machines = input
    .trim()
    .split("\n\n")
    .map((lines) => {
      const [buttonA, buttonB, prize] = lines.split("\n");
      const [c1, c4] = buttonA
        .split(": ")[1]
        .split(", ")
        .map((num) => parseInt(num.split("+")[1]));
      const [c2, c5] = buttonB
        .split(": ")[1]
        .split(", ")
        .map((num) => parseInt(num.split("+")[1]));
      const [c3, c6] = prize
        .split(": ")[1]
        .split(", ")
        .map((num) => parseInt(num.split("=")[1]) + 10000000000000);
      return { c1, c2, c3, c4, c5, c6 };
    });

  return machines.reduce((sum, machine) => {
    const b =
      (machine.c1 * machine.c6 - machine.c4 * machine.c3) /
      (machine.c1 * machine.c5 - machine.c4 * machine.c2);
    const a = (machine.c3 - machine.c2 * b) / machine.c1;

    return sum + (a % 1 === 0 && b % 1 === 0 ? a * 3 + b : 0);
  }, 0);
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
