import { useEffect, useState } from "react";
import { SanitizedHtml } from "~/components/sanitized-html";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES,
  BLOG_CONTENT_EXTRA_ALLOWED_TAGS,
} from "~/lib/blog-content-sanitize";
import { formatDate } from "~/lib/time";
import { BLOG_PREVIEW_STORAGE_KEY, type BlogPreviewDraft } from "../types";

export function BlogPreview() {
  const [draft, setDraft] = useState<BlogPreviewDraft | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(BLOG_PREVIEW_STORAGE_KEY);
    if (!raw) return;
    try {
      setDraft(JSON.parse(raw) as BlogPreviewDraft);
    } catch {
      setDraft(null);
    }
  }, []);

  function handleBackToEditor() {
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
      window.close();
      return;
    }
    if (draft?.editorUrl) {
      window.location.href = draft.editorUrl;
      return;
    }
    window.history.back();
  }

  const displayDate = formatDate(
    draft?.previewDate || new Date().toISOString(),
  );

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Preview
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This view uses your current unsaved draft state.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleBackToEditor}
            className="h-10 px-4"
          >
            Back to Editor
          </Button>
        </div>
      </div>

      {draft ? (
        <div className="bg-white px-6 py-8 sm:px-10 lg:px-14 dark:bg-slate-950">
          <div className="mx-auto max-w-4xl">
            <div className="text-xs font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">
              Home • Blog • {draft.categoryName || "Blog Preview"}
            </div>

            {draft.coverImageUrl ? (
              <figure className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                <img
                  src={draft.coverImageUrl}
                  alt={draft.coverImageAlt || draft.title || "Blog cover"}
                  className="max-h-[520px] w-full object-cover"
                />
                {draft.coverImageCaption ? (
                  <figcaption className="px-6 py-4 text-center text-sm text-slate-500 italic dark:text-slate-400">
                    {draft.coverImageCaption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {draft.categoryName ? (
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold tracking-[0.05em] text-white uppercase backdrop-blur-[6px]">
                  {draft.categoryName}
                </span>
              </div>
            ) : null}

            <div
              className={`${draft.categoryName ? "mt-3" : "mt-8"} flex flex-wrap gap-2`}
            >
              {draft.tags.length > 0 ? (
                draft.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-(--blog-primary)/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-(--blog-primary) uppercase"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Add tags to preview them here
                </span>
              )}
            </div>

            <h1 className="mt-5 text-4xl leading-[0.98] font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-[4rem] dark:text-white">
              {draft.title || "Title"}
            </h1>

            <p className="mt-5 max-w-3xl text-xl leading-9 text-slate-600 dark:text-slate-300">
              {draft.excerpt ||
                "Add a subtitle to preview the blog summary here."}
            </p>

            <div className="mt-8 flex items-center justify-between gap-4 border-y border-border py-5">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {draft.authorName || "Author"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {draft.authorRole ? `${draft.authorRole} • ` : ""}
                  {displayDate}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground">
                ↗
              </div>
            </div>

            <article className="mt-10">
              <SanitizedHtml
                html={draft.content || "<p></p>"}
                className="blog-rich-text max-w-none"
                extraAllowedTags={BLOG_CONTENT_EXTRA_ALLOWED_TAGS}
                extraAllowedAttributes={BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES}
              />
            </article>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-6 py-20">
          <Card className="rounded-[30px] border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">
              No preview data found
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Open preview from the blog editor so the current draft can be
              loaded here.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
