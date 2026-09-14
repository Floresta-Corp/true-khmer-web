import { LayoutGrid, Tags } from "lucide-react";
import { AuthorAvatar } from "~/components/author-avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { BLOG_TAG_LIMIT } from "../../types";
import type { BlogFormState } from "./use-blog-form";

interface BlogFormMetaProps {
  form: BlogFormState;
  /** The rich-text editor, rendered in the same column as the title. */
  children: React.ReactNode;
}

export function BlogFormMeta({ form, children }: BlogFormMetaProps) {
  const { categories, fields, isEditable, refs, resizeTextarea, setters } =
    form;

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      setters.addTag(fields.tagInput);
      return;
    }
    if (event.key === "Backspace" && !fields.tagInput) {
      const lastTag = fields.tags[fields.tags.length - 1];
      if (lastTag) setters.removeTag(lastTag);
    }
  }

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <div className="space-y-5">
        <Textarea
          ref={refs.titleInputRef}
          value={fields.title}
          disabled={!isEditable}
          onChange={(event) => {
            setters.setTitle(event.target.value);
            resizeTextarea(event.currentTarget);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.shiftKey) return;
            event.preventDefault();
            refs.excerptInputRef.current?.focus();
          }}
          rows={1}
          className="blog-compose-title min-h-0 w-full resize-none border-0 bg-transparent px-0 text-slate-950 outline-none placeholder:text-slate-400 focus:outline-none dark:bg-transparent dark:text-white dark:placeholder:text-slate-500"
          placeholder="Title"
        />
        <Textarea
          ref={refs.excerptInputRef}
          value={fields.excerpt}
          disabled={!isEditable}
          onChange={(event) => {
            setters.setExcerpt(event.target.value);
            resizeTextarea(event.currentTarget);
          }}
          rows={1}
          className="blog-compose-subtitle min-h-0 w-full resize-none border-0 bg-transparent px-0 text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none dark:bg-transparent dark:text-slate-300 dark:placeholder:text-slate-500"
          placeholder="Add a subtitle..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="inline-flex min-h-11 max-w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
          <AuthorAvatar
            name={form.author.name}
            avatarKey={form.author.avatarKey}
            className="h-6.5 w-6.5 text-[11px]"
          />
          <span className="truncate text-sm text-slate-700 dark:text-slate-300">
            {form.author.name}
          </span>
        </div>
        <div className="flex h-11 min-w-[220px] items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
          <span className="inline-flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-(--blog-primary)/15 text-(--blog-primary)">
            <LayoutGrid className="h-3.5 w-3.5" />
          </span>
          <Select
            value={fields.categoryId}
            disabled={!isEditable}
            onValueChange={setters.setCategoryId}
          >
            <SelectTrigger className="h-auto min-w-0 border-0 bg-transparent px-0 text-blue-800 shadow-none focus:ring-0 dark:bg-transparent dark:text-blue-300">
              <SelectValue
                placeholder={
                  categories.length > 0
                    ? "Select category"
                    : "No categories yet"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-h-11 basis-full flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 xl:min-w-[220px] xl:flex-1 xl:basis-auto dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
          <span className="inline-flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
            <Tags className="h-3.5 w-3.5" />
          </span>
          {fields.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-amber-200 bg-amber-100 px-3 text-sm font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/40 dark:text-amber-200"
            >
              {tag}
              {isEditable ? (
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => setters.removeTag(tag)}
                  className="size-4 rounded-full hover:bg-amber-500/20"
                  aria-label={`Remove ${tag} tag`}
                >
                  x
                </Button>
              ) : null}
            </span>
          ))}
          <Input
            type="text"
            value={fields.tagInput}
            onChange={(event) => setters.setTagInput(event.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() =>
              fields.tagInput.trim() && setters.addTag(fields.tagInput)
            }
            className="h-auto min-w-[120px] flex-1 border-0 bg-transparent px-0 text-sm leading-none text-amber-800 shadow-none focus-visible:ring-0 dark:bg-transparent dark:text-amber-300"
            placeholder={
              fields.tags.length >= BLOG_TAG_LIMIT
                ? "Maximum 5 tags"
                : "Add a tag"
            }
            disabled={!isEditable || fields.tags.length >= BLOG_TAG_LIMIT}
          />
        </div>
      </div>

      <div className="pt-2">{children}</div>
    </div>
  );
}
