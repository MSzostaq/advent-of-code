import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const partOne = (input: string) => {
  let match;
  const cols: string[] = [];
  const rows = input.split("\n");

  for (let i = 0; i < rows[0].length; i++)
    cols.push(rows.map((r) => r[i]).join(""));

  return cols.reduce<number>((sum, col) => {
    const rockRx = /[O.]+/g;
    while ((match = rockRx.exec(col))) {
      if (!match[0].includes("O")) continue;
      for (let i = 0; i < match[0].split("O").length - 1; i++) {
        sum += cols.length - match.index - i;
      }
    }
    return sum;
  }, 0);
};

const partTwo = (input: string) => {
  const grid = input.split("\n").map((row) => row.split(""));

  const tilt = (dir: string) => {
    let i, j, k;

    if (dir === "north") {
      for (i = 0; i < grid.length; i++)
        for (j = 0; j < grid[i].length; j++) {
          if (grid[i][j] !== "O") continue;
          grid[i][j] = ".";
          for (k = i; k >= 0 && grid[k][j] === "."; k--) {}
          grid[k + 1][j] = "O";
        }
    } else if (dir === "west") {
      for (j = 0; j < grid[0].length; j++)
        for (i = 0; i < grid.length; i++) {
          if (grid[i][j] !== "O") continue;
          grid[i][j] = ".";
          for (k = j; k >= 0 && grid[i][k] === "."; k--) {}
          grid[i][k + 1] = "O";
        }
    } else if (dir === "south") {
      for (i = grid.length - 1; i >= 0; i--)
        for (j = 0; j < grid[i].length; j++) {
          if (grid[i][j] !== "O") continue;
          grid[i][j] = ".";
          for (k = i; k < grid.length && grid[k][j] === "."; k++) {}
          grid[k - 1][j] = "O";
        }
    } else if (dir === "east") {
      for (j = grid[0].length - 1; j >= 0; j--)
        for (i = 0; i < grid.length; i++) {
          if (grid[i][j] !== "O") continue;
          grid[i][j] = ".";
          for (k = j; k < grid[i].length && grid[i][k] === "."; k++) {}
          grid[i][k - 1] = "O";
        }
    }
  };

  const stringify = () => grid.map((r) => r.join("")).join("\n");

  const states = [stringify()];
  let cycleStart = -1;

  while (true) {
    tilt("north");
    tilt("west");
    tilt("south");
    tilt("east");
    const curr = stringify();
    cycleStart = states.indexOf(curr);
    if (cycleStart >= 0) break;
    states.push(curr);
  }

  const northernLoad = (state: string) => {
    const rows = state.split("\n");
    return rows.reduce((sum, row, i) => {
      return sum + (row.split("O").length - 1) * (rows.length - i);
    }, 0);
  };

  return northernLoad(
    states[
      cycleStart + ((1000000000 - cycleStart) % (states.length - cycleStart))
    ]
  );
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
