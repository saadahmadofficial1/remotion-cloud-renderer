/**
 * patch-bundler.js
 * Fixes Remotion bundler bug where setup-sequence-stack-traces.js
 * crashes on null props (TypeError: Cannot read properties of null
 * reading 'stack').
 *
 * Runs automatically via npm postinstall.
 */
const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@remotion",
  "bundler",
  "dist",
  "setup-sequence-stack-traces.js"
);

if (!fs.existsSync(filePath)) {
  console.log("[patch-bundler] File not found, skipping patch.");
  process.exit(0);
}

let content = fs.readFileSync(filePath, "utf8");

// Check if already patched
if (content.includes("props === null || props === undefined")) {
  console.log("[patch-bundler] Already patched, skipping.");
  process.exit(0);
}

// Add null guard before props.stack access
const before = `const newProps = props.stack`;
const after = `if (props === null || props === undefined) {\n                    return Reflect.apply(target, thisArg, argArray);\n                }\n                const newProps = props.stack`;

content = content.replace(before, after);

fs.writeFileSync(filePath, content, "utf8");
console.log("[patch-bundler] Successfully patched null-props guard.");
