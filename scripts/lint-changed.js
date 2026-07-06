// Lint only the files changed vs the base branch (default: develop).
// Cross-platform: runs on Windows, macOS, and Linux via `bun` — no bash,
// grep, or xargs required. Includes committed-on-branch changes AND local
// staged/unstaged changes, so it never touches unrelated files.
//
// Usage:
//   bun scripts/lint-changed.js          # report errors only
//   bun scripts/lint-changed.js --fix    # auto-fix them
//   BASE_REF=main bun scripts/lint-changed.js   # compare against another branch
import { execFileSync, spawnSync } from "node:child_process";

const baseRef = process.env.BASE_REF || "develop";
const wantFix = process.argv.includes("--fix");
const EXTS = ["*.js", "*.jsx", "*.ts", "*.tsx"];

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

// Use the local branch if it exists; otherwise fall back to origin/<branch>.
let base = baseRef;
try {
  git(["rev-parse", "--verify", "--quiet", baseRef]);
} catch {
  base = `origin/${baseRef}`;
}

// Union of: changes introduced on this branch, unstaged, and staged.
const diffArgSets = [
  // eslint-disable-next-line prettier/prettier
  ["diff", "--name-only", "--diff-filter=ACMR", `${base}...HEAD`, "--", ...EXTS],
  ["diff", "--name-only", "--diff-filter=ACMR", "--", ...EXTS],
  ["diff", "--name-only", "--diff-filter=ACMR", "--cached", "--", ...EXTS],
];

const files = new Set();
for (const args of diffArgSets) {
  let out = "";
  try {
    out = git(args);
  } catch {
    continue; // e.g. base ref not found — skip that comparison
  }
  for (const line of out.split("\n")) {
    const f = line.trim();
    if (f) files.add(f);
  }
}

const list = [...files];
if (list.length === 0) {
  console.log("No changed JS/TS files to lint.");
  process.exit(0);
}

console.log("Linting changed files:");
console.log(list.join("\n"));
console.log("---");

// Run eslint through `bun x` so it resolves the local eslint on every OS.
const eslintArgs = ["x", "eslint", ...(wantFix ? ["--fix"] : []), ...list];
const result = spawnSync("bun", eslintArgs, { stdio: "inherit" });
process.exit(result.status ?? 1);
