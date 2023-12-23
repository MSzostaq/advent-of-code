import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8").trim().split("\n");
const bricks = inputData.map((line) =>
  line.replace("~", ",").split(",").map(Number)
);

bricks.sort((a, b) => a[2] - b[2]);

const overlaps = (a: number[], b: number[]) => {
  return (
    Math.max(a[0], b[0]) <= Math.min(a[3], b[3]) &&
    Math.max(a[1], b[1]) <= Math.min(a[4], b[4])
  );
};

for (let index = 0; index < bricks.length; index++) {
  let max_z = 1;
  for (let i = 0; i < index; i++) {
    const check = bricks[i];
    if (overlaps(bricks[index], check)) {
      max_z = Math.max(max_z, check[5] + 1);
    }
  }
  bricks[index][5] -= bricks[index][2] - max_z;
  bricks[index][2] = max_z;
}

bricks.sort((a, b) => a[2] - b[2]);

const k_supports_v = new Array(bricks.length).fill(null).map(() => new Array());
const v_supports_k = new Array(bricks.length).fill(null).map(() => new Array());

for (let j = 0; j < bricks.length; j++) {
  const upper = bricks[j];
  for (let i = 0; i < j; i++) {
    const lower = bricks[i];
    if (overlaps(lower, upper) && upper[2] === lower[5] + 1) {
      k_supports_v[i].push(j);
      v_supports_k[j].push(i);
    }
  }
}

let total = 0;

k_supports_v.forEach((bricks) => {
  bricks.every((j) => v_supports_k[j].length > 1) ? total++ : null;
});

console.log("partOne:", total);

let sum = 0;
for (let i = 0; i < bricks.length; i++) {
  total = 0;
  let set = new Set();
  set.add(i);

  let sublist = k_supports_v.slice(i);
  sublist.forEach((bricks) => {
    for (let brick of bricks) {
      if (v_supports_k[brick].every((b) => set.has(b))) {
        if (!set.has(brick)) {
          set.add(brick);
          total++;
        }
      }
    }
  });
  sum += total;
}

console.log("partTwo:", sum);
