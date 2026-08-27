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
  // Drop Zod's strict ISO datetime validation. Its regex rejects the "+07"/space
  // datetime shapes our API returns, causing loader validation to fail. We keep
  // these as plain strings and parse/format them via app/lib/time.ts (dayjs) at
  // the display layer, so the generated client stays self-contained.
  [/z\.string\(\)\.datetime\(\{[^}]*\}\)/g, "z.string()"],
  [/z\.string\(\)\.datetime\(\)/g, "z.string()"],
  // The backend's OpenAPI UUID patterns embed the case-insensitive flag inside
  // the pattern string ("...$/i"). The generator escapes that into the regex
  // body as "$\/i", so `$` is followed by a literal "/i" and no value can ever
  // match. Lift the flag out of the pattern so the check works as intended.
  [/\$\\\/i\//g, "$$/i"],
  [/\.passthrough\(\)/g, ""],
  [/\.and\(z\.unknown\(\)\)/g, ".nullable()"],
  [
    /z\.record\(z\.unknown\(\)\.nullable\(\)\)/g,
    "z.record(z.string(), z.unknown().nullable())",
  ],
  [/z\.record\(z\.string\(\)\)/g, "z.record(z.string(), z.string())"],
  [/z\.record\(z\.number\(\)\)/g, "z.record(z.string(), z.number())"],
  [/z\.record\(z\.boolean\(\)\)/g, "z.record(z.string(), z.boolean())"],
  [
    /z\.record\(z\.array\(z\.string\(\)\)\)/g,
    "z.record(z.string(), z.array(z.string()))",
  ],
  [/z\.record\(z\.unknown\(\)\)/g, "z.record(z.string(), z.unknown())"],
  [/z\.enum\(\[([^\]]*?),\s*\]\)/g, "z.enum([$1])"],
];

for (const [pattern, replacement] of replacements) {
  content = content.replace(pattern, replacement as string);
}

content = content.replace(
  /(?<=\n)(const\s+[A-Za-z_$][\w$]*\s*=\s*z\.[\s\S]*?)(?=\nconst\s+[A-Za-z_$][\w$]*\s*=\s*z\.|\nexport const schemas = {)/g,
  (match: string) => `${match.replace(/\n+$/, "")}\n`,
);

const generatedTypeBlockStart = "\n// Generated API schema types\n";
const generatedTypeBlockEnd = "\n// End generated API schema types\n";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSchemaNames(content: string) {
  const schemasMatch = content.match(
    /export const schemas = \{([\s\S]*?)\n\};/,
  );
  if (!schemasMatch) return [];

  const names = new Set<string>();
  const propertyPattern = /^\s*([A-Za-z_$][\w$]*),\s*$/gm;
  let match: RegExpExecArray | null;

  while ((match = propertyPattern.exec(schemasMatch[1])) !== null) {
    names.add(match[1]);
  }

  return [...names];
}

content = content.replace(
  new RegExp(
    `${escapeRegExp(generatedTypeBlockStart)}[\\s\\S]*?${escapeRegExp(generatedTypeBlockEnd)}`,
  ),
  "",
);

const schemaNames = getSchemaNames(content);
const generatedSchemaTypes = schemaNames.length
  ? `${generatedTypeBlockStart}${schemaNames
      .map((name) => `export type ${name} = z.infer<typeof schemas.${name}>;`)
      .join("\n")}${generatedTypeBlockEnd}\n`
  : "";

if (generatedSchemaTypes) {
  content = content.replace(
    "\nexport const api = new Zodios(endpoints);",
    `\n${generatedSchemaTypes}\nexport const api = new Zodios(endpoints);`,
  );
}

content = content.replace(/\n{3,}/g, "\n\n");

if (content === original) {
  console.log("No API client fixes needed.");
  process.exit(0);
}

await writeFile(filePath, content);
console.log("Fixed generated API client TypeScript compatibility issues.");
