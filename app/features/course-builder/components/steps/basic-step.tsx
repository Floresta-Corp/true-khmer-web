import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { CoverImageField } from "../cover-image-field";
import { DifficultyCards } from "../difficulty-cards";
import { TokenInput } from "../token-input";
import type {
  CategoryOption,
  CourseDraft,
} from "~/features/course-builder/types";

const LABEL = "mb-2 block text-sm font-bold text-[#1A1A2E]";
const FIELD =
  "w-full rounded-lg border border-[#E5E7EB] px-3.5 py-[13px] text-sm text-[#333333] outline-none focus:border-[#1C5DD4]";

interface BasicStepProps {
  draft: CourseDraft;
  categories: CategoryOption[];
  fieldErrors: Record<string, string[] | undefined>;
  onChange: (patch: Partial<CourseDraft>) => void;
}

export function BasicStep({
  draft,
  categories,
  fieldErrors,
  onChange,
}: BasicStepProps) {
  const error = (name: string) => fieldErrors[name]?.[0];

  return (
    <div className="flex flex-col gap-[22px]">
      <div>
        <label className={LABEL} htmlFor="course-title">
          Course title
        </label>
        <input
          id="course-title"
          value={draft.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="e.g. Digital Marketing for Small Shops"
          className={cn(FIELD, error("title") && "border-[#FB3748]")}
        />
        {error("title") && (
          <p className="mt-1.5 text-[13px] text-[#FB3748]">{error("title")}</p>
        )}
      </div>

      <div>
        <label className={LABEL} htmlFor="course-description">
          Course description
        </label>
        <textarea
          id="course-description"
          rows={4}
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Give learners a clear overview of what this course covers and what they can expect."
          className={cn(
            FIELD,
            "resize-y",
            error("description") && "border-[#FB3748]",
          )}
        />
        {error("description") && (
          <p className="mt-1.5 text-[13px] text-[#FB3748]">
            {error("description")}
          </p>
        )}
      </div>

      <div>
        <label className={LABEL} htmlFor="course-category">
          Category
        </label>
        <div className="relative">
          <select
            id="course-category"
            value={draft.categoryId}
            onChange={(event) => onChange({ categoryId: event.target.value })}
            className={cn(
              FIELD,
              "cursor-pointer appearance-none bg-white pr-10",
              error("categoryId") && "border-[#FB3748]",
            )}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.8}
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[#6B7280]"
          />
        </div>
        {error("categoryId") && (
          <p className="mt-1.5 text-[13px] text-[#FB3748]">
            {error("categoryId")}
          </p>
        )}
        {categories.length === 0 && (
          <p className="mt-1.5 text-[13px] text-[#9A9AB0]">
            No categories are available yet.
          </p>
        )}
      </div>

      <div>
        <span className={cn(LABEL, "mb-2.5")}>Level of difficulty</span>
        <DifficultyCards
          value={draft.difficulty}
          onChange={(difficulty) => onChange({ difficulty })}
        />
      </div>

      <div>
        <span className={LABEL}>Skills learners will gain</span>
        <TokenInput
          values={draft.skills}
          tone="neutral"
          ariaLabel="Add a skill"
          placeholder="e.g. SEO Strategy — press Enter"
          onChange={(skills) => onChange({ skills })}
        />
      </div>

      <div>
        <span className={LABEL}>Tags (optional)</span>
        <TokenInput
          values={draft.tags}
          tone="brand"
          ariaLabel="Add a tag"
          placeholder="Add a tag and press Enter"
          onChange={(tags) => onChange({ tags })}
        />
      </div>

      <div>
        <span className={LABEL}>Cover image</span>
        <CoverImageField
          previewUrl={draft.coverPreviewUrl}
          onUploaded={(coverImageKey, coverPreviewUrl) =>
            onChange({ coverImageKey, coverPreviewUrl })
          }
          onClear={() =>
            onChange({ coverImageKey: null, coverPreviewUrl: null })
          }
        />
      </div>
    </div>
  );
}
