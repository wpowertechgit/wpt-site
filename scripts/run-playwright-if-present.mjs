import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const [, , target] = process.argv;

const testsDir = "tests";
const hasTestsDir = existsSync(testsDir);
const hasTarget = target ? existsSync(target) : false;

if (!hasTestsDir) {
  console.log("Skipping Playwright: ./tests directory not found.");
  process.exit(0);
}

if (target && !hasTarget) {
  console.log(`Skipping Playwright: ${target} not found.`);
  process.exit(0);
}

const args = ["playwright", "test"];

if (target) {
  args.push(target);
}

const result = spawnSync("npx", args, {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
