import { useEffect, useState } from "react";

import type { LegalDocument } from "../types";
import { formatLegalDate, LEGAL } from "../lib/legal-info";
import { LegalBlocks } from "./legal-blocks";

/**
 * Highlights the section being read in the table of contents.
 *
 * `rootMargin` pulls the observation band up to just under the sticky header
 * and down to the top third of the viewport, so the heading that is actually
 * under the reader's eye is the one marked — rather than whichever heading
 * happens to be nearest the bottom of a tall section.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  // The caller builds the list fresh on every render, so keying the effect on
  // the joined ids — which do not change — keeps one observer alive instead of
  // tearing it down and rebuilding it on each render.
  const key = ids.join("|");

  useEffect(() => {
    const headings = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      // The top inset clears the sticky navbar (--navbar-height, 68px) plus
      // the gap the anchors scroll to; the bottom one keeps the marked heading
      // in the upper third, where the reader is actually looking.
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

type TocEntry = { id: string; title: string };

function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const active = useActiveSection(entries.map((entry) => entry.id));

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <p className="text-xs font-semibold tracking-wider text-[#2f6fe4] uppercase">
        On this page
      </p>
      <ul className="flex flex-col gap-1 border-l border-[#e2e8f0]">
        {entries.map((entry) => {
          const isActive = entry.id === active;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-5 transition-colors ${
                  isActive
                    ? "border-[#2f6fe4] font-medium text-[#2f6fe4]"
                    : "border-transparent text-[#6a7282] hover:border-[#cbd5e1] hover:text-[#0f172a]"
                }`}
              >
                {entry.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * The shared frame for every legal page: the header band with the document's
 * own last-updated date, a sticky table of contents on wide screens, the
 * document body, and the cross-links between the three pages.
 *
 */
export function LegalPage({
  doc,
  updatedAt,
}: {
  doc: LegalDocument;
  /** ISO date, from `LEGAL_UPDATED`. */
  updatedAt: string;
}) {
  const tocEntries: TocEntry[] = doc.sections.map(({ id, title }) => ({
    id,
    title,
  }));

  return (
    <div className="bg-white">
      <header className="border-b border-[#e2e8f0] bg-[#f8fafc]">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 lg:px-6">
          <p className="text-xs font-semibold tracking-wider text-[#2f6fe4] uppercase">
            {LEGAL.entity} · Legal
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#243d95] sm:text-4xl">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#475569]">
            {doc.summary}
          </p>
          <p className="mt-6 text-sm text-[#6a7282]">
            Last updated{" "}
            <time dateTime={updatedAt} className="font-medium text-[#0f172a]">
              {formatLegalDate(updatedAt)}
            </time>
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16 lg:px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <aside className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-[calc(var(--navbar-height)+1.5rem)]">
              <TableOfContents entries={tocEntries} />
            </div>
          </aside>

          <article className="min-w-0 flex-1 space-y-12">
            {doc.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                // Clears the sticky navbar when a fragment link lands here.
                className="scroll-mt-[calc(var(--navbar-height)+1.5rem)] space-y-4"
              >
                <h2 className="text-xl font-semibold text-[#243d95]">
                  {section.title}
                </h2>
                <LegalBlocks blocks={section.blocks} />
              </section>
            ))}

            <div className="border-t border-[#e2e8f0] pt-8">
              <p className="text-sm leading-6 text-[#6a7282]">
                Questions about this page? Write to{" "}
                <a
                  href={`mailto:${LEGAL.contact.general}`}
                  className="font-medium text-[#2f6fe4] underline-offset-4 hover:underline"
                >
                  {LEGAL.contact.general}
                </a>
                .
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
