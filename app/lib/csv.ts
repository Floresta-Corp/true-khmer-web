/** RFC 4180 uses CRLF, which is also what Excel expects. */
const ROW_SEPARATOR = "\r\n";

/**
 * Excel/Sheets evaluate a cell that starts with one of these as a formula, so a
 * value like `=cmd|...` becomes a code-execution vector for whoever opens the
 * export. Prefixing with a single quote keeps the text intact but inert.
 */
const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

function escapeCell(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";

  let cell = String(value);
  if (FORMULA_PREFIXES.some((prefix) => cell.startsWith(prefix))) {
    cell = `'${cell}`;
  }

  return /[",\r\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell;
}

/** Serializes rows to CSV text. Pass the header as the first row. */
export function toCsv(rows: Array<Array<string | number | null | undefined>>) {
  return rows.map((row) => row.map(escapeCell).join(",")).join(ROW_SEPARATOR);
}

/**
 * Byte-order mark: without it Excel reads the file as the system codepage and
 * mangles non-ASCII content (Khmer names, em dashes) into garbage.
 */
export const CSV_BOM = "﻿";

/** Quotes a filename for `Content-Disposition`, with an ASCII-safe fallback. */
export function csvContentDisposition(filename: string) {
  // Drop non-ASCII plus the quote/backslash that would otherwise terminate the
  // quoted value and let a caller-supplied name inject header parameters. The
  // `filename*` form below still carries the exact name.
  const asciiFallback = filename.replace(/[^\x20-\x7e]|["\\]/g, "_");
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
