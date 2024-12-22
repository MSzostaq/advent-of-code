import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim();

function evolveSecretNumber(secret: bigint) {
  secret = (secret ^ (secret * 64n)) % 16777216n;
  secret = (secret ^ (secret / 32n)) % 16777216n;
  secret = (secret ^ (secret * 2048n)) % 16777216n;

  return secret;
}

function partOne(input: string) {
  return input
    .split("\n")
    .map((num) => BigInt(num))
    .reduce((sum, num) => {
      let seed = num;
      for (let i = 0; i < 2000; i++) {
        seed = evolveSecretNumber(seed);
      }
      return sum + seed;
    }, 0n);
}

console.log("Part 1:", partOne(inputData));
