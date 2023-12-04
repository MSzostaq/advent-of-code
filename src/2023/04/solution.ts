import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);

const partOne = (input: string[]) => {
  let points = 0;
  let cards = [];

  for (let i = 0; i < input.length; i++) {
    let gameData = input[i].substring(input[i].indexOf(":") + 1);
    let parts = gameData.split("|");
    let winningNumbers = parts[0].trim().split(" ");
    let winningLookup: { [key: string]: boolean } = {};
    let count = 0;
    for (let j = 0; j < winningNumbers.length; j++) {
      if (winningNumbers[j] == "") {
        continue;
      }
      let number = Number(winningNumbers[j]);
      winningLookup[number] = true;
    }
    let myNumbers = parts[1].trim().split(" ");
    for (let j = 0; j < myNumbers.length; j++) {
      let number = Number(myNumbers[j]);
      if (winningLookup[number]) {
        count++;
      }
    }

    cards.push({ name: i, matches: count, processed: false });
    if (count > 0) {
      points = points + 2 ** (count - 1);
    }
  }
  return points;
};

const partTwo = (input: string[]) => {
  let points = 0;
  let cards = [];

  for (let i = 0; i < input.length; i++) {
    let gameData = input[i].substring(input[i].indexOf(":") + 1);
    let parts = gameData.split("|");
    let winningNumbers = parts[0].trim().split(" ");
    let winningLookup: { [key: string]: boolean } = {};
    let count = 0;
    for (let j = 0; j < winningNumbers.length; j++) {
      if (winningNumbers[j] == "") {
        continue;
      }
      let number = Number(winningNumbers[j]);
      winningLookup[number] = true;
    }
    let myNumbers = parts[1].trim().split(" ");
    for (let j = 0; j < myNumbers.length; j++) {
      let number = Number(myNumbers[j]);
      if (winningLookup[number]) {
        count++;
      }
    }

    cards.push({ name: i, matches: count, processed: false });
    if (count > 0) {
      points = points + 2 ** (count - 1);
    }
  }

  let index = 0;
  while (index < cards.length) {
    let name: number = cards[index].name;

    for (let i = 0; i < cards[index].matches; i++) {
      cards.push({
        name: cards[name + i + 1].name,
        matches: cards[name + i + 1].matches,
        processed: false,
      });
    }
    cards[index].processed = true;
    index++;
  }

  return cards.length;
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
