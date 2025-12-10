import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .filter((line) => line.length > 0);

interface Machine {
  target: boolean[];
  buttons: number[][];
}

function parseInput(lines: string[]): Machine[] {
  return lines.map((line) => {
    const lightMatch = line.match(/\[([.#]+)\]/);
    if (!lightMatch) throw new Error("Invalid light format");

    const target = lightMatch[1].split("").map((c) => c === "#");
    const buttonMatches = line.match(/\(([0-9,]+)\)/g);
    if (!buttonMatches) throw new Error("Invalid button format");

    const buttons = buttonMatches.map((match) => {
      const numbers = match.slice(1, -1).split(",").map(Number);
      return numbers;
    });

    return { target, buttons };
  });
}

function findMinButtonPresses(machine: Machine): number {
  const numLights = machine.target.length;
  const numButtons = machine.buttons.length;

  let minPresses = Infinity;

  for (let mask = 0; mask < 1 << numButtons; mask++) {
    const lights = new Array(numLights).fill(false);
    let totalPresses = 0;

    for (let button = 0; button < numButtons; button++) {
      if (mask & (1 << button)) {
        totalPresses++;
        for (const lightIndex of machine.buttons[button]) {
          lights[lightIndex] = !lights[lightIndex];
        }
      }
    }

    let matches = true;
    for (let i = 0; i < numLights; i++) {
      if (lights[i] !== machine.target[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      minPresses = Math.min(minPresses, totalPresses);
    }
  }

  return minPresses === Infinity ? 0 : minPresses;
}

function partOne(lines: string[]): number {
  const machines = parseInput(lines);
  return machines.reduce((total, machine) => {
    return total + findMinButtonPresses(machine);
  }, 0);
}

console.log("Part 1:", partOne(inputData));
