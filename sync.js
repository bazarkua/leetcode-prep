#!/usr/bin/env node
// Refresh the progress counts in PROGRESS.md from its own checkboxes.
//
//   node sync.js
//
// PROGRESS.md is the single source of truth. You tick "- [ ]" -> "- [x]" in
// Obsidian (saved to the file); this script recomputes each topic's "(x / y)"
// header and the overall "**Progress:** x / y solved" line. No other files.

const fs = require("fs");
const path = require("path");

const MD = path.join(__dirname, "PROGRESS.md");

function main() {
  const lines = fs.readFileSync(MD, "utf8").split("\n");
  let total = 0,
    solved = 0;
  let headerIdx = -1,
    hCount = 0,
    hTotal = 0;

  const flushHeader = () => {
    if (headerIdx >= 0) {
      lines[headerIdx] = lines[headerIdx].replace(
        /\(\d+\s*\/\s*\d+\)/,
        `(${hCount} / ${hTotal})`
      );
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+/.test(line) && /\(\d+\s*\/\s*\d+\)/.test(line)) {
      flushHeader();
      headerIdx = i;
      hCount = 0;
      hTotal = 0;
      continue;
    }
    const t = line.match(/^- \[([ x])\] /);
    if (t) {
      const done = t[1] === "x";
      total++;
      hTotal++;
      if (done) {
        solved++;
        hCount++;
      }
    }
  }
  flushHeader();

  let out = lines.join("\n");
  out = out.replace(
    /\*\*Progress:\*\*\s*\d+\s*\/\s*\d+\s*solved/,
    `**Progress:** ${solved} / ${total} solved`
  );
  fs.writeFileSync(MD, out);
  console.log(`Refreshed PROGRESS.md counts: ${solved} / ${total} solved.`);
}

main();
