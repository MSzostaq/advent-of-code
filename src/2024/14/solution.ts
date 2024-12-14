import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

function partOne(input: string) {
  const robots = input
    .trim()
    .split("\n")
    .map((line) => {
      const [position, velocity] = line.split(" ");
      const [px, py] = position
        .split("=")[1]
        .split(",")
        .map((num) => parseInt(num));
      const [vx, vy] = velocity
        .split("=")[1]
        .split(",")
        .map((num) => parseInt(num));
      return { position: { x: px, y: py }, velocity: { x: vx, y: vy } };
    });

  const width = 101,
    height = 103;

  const quadrants: number[] = [0, 0, 0, 0];
  for (let i = 0; i < robots.length; i++) {
    robots[i].position.x =
      (robots[i].position.x + robots[i].velocity.x * 100 + width * 100) % width;
    robots[i].position.y =
      (robots[i].position.y + robots[i].velocity.y * 100 + height * 100) %
      height;

    if (
      robots[i].position.x === Math.floor(width / 2) ||
      robots[i].position.y === Math.floor(height / 2)
    )
      continue;

    const quadrant =
      Math.floor(robots[i].position.x / Math.ceil(width / 2)) +
      Math.floor(robots[i].position.y / Math.ceil(height / 2)) * 2;
    quadrants[quadrant]++;
  }

  return quadrants.reduce((mul, num) => mul * num, 1);
}

function partTwo(input: string) {
  const robots = input
    .trim()
    .split("\n")
    .map((line) => {
      const [position, velocity] = line.split(" ");
      const [px, py] = position
        .split("=")[1]
        .split(",")
        .map((num) => parseInt(num));
      const [vx, vy] = velocity
        .split("=")[1]
        .split(",")
        .map((num) => parseInt(num));
      return { position: { x: px, y: py }, velocity: { x: vx, y: vy } };
    });

  const width = 101,
    height = 103;

  let step = 0;
  while (true) {
    step++;

    for (let i = 0; i < robots.length; i++) {
      robots[i].position.x =
        (robots[i].position.x + robots[i].velocity.x + width) % width;
      robots[i].position.y =
        (robots[i].position.y + robots[i].velocity.y + height) % height;
    }

    const positions = new Set(
      robots.map((robot) => `${robot.position.x},${robot.position.y}`)
    );

    for (const position of positions) {
      const [x, y] = position.split(",").map((num) => parseInt(num));
      let hasGroup = true;

      for (let j = -2; j <= 2; j++) {
        for (let k = -2; k <= 2; k++) {
          if (!positions.has(`${x + k},${y + j}`)) {
            hasGroup = false;
            break;
          }
        }
        if (!hasGroup) break;
      }

      if (hasGroup) return step;
    }
  }
}

console.log("Part 1:", partOne(inputData));
console.log("Part 2:", partTwo(inputData));
