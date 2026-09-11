import { useEffect, useMemo, useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import { toast } from "sonner";
import type { BlogCategoryWithUsageResponse } from "~/types/api-client";
import { BLOG_CATEGORY_INTENTS, type BlogCategoryIntent } from "../../types";

interface CategoryActionResult {
  ok: boolean;
  intent: string;
  message: string;
}

type CategoryDialogState =
  | { mode: "create"; name: string }
  | { mode: "edit"; categoryId: string; name: string };

export function useBlogCategoryManager(
  categories: BlogCategoryWithUsageResponse[],
  initialSearch: string,
) {
  const fetcher = useFetcher<CategoryActionResult>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [dialog, setDialog] = useState<CategoryDialogState | null>(null);

  const visibleCount = useMemo(
    () => categories.filter((category) => category.isVisible).length,
    [categories],
  );

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const query = search.trim();
    if ((searchParams.get("search") ?? "") === query) return;

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) params.set("search", query);
      else params.delete("search");
      setSearchParams(params, { replace: true, preventScrollReset: true });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search, searchParams, setSearchParams]);

  useEffect(() => {
    const result = fetcher.data;
    if (!result) return;

    if (!result.ok) {
      toast.error(result.message || "Category action failed.");
      return;
    }

    toast.success(result.message || "Category updated successfully.");
    if (
      result.intent === BLOG_CATEGORY_INTENTS.create ||
      result.intent === BLOG_CATEGORY_INTENTS.update
    ) {
      setDialog(null);
    }
  }, [fetcher.data]);

  function submit(intent: BlogCategoryIntent, fields: Record<string, string>) {
    fetcher.submit({ intent, ...fields }, { method: "post" });
  }

  function openCreateDialog() {
    setDialog({ mode: "create", name: "" });
  }

  function openEditDialog(category: BlogCategoryWithUsageResponse) {
    setDialog({
      mode: "edit",
      categoryId: category.id,
      name: category.name,
    });
  }

  function setDialogName(name: string) {
    setDialog((current) => (current ? { ...current, name } : current));
  }

  function submitDialog() {
    if (!dialog) return;

    if (dialog.mode === "create") {
      submit(BLOG_CATEGORY_INTENTS.create, { name: dialog.name });
      return;
    }

    submit(BLOG_CATEGORY_INTENTS.update, {
      categoryId: dialog.categoryId,
      name: dialog.name,
    });
  }

  function toggleVisibility(category: BlogCategoryWithUsageResponse) {
    submit(BLOG_CATEGORY_INTENTS.toggleVisibility, {
      categoryId: category.id,
      isVisible: String(!category.isVisible),
    });
  }

  return {
    closeDialog: () => setDialog(null),
    dialog,
    isSubmitting: fetcher.state !== "idle",
    openCreateDialog,
    openEditDialog,
    search,
    setDialogName,
    setSearch,
    submitDialog,
    toggleVisibility,
    visibleCount,
  };
}
