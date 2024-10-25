import fs from "fs";
import path from "path";

type Hand = {
  cards: string;
  bid: number;
  kinds: number[];
};

type CardCounts = Record<string, number>;

const filePath = path.resolve(__dirname, "input.txt");
const inputData = fs.readFileSync(filePath, "utf-8");

const compare = (cardRanks: string[]) => {
  return (h1: Hand, h2: Hand) => {
    for (let i = 0; i < 5; i++) {
      if (!h1.kinds[i] || !h2.kinds[i]) break;
      if (h1.kinds[i] > h2.kinds[i]) return 1;
      if (h1.kinds[i] < h2.kinds[i]) return -1;
    }

    for (let i = 0; i < 5; i++) {
      if (cardRanks.indexOf(h1.cards[i]) < cardRanks.indexOf(h2.cards[i]))
        return 1;
      if (cardRanks.indexOf(h1.cards[i]) > cardRanks.indexOf(h2.cards[i]))
        return -1;
    }

    return 0;
  };
};

const lineToHand = (toKinds: (arg0: CardCounts) => number[]) => {
  return (line: string) => {
    const [cards, bid] = line.split(" ");
    const counts: CardCounts = {};
    for (let i = 0; i < cards.length; i++) {
      if (counts[cards[i]]) counts[cards[i]]++;
      else counts[cards[i]] = 1;
    }
    const kinds = toKinds(counts);
    kinds.sort((a, b) => b - a);
    return { cards, kinds, bid: Number(bid) };
  };
};

const partOne = (input: string) => {
  const cardRanks = "AKQJT98765432".split("");
  const toKinds = (counts: CardCounts) => Object.values(counts);

  const hands = input.split("\n").map(lineToHand(toKinds));
  hands.sort(compare(cardRanks));

  return hands.reduce((sum, { bid }, i) => sum + bid * (i + 1), 0);
};

const partTwo = (input: string) => {
  const cardRanks = "AKQT98765432J".split("");
  const toKinds = (counts: CardCounts) => {
    const maxCard = Object.keys(counts)
      .filter((c) => c !== "J")
      .sort((a, b) => counts[b] - counts[a])[0];
    if (counts.J && maxCard) {
      counts[maxCard] += counts.J;
      delete counts.J;
    }
    return Object.values(counts);
  };

  const hands = input.split("\n").map(lineToHand(toKinds));
  hands.sort(compare(cardRanks));

  return hands.reduce((sum, { bid }, i) => sum + bid * (i + 1), 0);
};

console.log(partOne(inputData));
console.log(partTwo(inputData));
