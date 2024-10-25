import fs from "fs";
import path from "path";

type LogicItem = [string, "bc" | "&" | "%", string[]];

type Broadcaster = { type: "bc"; dest: string[] };

type FlipFlop = { type: "%"; state: boolean; dest: string[] };

type Conjunction = {
  type: "&";
  state: Record<string, boolean>;
  dest: string[];
};

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const config = inputData.split("\n").map((line) => {
  const [device, destination] = line.split("->");
  const dest = destination.split(",").map((d) => d.trim());

  if (device.trim() === "broadcaster") return ["broadcaster", "bc", dest];

  return [device.slice(1).trim(), device[0], dest];
}) as LogicItem[];

const state = new Map<string, FlipFlop | Conjunction | Broadcaster>();

config.forEach(([id, type, dest]) => {
  if (type === "%") state.set(id, { type, state: false, dest });
  if (type === "&") state.set(id, { type, state: {}, dest });
  if (type === "bc") state.set(id, { type, dest });
});

config.forEach(([id, type]) => {
  if (type !== "&") return;
  const inputs = config.filter((el) => el[2].includes(id)).map((el) => el[0]);
  const item = state.get(id);
  if (item?.type != "&") throw new Error("Wrong device type");
  inputs.forEach((input) => (item.state[input] = false));
});

const heap: [string, boolean, string][] = [];

const flipFlop = (id: string, input: boolean) => {
  if (input) return;
  const item = state.get(id);
  if (item?.type !== "%") throw new Error("Wrong device type");
  item.state = !item.state;
  item.dest.forEach((d) => heap.push([d, item.state, id]));
};

const broadcaster = (id: string, input: boolean) => {
  if (input) return;
  const item = state.get(id);
  if (item?.type !== "bc") throw new Error("Wrong device type");
  item.dest.forEach((d) => heap.push([d, input, id]));
};

const conjunction = (id: string, input: boolean, origin: string) => {
  const item = state.get(id);

  if (item?.type !== "&") throw new Error("Wrong device type");
  item.state[origin] = input;

  if (Object.values(item.state).every((value) => value === true)) {
    item.dest.forEach((d) => heap.push([d, false, id]));
  } else {
    item.dest.forEach((d) => heap.push([d, true, id]));
  }
};

function solve() {
  let hi = 0;
  let lo = 0;
  let nd = 0;
  let pc = 0;
  let vd = 0;
  let tx = 0;

  let buttonPresses = 1;

  while (nd * pc * vd * tx === 0) {
    heap.push(["broadcaster", false, "button"]);

    while (heap.length) {
      const operation = heap.shift();

      if (!operation) {
        console.error("No operation found");
        break;
      }

      const [dest, pulse, origin] = operation;
      if (dest === "output") continue;

      if (buttonPresses < 1001) pulse ? hi++ : lo++;
      const item = state.get(dest);
      if (!item) continue;

      if (origin === "nd" && pulse) nd = buttonPresses;
      if (origin === "pc" && pulse) pc = buttonPresses;
      if (origin === "vd" && pulse) vd = buttonPresses;
      if (origin === "tx" && pulse) tx = buttonPresses;

      if (item.type === "bc") broadcaster(dest, pulse);
      if (item.type === "&") conjunction(dest, pulse, origin);
      if (item.type === "%") flipFlop(dest, pulse);
    }
    buttonPresses++;

    if (buttonPresses > 10000) {
      break;
    }
  }
  return { hi, lo, nd, pc, vd, tx };
}

const { hi, lo, nd, pc, vd, tx } = solve();

const partOne = hi * lo;
const partTwo = nd * pc * vd * tx;

console.log(partOne);
console.log(partTwo);
