// Mirrors Plumpi's event title rule (`validateBusinessName` in plumpi-api
// packages/shared/src/helpers/zod.ts) and true-khmer-api's
// src/modules/plumpi/shared/plumpi-event-title.ts, so the form can name the
// offending character before the event is sent.
export const PLUMPI_EVENT_TITLE_MIN_LENGTH = 2;
export const PLUMPI_EVENT_TITLE_MAX_LENGTH = 100;
export const PLUMPI_EVENT_TITLE_ALLOWED_SYMBOLS = `% - / & + ! @ # $ * ( ) . , ' : "`;

const DISALLOWED_CHARACTER = /[^\p{L}\p{M}\p{N}\s%\-/&+!@#$*().,':"]/gu;

// Characters people rarely type on purpose: smart punctuation from phones,
// Docs and Word, and the zero-width spaces Khmer text carries as word-break
// hints. Each is swapped for the plain character Plumpi accepts.
const LOOKALIKES: [RegExp, string][] = [
  [/[‘’‚‛′]/g, "'"],
  [/[“”„‟″]/g, '"'],
  [/[‐-―−]/g, "-"],
  [/…/g, "..."],
  [/[​﻿]/g, ""],
];

export function normalizePlumpiEventTitle(title: string) {
  let normalized = title;
  for (const [pattern, replacement] of LOOKALIKES) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized.replace(/\s+/g, " ").trim();
}

/** Distinct characters Plumpi would reject, in the order they appear. */
export function findDisallowedTitleCharacters(title: string) {
  return [...new Set(title.match(DISALLOWED_CHARACTER) ?? [])];
}

/** Why Plumpi would reject an already-normalized title, or null if it won't. */
export function plumpiEventTitleError(title: string, label = "Title") {
  if (title.length < PLUMPI_EVENT_TITLE_MIN_LENGTH) {
    return `${label} must be at least ${PLUMPI_EVENT_TITLE_MIN_LENGTH} characters`;
  }
  if (title.length > PLUMPI_EVENT_TITLE_MAX_LENGTH) {
    return `${label} must be at most ${PLUMPI_EVENT_TITLE_MAX_LENGTH} characters`;
  }

  return plumpiEventTitleCharacterError(title, label);
}

/**
 * Only the character check, for validating while the creator types: the
 * length rules would nag on the first keystroke, so they wait for submit.
 */
export function plumpiEventTitleCharacterError(title: string, label = "Title") {
  const disallowed = findDisallowedTitleCharacters(
    normalizePlumpiEventTitle(title),
  );
  if (disallowed.length === 0) return null;

  return `${label} can't contain ${disallowed.join(" ")}. Use letters, numbers, spaces and ${PLUMPI_EVENT_TITLE_ALLOWED_SYMBOLS}`;
}
