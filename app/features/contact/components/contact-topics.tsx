import { Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router";

import type { ContactCategory } from "../lib/contact-schema";
import type { ContactTopic } from "../types";

type OnWrite = (category: ContactCategory) => void;

function ContactTopicCard({
  topic,
  onWrite,
}: {
  topic: ContactTopic;
  onWrite?: OnWrite;
}) {
  const Icon = topic.icon;

  return (
    <section
      id={topic.id}
      // Clears the sticky navbar when a fragment link lands here.
      className="flex scroll-mt-[calc(var(--navbar-height)+1.5rem)] flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-[#eff4fe] text-[#2f6fe4]">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#243d95]">{topic.title}</h2>
        <p className="text-[15px] leading-7 text-[#475569]">
          {topic.description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          to={`/support/contact-us?topic=${topic.id}#message`}
          preventScrollReset
          onClick={(event) => {
            // Plain clicks pick the topic and glide to the form in place; a
            // modified click (new tab, etc.) follows the link as normal.
            if (
              !onWrite ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            ) {
              return;
            }
            event.preventDefault();
            onWrite(topic.id as ContactCategory);
          }}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#2f6fe4] underline-offset-4 hover:underline"
        >
          <MessageSquare className="size-4" aria-hidden="true" />
          Write to us about this
        </Link>
        <a
          href={`mailto:${topic.email}`}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#475569] underline-offset-4 hover:text-[#2f6fe4] hover:underline"
        >
          <Mail className="size-4" aria-hidden="true" />
          {topic.email}
        </a>
      </div>
    </section>
  );
}

export function ContactTopics({
  topics,
  onWrite,
}: {
  topics: ContactTopic[];
  onWrite?: OnWrite;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {topics.map((topic) => (
        <ContactTopicCard key={topic.id} topic={topic} onWrite={onWrite} />
      ))}
    </div>
  );
}
