import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";

import type { LegalBlock } from "../types";

/**
 * Inline markup for legal copy: `**bold**` and `[label](/path)`.
 *
 * A full markdown renderer would be a dependency and an injection surface for
 * documents that only ever need emphasis and a link. The pattern below matches
 * one or the other, and everything it does not match is rendered as text — so a
 * stray bracket in the wording shows up as a stray bracket rather than as
 * markup.
 */
const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    const [, bold, label, href] = match;
    const key = `${match.index}`;

    if (bold) {
      nodes.push(
        <strong key={key} className="font-semibold text-[#0f172a]">
          {bold}
        </strong>,
      );
    } else if (label && href) {
      // An in-document anchor stays a plain `<a>`: React Router would treat it
      // as a navigation and lose the browser's own scroll-to-fragment.
      nodes.push(
        href.startsWith("#") ? (
          <a
            key={key}
            href={href}
            className="font-medium text-[#2f6fe4] underline-offset-4 hover:underline"
          >
            {label}
          </a>
        ) : (
          <Link
            key={key}
            to={href}
            className="font-medium text-[#2f6fe4] underline-offset-4 hover:underline"
          >
            {label}
          </Link>
        ),
      );
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
}

export function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="text-[15px] leading-7 text-[#475569]">
          {renderInline(block.text)}
        </p>
      );

    case "subheading":
      return (
        <h3 className="pt-2 text-base font-semibold text-[#0f172a]">
          {renderInline(block.text)}
        </h3>
      );

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={`space-y-2.5 pl-5 text-[15px] leading-7 text-[#475569] ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-[#94a3b8]`}
        >
          {block.items.map((item, index) => (
            <li key={index} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </List>
      );
    }

    case "table":
      return (
        // Legal tables are three or four columns of prose; on a phone they have
        // to scroll rather than wrap into an unreadable column of single words.
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-150 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                {block.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="py-3 pr-6 text-xs font-semibold tracking-wider text-[#2f6fe4] uppercase"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-[#f1f5f9] align-top last:border-0"
                >
                  {row.map((cell, cellIndex) => {
                    const isCode = block.codeFirstColumn && cellIndex === 0;
                    return (
                      <td
                        key={cellIndex}
                        className={
                          isCode
                            ? "py-3 pr-6 font-mono text-[13px] leading-6 text-[#0f172a]"
                            : "py-3 pr-6 leading-6 text-[#475569]"
                        }
                      >
                        {isCode ? cell : renderInline(cell)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout":
      return (
        <div className="rounded-xl border border-[#d5edff] bg-[#f4f9ff] p-4 text-[15px] leading-7 text-[#334155]">
          {renderInline(block.text)}
        </div>
      );
  }
}

export function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <Fragment key={index}>
          <LegalBlockView block={block} />
        </Fragment>
      ))}
    </div>
  );
}
