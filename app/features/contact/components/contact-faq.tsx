import { ChevronDown } from "lucide-react";

import { renderInline } from "~/features/legal/components/legal-blocks";
import type { ContactFaq as ContactFaqItem } from "../types";

/**
 * Native `<details>` rather than an accordion component: it is keyboard and
 * screen-reader accessible as-is, and works before hydration.
 */
export function ContactFaq({ faqs }: { faqs: ContactFaqItem[] }) {
  return (
    <div className="divide-y divide-[#e2e8f0] rounded-2xl border border-[#e2e8f0] bg-white">
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-[#0f172a] [&::-webkit-details-marker]:hidden">
            {faq.question}
            <ChevronDown
              className="size-4 shrink-0 text-[#6a7282] transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 text-[15px] leading-7 text-[#475569]">
            {renderInline(faq.answer)}
          </p>
        </details>
      ))}
    </div>
  );
}
