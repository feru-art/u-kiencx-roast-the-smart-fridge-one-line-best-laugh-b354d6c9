// Entry for the smart fridge roast bounty.
// The whole entry is one line of text: this program writes that line to
// /output/entry.txt, where the grader's gate checks it (UTF-8, 1-160
// characters, a single line) before the judge ever sees it.
//
// The line roasts a behaviour only a smart fridge has: it watches food
// expire, then offers a recipe for it anyway. The sting lands at the end,
// which is where the judge's brief wants the turn.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const roastLine =
  "My fridge suggested a recipe for leftovers it watched expire for nine days, less cooking help than a eulogy with instructions.";

const gateMinCharacters = 1;
const gateMaxCharacters = 160;

function countCharacters(text: string): number {
  // Count Unicode code points, matching how the gate counts characters,
  // rather than UTF-16 code units.
  return [...text].length;
}

function assertGateShape(text: string): void {
  const characters = countCharacters(text);
  if (characters < gateMinCharacters || characters > gateMaxCharacters) {
    throw new Error(
      `entry line must hold ${gateMinCharacters}-${gateMaxCharacters} characters, got ${characters}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry line must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry line must stay on one line");
  }
}

function outputDirectory(): string {
  const override = process.env.OUTPUT_DIR;
  return override && override.length > 0 ? override : "/output";
}

function writeEntry(directory: string, text: string): string {
  mkdirSync(directory, { recursive: true });
  const target = join(directory, "entry.txt");
  // Write straight to the final path: no temporary file ever sits in the
  // output folder, so the grader finds exactly one clean entry file.
  writeFileSync(target, text, "utf8");
  return target;
}

function main(): void {
  assertGateShape(roastLine);
  writeEntry(outputDirectory(), roastLine);
}

main();
