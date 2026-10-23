import * as React from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/contact";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { LEGAL } from "~/features/legal/lib/legal-info";
import { ContactFaq } from "../components/contact-faq";
import { ContactTopics } from "../components/contact-topics";
import { ContactForm } from "../components/contact-form";
import { contactLoader } from "../services/contact.loader";
import { contactAction } from "../services/contact.action";
import { contactFaqs, contactTopics } from "../lib/contact-info";
import type { ContactCategory } from "../lib/contact-schema";

export const loader = contactLoader;
export const action = contactAction;

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "Contact us",
    description:
      "Get help with your True Khmer account, ask about privacy and your data, partner with us, or report content.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "Contact us", path: "/support/contact-us" },
      ]),
    ],
  });
}

export function headers(_: Route.HeadersArgs) {
  return {
    // Same reason as every other page under app-layout: the document carries
    // the SSR'd, per-user navbar, so it must never enter a shared cache.
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
  };
}

export default function Contact() {
  const { prefill, turnstileSiteKey } = useLoaderData<typeof loader>();
  const messageRef = React.useRef<HTMLElement>(null);
  const [requestedCategory, setRequestedCategory] = React.useState<{
    category: ContactCategory;
    nonce: number;
  } | null>(null);

  const writeAbout = (category: ContactCategory) => {
    setRequestedCategory((current) => ({
      category,
      nonce: (current?.nonce ?? 0) + 1,
    }));

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // `scroll-mt-*` on the section keeps it clear of the sticky navbar.
    messageRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-white">
      <header className="border-b border-[#e2e8f0] bg-[#f8fafc]">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 lg:px-6">
          <p className="text-xs font-semibold tracking-wider text-[#2f6fe4] uppercase">
            {LEGAL.entity} · Support
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#243d95] sm:text-4xl">
            Contact us
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#475569]">
            Have a question, need help, or want to know more about True Khmer?
            Choose the topic closest to yours so your message reaches the right
            team.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl space-y-16 px-4 py-12 sm:py-16 lg:px-6">
        <section
          ref={messageRef}
          id="message"
          className="scroll-mt-[calc(var(--navbar-height)+1.5rem)] space-y-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-[#243d95]">
              Send us a message
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-[#475569]">
              Pick a topic, tell us what you need, and we'll get back to you by
              email.
            </p>
          </div>
          <ContactForm
            topics={contactTopics}
            prefill={prefill}
            requestedCategory={requestedCategory}
            turnstileSiteKey={turnstileSiteKey}
          />
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#243d95]">
            Or email us directly
          </h2>
          <ContactTopics topics={contactTopics} onWrite={writeAbout} />
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#243d95]">
            Frequently asked questions
          </h2>
          <ContactFaq faqs={contactFaqs} />
        </section>

        <div className="border-t border-[#e2e8f0] pt-8">
          <p className="text-sm leading-6 text-[#6a7282]">
            By post: {LEGAL.entity}, {LEGAL.address}.
          </p>
        </div>
      </div>
    </div>
  );
}
