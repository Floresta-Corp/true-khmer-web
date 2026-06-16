import { readFile, writeFile } from "node:fs/promises";

const filePath = new URL("../types/api-client.ts", import.meta.url);

const original = await readFile(filePath, "utf8");

let content = original;

content = content.replace(
  /z\.enum\(\[([^\]]*?)null([^\]]*?)\]\)/g,
  (_match, before: string, after: string) => {
    const values = `${before}${after}`.replace(/,\s*$/, "");
    return `z.enum([${values}])`;
  },
);

const replacements = [
  // Remove .passthrough() — it adds `{ [x: string]: unknown }` to every inferred type,
  // breaking Omit and widening property types to unknown. Zod's default .strip() is fine.
  [/\.passthrough\(\)/g, ""],
  [
    /z\.record\(z\.unknown\(\)\.nullable\(\)\)/g,
    "z.record(z.string(), z.unknown().nullable())",
  ],
  [/z\.record\(z\.string\(\)\)/g, "z.record(z.string(), z.string())"],
  [/z\.record\(z\.number\(\)\)/g, "z.record(z.string(), z.number())"],
  [/z\.record\(z\.boolean\(\)\)/g, "z.record(z.string(), z.boolean())"],
  [/z\.record\(z\.unknown\(\)\)/g, "z.record(z.string(), z.unknown())"],
  [/z\.enum\(\[([^\]]*?),\s*\]\)/g, "z.enum([$1])"],
];

for (const [pattern, replacement] of replacements) {
  content = content.replace(pattern, replacement as string);
}

if (content === original) {
  console.log("No API client fixes needed.");
  process.exit(0);
}

await writeFile(filePath, content);
console.log("Fixed generated API client TypeScript compatibility issues.");
