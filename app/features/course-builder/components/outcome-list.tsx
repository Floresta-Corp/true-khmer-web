import { Trash2 } from "lucide-react";

interface OutcomeListProps {
  values: string[];
  onChange: (values: string[]) => void;
}

/**
 * The builder's "What you'll learn" field: one input per outcome, each
 * removable once there is more than one, plus the design's two "+ Add outcome"
 * affordances — a text button beside the label and a full-width dashed button
 * under the list.
 *
 * The list always holds at least one row so the field is never visually empty;
 * blank rows are dropped on save.
 */
export function OutcomeList({ values, onChange }: OutcomeListProps) {
  const rows = values.length > 0 ? values : [""];

  const add = () => onChange([...rows, ""]);

  const update = (index: number, value: string) =>
    onChange(rows.map((row, i) => (i === index ? value : row)));

  const remove = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [""]);
  };

  return (
    <div>
      <div className="mb-[7px] flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-[#1A1A2E]">
          What you&apos;ll learn
        </span>
        <button
          type="button"
          onClick={add}
          className="cursor-pointer text-[13px] font-bold text-[#1C5DD4]"
        >
          + Add outcome
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <input
              value={row}
              onChange={(event) => update(index, event.target.value)}
              aria-label={`Learning outcome ${index + 1}`}
              placeholder="e.g. Create a measurable digital marketing goal"
              className="min-w-0 flex-1 rounded-lg border border-[#E5E7EB] px-3.25 py-[11px] text-sm text-[#333333] outline-none focus:border-[#1C5DD4]"
            />
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                title="Remove point"
                aria-label={`Remove learning outcome ${index + 1}`}
                className="flex size-5.5 shrink-0 cursor-pointer items-center justify-center p-1 text-[#DC2626]"
              >
                <Trash2 className="size-full" aria-hidden />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-2.5 w-full cursor-pointer rounded-lg border-[1.5px] border-dashed border-[#E5E7EB] p-3 text-[13px] font-bold text-[#1C5DD4]"
      >
        + Add outcome
      </button>
    </div>
  );
}
