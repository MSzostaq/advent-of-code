import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").split("\n");

function parseProblems(
  lines: string[]
): Array<{ numbers: number[]; operation: string }> {
  const problems: Array<{ numbers: number[]; operation: string }> = [];
  const maxLength = Math.max(...lines.map((l) => l.length));
  const paddedLines = lines.map((l) => l.padEnd(maxLength, " "));

  let col = 0;
  while (col < maxLength) {
    const isEmptyColumn = paddedLines.every((l) => l[col] === " ");
    if (isEmptyColumn) {
      col++;
      continue;
    }

    let blockEnd = col;
    while (blockEnd < maxLength) {
      const nonEmpty = paddedLines.some((l) => l[blockEnd] !== " ");
      if (!nonEmpty) break;
      blockEnd++;
    }

    const block = paddedLines.map((line) =>
      line.slice(col, blockEnd).trimEnd()
    );

    const operationLine = block[block.length - 1].trim();
    if (!operationLine) {
      col = blockEnd + 1;
      continue;
    }

    const operation = operationLine.match(/[+*]/)?.[0] ?? "";
    const numbers: number[] = [];

    for (let i = 0; i < block.length - 1; i++) {
      const n = block[i].trim();
      if (n && !isNaN(Number(n))) {
        numbers.push(Number(n));
      }
    }

    if (numbers.length > 0 && operation) {
      problems.push({ numbers, operation });
    }

    col = blockEnd + 1;
  }

  return problems;
}

function solveProblem(numbers: number[], operation: string): number {
  if (numbers.length === 0) return 0;

  return operation === "+"
    ? numbers.reduce((a, b) => a + b, 0)
    : numbers.reduce((a, b) => a * b, 1);
}

function parseProblemsPartTwo(
  lines: string[]
): Array<{ numbers: number[]; operation: string }> {
  const problems: Array<{ numbers: number[]; operation: string }> = [];
  const maxLength = Math.max(...lines.map((l) => l.length));
  const paddedLines = lines.map((l) => l.padEnd(maxLength, " "));

  let operation = "";
  let currentProblem: number[] = [];

  for (let col = maxLength - 1; col >= 0; col--) {
    const isEmptyColumn = paddedLines.every((l) => l[col] === " ");

    if (isEmptyColumn) {
      if (currentProblem.length > 0 || operation) {
        if (operation && currentProblem.length > 0) {
          problems.push({
            numbers: currentProblem.reverse(),
            operation,
          });
          currentProblem = [];
          operation = "";
        }
      }
    } else {
      let numStr = "";
      for (let row = 0; row < paddedLines.length - 1; row++) {
        const char = paddedLines[row][col];
        if (char && char !== " ") numStr += char;
      }

      const opChar = paddedLines[paddedLines.length - 1][col];
      if (opChar && (opChar === "+" || opChar === "*")) {
        operation = opChar;
      }

      if (numStr) {
        currentProblem.push(Number(numStr));
      }
    }
  }

  if (currentProblem.length > 0 && operation) {
    problems.push({
      numbers: currentProblem.reverse(),
      operation,
    });
  }

  return problems;
}

function partOne(lines: string[]): number {
  const problems = parseProblems(lines);
  let grandTotal = 0;

  for (const problem of problems) {
    const answer = solveProblem(problem.numbers, problem.operation);
    grandTotal += answer;
  }

  return grandTotal;
}

function partTwo(lines: string[]): number {
  const problems = parseProblemsPartTwo(lines);
  let grandTotal = 0;

  for (const problem of problems) {
    const answer = solveProblem(problem.numbers, problem.operation);
    grandTotal += answer;
  }

  return grandTotal;
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
