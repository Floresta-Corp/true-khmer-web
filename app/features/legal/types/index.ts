/**
 * The shape every legal document is written in.
 *
 * The documents are data rather than JSX so that the wording — the part that
 * gets reviewed by counsel and amended over time — lives in one flat file per
 * document, and so that the table of contents, the anchor links and the print
 * styling are derived rather than hand-maintained alongside it.
 *
 * Text supports two inline markers, handled by `renderInline`:
 * `**bold**` and `[label](/path)`.
 */
export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "subheading"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | {
      kind: "table";
      columns: string[];
      rows: string[][];
      /** Sets the first column in monospace — for a table of identifiers, such
          as cookie names, where the exact characters are the point. */
      codeFirstColumn?: boolean;
    }
  /** A boxed aside for the one or two points a reader must not skim past. */
  | { kind: "callout"; text: string };

export type LegalSection = {
  /** Anchor target, also the table-of-contents link. Keep stable: these end up
      in bookmarks, support replies and links from other pages. */
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  /** One or two sentences under the title, before the contents. */
  summary: string;
  sections: LegalSection[];
};
