import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import { toast } from "sonner";
import { debounce } from "~/lib/utils";
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

  const updateSearchParams = useCallback(
    (query: string) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);
          if (query) params.set("search", query);
          else params.delete("search");
          return params;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const debouncedSearch = useMemo(
    () => debounce(updateSearchParams, 300),
    [updateSearchParams],
  );

  useEffect(() => {
    // A URL change can come from browser navigation. Do not let a pending edit
    // replace that external state after the debounce delay.
    debouncedSearch.cancel();
  }, [debouncedSearch, searchParams]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  function updateSearch(value: string) {
    setSearch(value);
    const query = value.trim();
    if ((searchParams.get("search") ?? "") === query) {
      debouncedSearch.cancel();
      return;
    }

    debouncedSearch(query);
  }

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
    setSearch: updateSearch,
    submitDialog,
    toggleVisibility,
    visibleCount,
  };
}
