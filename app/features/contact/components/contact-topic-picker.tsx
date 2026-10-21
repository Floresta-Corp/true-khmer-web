import { Check, ChevronDown, MessageSquareText } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { SelectContent } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import type { ContactCategory } from "../lib/contact-schema";
import type { ContactTopic } from "../types";

type ContactTopicPickerProps = {
  id: string;
  name: string;
  topics: ContactTopic[];
  value: ContactCategory | "";
  onChange: (value: ContactCategory) => void;
  invalid?: boolean;
};

/** Icon chip + title + description: shared by the trigger and every option. */
function TopicRow({ topic }: { topic: ContactTopic | null }) {
  const Icon = topic?.icon ?? MessageSquareText;

  return (
    <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eff4fe] text-[#2f6fe4] dark:bg-slate-800">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm font-medium",
            topic
              ? "text-[#0f172a] dark:text-slate-200"
              : "text-[#6a7282] dark:text-slate-400",
          )}
        >
          {topic?.title ?? "Choose a topic"}
        </span>
        {topic ? (
          <span className="mt-0.5 block truncate text-xs text-[#6a7282] dark:text-slate-400">
            {topic.description}
          </span>
        ) : null}
      </span>
    </span>
  );
}

/**
 * A dropdown picker styled like the topic rows. Radix renders a hidden native
 * `<select name=…>`, so the value is submitted with the form as usual.
 */
export function ContactTopicPicker({
  id,
  name,
  topics,
  value,
  onChange,
  invalid,
}: ContactTopicPickerProps) {
  const selected = topics.find((topic) => topic.id === value) ?? null;

  return (
    <SelectPrimitive.Root
      name={name}
      value={value || undefined}
      onValueChange={(next) => onChange(next as ContactCategory)}
    >
      <SelectPrimitive.Trigger
        id={id}
        data-field="category"
        aria-invalid={invalid}
        className={cn(
          "group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white p-3 transition-colors outline-none hover:border-[#c7d6f7] dark:border-slate-700 dark:bg-slate-900",
          "focus-visible:border-[#2f6fe4] focus-visible:ring-3 focus-visible:ring-[#2f6fe4]/20 data-[state=open]:border-[#2f6fe4] data-[state=open]:ring-3 data-[state=open]:ring-[#2f6fe4]/20",
          invalid && "border-rose-400",
        )}
      >
        {/* Rendered directly rather than via Select.Value, which would show
            nothing in the empty state. */}
        <TopicRow topic={selected} />
        <ChevronDown
          className="size-4 shrink-0 text-[#6a7282] transition-transform group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </SelectPrimitive.Trigger>

      <SelectContent
        sideOffset={6}
        className="max-h-[22rem] rounded-xl border-[#e2e8f0] bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        {topics.map((topic) => {
          return (
            <SelectPrimitive.Item
              key={topic.id}
              value={topic.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2.5 outline-none select-none data-highlighted:bg-[#f8fafc] dark:data-highlighted:bg-slate-800"
            >
              <TopicRow topic={topic} />
              {/* Text used for type-ahead and the hidden native option. */}
              <SelectPrimitive.ItemText asChild>
                <span className="sr-only">{topic.title}</span>
              </SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator>
                <Check className="size-4 text-[#2f6fe4]" aria-hidden="true" />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
          );
        })}
      </SelectContent>
    </SelectPrimitive.Root>
  );
}
