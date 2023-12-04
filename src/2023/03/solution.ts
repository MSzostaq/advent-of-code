import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs
  .readFileSync(filePath, "utf-8")
  .split(/\n/g)
  .map((line) => line.split(""));

const partOne = (input: string[][]) => {
  let sum = 0;

  for (let y = 0; y < input.length; y++) {
    let currentNumber = "",
      checkNumber = false,
      nearSymbol = false;

    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x].match(/[0-9]/) && !checkNumber) {
        checkNumber = true;
        currentNumber = "";
        nearSymbol = false;
      }

      if (
        (x == input[y].length - 1 || !input[y][x].match(/[0-9]/)) &&
        checkNumber
      ) {
        if (nearSymbol)
          sum += parseInt(
            currentNumber + (input[y][x].match(/[0-9]/) ? input[y][x] : "")
          );
        checkNumber = false;
      }

      if (checkNumber) {
        currentNumber += input[y][x];

        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            if (i == 0 && j == 0) continue;
            if (
              y + j < 0 ||
              y + j >= input.length ||
              x + i < 0 ||
              x + i >= input[y].length
            )
              continue;

            if (!input[y + j][x + i].match(/[0-9.]/)) nearSymbol = true;
          }
        }
      }
    }
  }

  return sum;
};

const partTwo = (input: string[][]) => {
  let gearNumbers: { [key: string]: number[] } = {};

  for (let y = 0; y < input.length; y++) {
    let currentNumber = "",
      checkNumber = false,
      gearLocation = null;

    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x].match(/[0-9]/) && !checkNumber) {
        checkNumber = true;
        currentNumber = "";
        gearLocation = null;
      }

      if (
        (x == input[y].length - 1 || !input[y][x].match(/[0-9]/)) &&
        checkNumber
      ) {
        if (gearLocation)
          gearNumbers[gearLocation].push(
            parseInt(
              currentNumber + (input[y][x].match(/[0-9]/) ? input[y][x] : "")
            )
          );
        checkNumber = false;
      }

      if (checkNumber) {
        currentNumber += input[y][x];

        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            if (i == 0 && j == 0) continue;
            if (
              y + j < 0 ||
              y + j >= input.length ||
              x + i < 0 ||
              x + i >= input[y].length
            )
              continue;

            const char = input[y + j][x + i];
            if (char == "*") {
              gearLocation = `${x + i},${y + j}`;
              if (gearNumbers[gearLocation] == null)
                gearNumbers[gearLocation] = [];
            }
          }
        }
      }
    }
  }

  return Object.values(gearNumbers).reduce((sum, array) => {
    if (array.length == 2) sum += array[0] * array[1];
    return sum;
  }, 0);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
