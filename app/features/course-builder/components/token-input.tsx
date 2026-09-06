import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

interface TokenInputProps {
  values: string[];
  placeholder: string;
  ariaLabel: string;
  /** Skills use a plain outlined chip; tags use the brand-tinted one. */
  tone: "neutral" | "brand";
  onChange: (values: string[]) => void;
}

const TONE = {
  neutral: "border border-[#E5E7EB] bg-white text-[#1A1A2E]",
  brand: "bg-[#D5E2FA] text-[#1C5DD4]",
} as const;

/**
 * The chips-plus-input control the design uses for both "Skills learners will
 * gain" and "Tags". Enter commits, Backspace on an empty box removes the last
 * chip, and duplicates are ignored.
 */
export function TokenInput({
  values,
  placeholder,
  ariaLabel,
  tone,
  onChange,
}: TokenInputProps) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    if (!value) return;
    if (!values.includes(value)) onChange([...values, value]);
    setDraft("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2.5">
      {values.map((value) => (
        <span
          key={value}
          className={cn(
            "flex items-center gap-1.5 rounded-full py-[5px] pr-1.5 pl-3 text-[13px] font-semibold",
            TONE[tone],
          )}
        >
          {value}
          <button
            type="button"
            aria-label={`Remove ${value}`}
            onClick={() => onChange(values.filter((item) => item !== value))}
            className={cn(
              "flex size-4 cursor-pointer items-center justify-center",
              tone === "brand" ? "text-[#1C5DD4]" : "text-[#9A9AB0]",
            )}
          >
            <X size={12} strokeWidth={2.6} aria-hidden />
          </button>
        </span>
      ))}

      <input
        value={draft}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
            return;
          }
          if (event.key === "Backspace" && !draft && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        className="min-w-[160px] flex-1 border-none bg-transparent px-1 py-[5px] text-sm text-[#333333] outline-none placeholder:text-[#9A9AB0]"
      />
    </div>
  );
}
