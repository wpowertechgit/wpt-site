import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LOCALES_DIR = "src/i18n/locales";
const SUSPICIOUS_RE = /Ã|â€|â€“|â€”|â€¢|Â|È|Ä|Î|Ð|Ñ/g;

const CP1252_MAP = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function countSuspicious(value) {
  const matches = value.match(SUSPICIOUS_RE);
  return matches ? matches.length : 0;
}

function encodeCp1252(value) {
  const bytes = [];

  for (const char of value) {
    const cp = char.codePointAt(0);
    if (cp === undefined) {
      return null;
    }

    if (cp <= 0xff) {
      bytes.push(cp);
      continue;
    }

    const mapped = CP1252_MAP.get(cp);
    if (mapped === undefined) {
      return null;
    }
    bytes.push(mapped);
  }

  return Buffer.from(bytes);
}

function repairString(input) {
  let current = input;

  for (let i = 0; i < 3; i += 1) {
    if (!SUSPICIOUS_RE.test(current)) {
      break;
    }
    SUSPICIOUS_RE.lastIndex = 0;

    const encoded = encodeCp1252(current);
    if (!encoded) {
      break;
    }

    const decoded = encoded.toString("utf8");
    if (decoded.includes("\uFFFD")) {
      break;
    }

    if (countSuspicious(decoded) >= countSuspicious(current)) {
      break;
    }

    current = decoded;
  }

  return current;
}

function walk(node) {
  if (typeof node === "string") {
    return repairString(node);
  }
  if (Array.isArray(node)) {
    return node.map(walk);
  }
  if (node && typeof node === "object") {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)]));
  }
  return node;
}

const files = readdirSync(LOCALES_DIR).filter((name) => name.endsWith(".json"));
let changed = 0;

for (const name of files) {
  const filePath = join(LOCALES_DIR, name);
  const originalText = readFileSync(filePath, "utf8");
  const normalizedInput = originalText.replace(/^\uFEFF/, "");
  const parsed = JSON.parse(normalizedInput);
  const repaired = walk(parsed);
  const output = `${JSON.stringify(repaired, null, 4)}\n`;

  if (output !== normalizedInput) {
    writeFileSync(filePath, output, { encoding: "utf8" });
    changed += 1;
    console.log(`fixed ${filePath}`);
  } else {
    console.log(`ok ${filePath}`);
  }
}

console.log(`done: ${changed}/${files.length} file(s) updated`);
