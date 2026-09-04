import { useState } from "react";
import { X } from "lucide-react";

interface OutcomeListProps {
  values: string[];
  onChange: (values: string[]) => void;
}

/**
 * Outcomes are written one at a time in a composer and then listed as
 * committed bullets, the way the design has it — Enter or the Add button
 * commits, duplicates are ignored.
 */
export function OutcomeList({ values, onChange }: OutcomeListProps) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    if (!value) return;
    if (!values.includes(value)) onChange([...values, value]);
    setDraft("");
  };

  const remove = (index: number) =>
    onChange(values.filter((_, i) => i !== index));

  return (
    <div>
      <span className="mb-2 block text-sm font-bold text-[#1A1A2E]">
        What you&apos;ll learn
      </span>

      <div className="flex items-center gap-2.5">
        <input
          value={draft}
          aria-label="Add a learning outcome"
          placeholder="e.g. How to plan a 30-day content calendar — press Enter"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            commit();
          }}
          className="min-w-0 flex-1 rounded-lg border border-[#E5E7EB] px-3.5 py-[13px] text-sm text-[#333333] outline-none placeholder:text-[#9A9AB0] focus:border-[#1C5DD4]"
        />
        <button
          type="button"
          onClick={commit}
          disabled={!draft.trim()}
          className="shrink-0 cursor-pointer rounded-lg bg-[#1C5DD4] px-6 py-[13px] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Add
        </button>
      </div>

      {values.length > 0 && (
        <ul className="mt-2.5 flex flex-col gap-2.5">
          {values.map((value, index) => (
            <li
              key={value}
              className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] px-3.5 py-[11px]"
            >
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full bg-[#1C5DD4]"
              />
              <span className="min-w-0 flex-1 text-sm break-words text-[#333333]">
                {value}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                title="Remove outcome"
                aria-label={`Remove outcome: ${value}`}
                className="flex size-5 shrink-0 cursor-pointer items-center justify-center text-[#9A9AB0] hover:text-[#DC2626]"
              >
                <X size={14} strokeWidth={2.2} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
