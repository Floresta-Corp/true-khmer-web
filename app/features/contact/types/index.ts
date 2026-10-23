import type { LucideIcon } from "lucide-react";

export type ContactTopic = {
  /** Anchor target, so other pages can link straight to a topic — the
      privacy policy points at `/support/contact-us#privacy`. Keep stable. */
  id: string;
  title: string;
  description: string;
  email: string;
  icon: LucideIcon;
};

export type ContactFaq = {
  question: string;
  /** Supports the same `**bold**` and `[label](/path)` markers as the legal
      documents, rendered with `renderInline`. */
  answer: string;
};
