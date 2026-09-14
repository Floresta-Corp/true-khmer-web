import { useEffect, useState } from "react";
import {
  useFetcher,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";
import { toast } from "sonner";
import { readActionResult } from "~/lib/action-result";
import type { BlogPostSummaryResponse } from "~/types/api-client";
import { BLOG_MODERATION_INTENTS } from "../../types";

interface ModerationActionResult {
  ok?: boolean;
  message?: string;
  error?: string;
}

type PendingDelete = Pick<BlogPostSummaryResponse, "id" | "title"> | null;

export function useBlogModerationList() {
  const location = useLocation();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<ModerationActionResult>();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  useEffect(() => {
    if (!fetcher.data) return;

    const { ok, message } = readActionResult(fetcher.data);
    if (ok) toast.success(message || "Post updated successfully.");
    else toast.error(message || "Post action failed.");
  }, [fetcher.data]);

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  }

  function featurePost(postId: string) {
    fetcher.submit(
      {
        intent: BLOG_MODERATION_INTENTS.feature,
        postId,
        isFeatured: "true",
      },
      { method: "post" },
    );
  }

  function confirmDelete() {
    if (!pendingDelete) return;

    fetcher.submit(
      {
        intent: BLOG_MODERATION_INTENTS.delete,
        postId: pendingDelete.id,
      },
      { method: "post" },
    );
    setPendingDelete(null);
  }

  return {
    closeDeleteDialog: () => setPendingDelete(null),
    confirmDelete,
    featurePost,
    goToPage,
    isLoadingContent:
      navigation.state === "loading" &&
      navigation.location?.pathname === location.pathname,
    isMutating: fetcher.state !== "idle",
    pendingDelete,
    requestDelete: (post: BlogPostSummaryResponse) =>
      setPendingDelete({ id: post.id, title: post.title }),
  };
}
