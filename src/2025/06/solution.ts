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

function partOne(lines: string[]): number {
  const problems = parseProblems(lines);
  let grandTotal = 0;

  for (const problem of problems) {
    const answer = solveProblem(problem.numbers, problem.operation);
    grandTotal += answer;
  }

  return grandTotal;
}

console.log("Part 1:", partOne(inputData));
