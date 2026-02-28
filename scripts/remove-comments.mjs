// Script: remove-comments.mjs
// Removes all comments from .ts and .tsx files in the project.
// Run with: node scripts/remove-comments.mjs

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = process.cwd();

// Directories to skip
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "scripts",
  ".vercel",
]);

// File extensions to process
const EXTENSIONS = new Set([".ts", ".tsx", ".css"]);

// Get all matching files recursively
function getFiles(dir) {
  const results = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...getFiles(full));
    } else if (EXTENSIONS.has(extname(name))) {
      results.push(full);
    }
  }
  return results;
}

function removeComments(src, filePath) {
  const isCss = filePath.endsWith(".css");

  if (isCss) {
    // Remove CSS block comments: /* ... */
    src = src.replace(/\/\*[\s\S]*?\*\//g, "");
  } else {
    // 1. Remove JSX comments: {/* ... */}
    src = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

    // 2. Remove block comments: /* ... */
    src = src.replace(/\/\*[\s\S]*?\*\//g, "");

    // 3. Remove single-line comments: // ...
    //    BUT skip lines inside string literals (basic heuristic)
    src = src
      .split("\n")
      .map((line) => {
        // Find // that is NOT inside a string
        // Strategy: walk char by char tracking string state
        let inSingle = false;
        let inDouble = false;
        let inTemplate = false;
        for (let i = 0; i < line.length; i++) {
          const c = line[i];
          const prev = line[i - 1];
          if (c === "'" && !inDouble && !inTemplate && prev !== "\\")
            inSingle = !inSingle;
          if (c === '"' && !inSingle && !inTemplate && prev !== "\\")
            inDouble = !inDouble;
          if (c === "`" && !inSingle && !inDouble && prev !== "\\")
            inTemplate = !inTemplate;
          if (
            c === "/" &&
            line[i + 1] === "/" &&
            !inSingle &&
            !inDouble &&
            !inTemplate
          ) {
            return line.slice(0, i).trimEnd();
          }
        }
        return line;
      })
      .join("\n");
  }

  // Remove lines that became empty (were comment-only lines)
  // Collapse 3+ consecutive blank lines into 2
  src = src.replace(/\n{3,}/g, "\n\n");

  // Remove trailing whitespace on each line
  src = src
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");

  return src.trim() + "\n";
}

const files = getFiles(ROOT);
let changed = 0;

for (const file of files) {
  const original = readFileSync(file, "utf8");
  const cleaned = removeComments(original, file);
  if (cleaned !== original) {
    writeFileSync(file, cleaned, "utf8");
    console.log(`✓ Cleaned: ${file.replace(ROOT, ".")}`);
    changed++;
  }
}

console.log(
  `\n✅ Done — ${changed} files updated, ${files.length - changed} unchanged.`,
);
