import { Building2, Flag, LifeBuoy, ShieldCheck } from "lucide-react";

import { LEGAL } from "~/features/legal/lib/legal-info";
import type { ContactFaq, ContactTopic } from "../types";

/**
 * Who to write to, by subject.
 *
 * Every topic currently goes to the same support inbox, `LEGAL.contact.support`.
 * Each topic still names its own `email` so one can be routed elsewhere later
 * without touching the components.
 */
export const contactTopics: ContactTopic[] = [
  {
    id: "support",
    title: "Questions & support",
    description:
      "Help with your account, signing in, events, courses, applications, or anything else on the platform.",
    email: LEGAL.contact.support,
    icon: LifeBuoy,
  },
  {
    id: "privacy",
    title: "Privacy & your data",
    description:
      "Questions about our Privacy Policy, requests to access, correct or delete your information, or a suspected account compromise.",
    email: LEGAL.contact.support,
    icon: ShieldCheck,
  },
  {
    id: "partnerships",
    title: "Partnerships & organisations",
    description:
      "Registering an organisation, partner packages, or working with True Khmer on a campaign or programme.",
    email: LEGAL.contact.support,
    icon: Building2,
  },
  {
    id: "moderation",
    title: "Report content",
    description:
      "Content or behaviour that breaks our Terms of Service, or a reply to a moderation decision about your post.",
    email: LEGAL.contact.support,
    icon: Flag,
  },
];

export const contactFaqs: ContactFaq[] = [
  {
    question: "How quickly will I hear back?",
    answer:
      "We aim to reply within two working days. Privacy requests are answered within 30 days, as described in our [Privacy Policy](/privacy#your-rights).",
  },
  {
    question: "How do I change my profile or account details?",
    answer:
      "Everything on your public profile can be changed from **Edit profile**, and your account and security options are in **Settings**.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "You can delete your account yourself from **Settings**. See [How long we keep information](/privacy#retention) for what happens to your data afterwards.",
  },
  {
    question: "How can my organisation join True Khmer?",
    answer:
      "Start with [partner registration](/registration/partner-registration). If you have questions before applying, write to us under Partnerships & organisations.",
  },
  {
    question: "I think someone else has accessed my account.",
    answer:
      "Change your password and turn on two-factor authentication in **Settings**, then write to us under Privacy & your data so we can look into it.",
  },
];
