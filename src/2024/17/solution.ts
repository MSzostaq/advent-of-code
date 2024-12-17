import fs from "fs";
import path from "path";

interface Computer {
  registers: {
    A: number;
    B: number;
    C: number;
  };
  instructionPointer: number;
  output: number[];
}

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

function parseInput(input: string): {
  registers: Computer["registers"];
  program: number[];
} {
  const lines = input.trim().split("\n");
  const registers = {
    A: parseInt(lines[0].split(": ")[1]),
    B: parseInt(lines[1].split(": ")[1]),
    C: parseInt(lines[2].split(": ")[1]),
  };

  const program = lines[4].split(": ")[1].split(",").map(Number);

  return { registers, program };
}

function getComboOperandValue(
  operand: number,
  registers: Computer["registers"]
): number {
  if (operand <= 3) return operand;
  if (operand === 4) return registers.A;
  if (operand === 5) return registers.B;
  if (operand === 6) return registers.C;
  return 0;
}

function executeInstruction(computer: Computer, program: number[]): boolean {
  if (computer.instructionPointer >= program.length) return false;

  const opcode = program[computer.instructionPointer];
  const operand = program[computer.instructionPointer + 1];

  switch (opcode) {
    case 0:
      computer.registers.A = Math.floor(
        computer.registers.A /
          Math.pow(2, getComboOperandValue(operand, computer.registers))
      );
      break;
    case 1:
      computer.registers.B ^= operand;
      break;
    case 2:
      computer.registers.B =
        getComboOperandValue(operand, computer.registers) % 8;
      break;
    case 3:
      if (computer.registers.A !== 0) {
        computer.instructionPointer = operand;
        return true;
      }
      break;
    case 4:
      computer.registers.B ^= computer.registers.C;
      break;
    case 5:
      computer.output.push(
        getComboOperandValue(operand, computer.registers) % 8
      );
      break;
    case 6:
      computer.registers.B = Math.floor(
        computer.registers.A /
          Math.pow(2, getComboOperandValue(operand, computer.registers))
      );
      break;
    case 7:
      computer.registers.C = Math.floor(
        computer.registers.A /
          Math.pow(2, getComboOperandValue(operand, computer.registers))
      );
      break;
  }

  computer.instructionPointer += 2;
  return true;
}

function partOne(input: string): string {
  const { registers, program } = parseInput(input);

  const computer: Computer = {
    registers,
    instructionPointer: 0,
    output: [],
  };

  while (executeInstruction(computer, program)) {}

  return computer.output.join(",");
}

console.log("Part 1:", partOne(inputData));
