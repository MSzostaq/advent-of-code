import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim();

function changeStones(stones: { [key: string]: number }, steps: number) {
  for (let step = 0; step < steps; step++) {
    const newStones: { [key: string]: number } = {};
    Object.entries(stones).forEach(([stone, count]) => {
      if (parseInt(stone) === 0) newStones[1] = (newStones[1] || 0) + count;
      else if (stone.length % 2 === 0) {
        const left = parseInt(stone.slice(0, stone.length / 2));
        const right = parseInt(stone.slice(stone.length / 2));

        newStones[left] = (newStones[left] || 0) + count;
        newStones[right] = (newStones[right] || 0) + count;
      } else
        newStones[parseInt(stone) * 2024] =
          (newStones[parseInt(stone) * 2024] || 0) + count;
    });
    stones = newStones;
  }

  return stones;
}

function partOne(input: string) {
  const stones = input.split(" ").map((num) => parseInt(num));
  let stoneCounts: { [key: string]: number } = {};

  stones.forEach(
    (stone) => (stoneCounts[stone] = (stoneCounts[stone] || 0) + 1)
  );

  return Object.values(changeStones(stoneCounts, 25)).reduce(
    (sum, num) => sum + num,
    0
  );
}

function partTwo(input: string) {
  const stones = input.split(" ").map((num) => parseInt(num));
  let stoneCounts: { [key: string]: number } = {};

  stones.forEach(
    (stone) => (stoneCounts[stone] = (stoneCounts[stone] || 0) + 1)
  );

  return Object.values(changeStones(stoneCounts, 75)).reduce(
    (sum, num) => sum + num,
    0
  );
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
